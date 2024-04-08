
-- ACTIVITY
CREATE TABLE IF NOT EXISTS elwood.activity (
  "instance_id" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000',
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" uuid NOT NULL,
  "asset_id" text NOT NULL,
  "asset_type" TEXT NOT NULL,
  "is_resolved" BOOLEAN NOT NULL DEFAULT FALSE,
  "type" elwood.activity_type NOT NULL,
  "text" text NOT NULL,  
  "attachments" jsonb NOT NULL DEFAULT '{}'::jsonb,
  "created_at" timestamptz default now(),
  "updated_at" timestamptz default now(),
  
  CONSTRAINT "elwood_activity_user_id" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id"),
  PRIMARY KEY ("id")
);

alter table elwood."activity" enable row level security;

CREATE VIEW public.elwood_activity AS
  SELECT
    "id",
    "user_id",
    "asset_id",
    "asset_type",
    "is_resolved",
    "type",
    "text",  
    "attachments",
    "created_at",
    "updated_at"
  FROM elwood.activity;

create policy "Members can view all activity."
on elwood.activity for select
to authenticated
using (elwood.is_a_member());

create policy "Members can create activity."
on elwood.activity for insert
to authenticated                     
with check (elwood.is_a_member());   