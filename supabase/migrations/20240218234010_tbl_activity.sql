

CREATE TABLE IF NOT EXISTS elwood.activity (
  "instance_id" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000',
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" uuid NOT NULL,
  "member_id" uuid NOT NULL,
  "asset_id" text NOT NULL,
  "asset_type" TEXT NOT NULL,
  "is_resolved" BOOLEAN NOT NULL DEFAULT FALSE,
  "is_deleted" BOOLEAN NOT NULL DEFAULT FALSE,
  "type" elwood.activity_type NOT NULL,
  "text" text NOT NULL,  
  "attachments" jsonb NOT NULL DEFAULT '{}'::jsonb,
  "created_at" timestamptz default now(),
  "updated_at" timestamptz default now(),
  
  CONSTRAINT "elwood_activity_user_id" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id"),
  CONSTRAINT "elwood_activity_member_id" FOREIGN KEY ("member_id") REFERENCES "elwood"."member"("id"),
  PRIMARY KEY ("id")
);

alter table elwood."activity" enable row level security;

DROP VIEW  IF EXISTS public.elwood_activity;
CREATE VIEW public.elwood_activity with (security_invoker=on)
  AS SELECT
    "a"."id",
    "a"."user_id",
    "a"."member_id",
    "a"."asset_id",
    "a"."asset_type",
    "a"."is_deleted",
    "a"."is_resolved",
    "a"."type",
    "a"."text",  
    "a"."attachments",
    "a"."created_at",
    "a"."updated_at"
  FROM elwood.activity as a;

create policy "Members can view all activity."
on elwood.activity for select
to authenticated
using (elwood.is_a_member());

create policy "Members can create activity."
on elwood.activity for insert
to authenticated                     
with check (elwood.is_a_member());  


-- BEFORE INSERT
CREATE OR REPLACE FUNCTION elwood.before_activity_insert()
  RETURNS TRIGGER
  LANGUAGE PLPGSQL
AS
$$
DECLARE
  _user_id uuid := auth.uid();
  _member_id uuid;
BEGIN
  SELECT id INTO _member_id FROM elwood.member WHERE user_id = _user_id;
  NEW.member_id = _member_id;
  -- users can only insert activity for themselves
  NEW.user_id = _user_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_before_activity_insert
BEFORE INSERT
ON elwood.activity
FOR EACH ROW
EXECUTE FUNCTION elwood.before_activity_insert();
