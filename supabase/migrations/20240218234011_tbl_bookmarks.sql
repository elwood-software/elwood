create table if not exists elwood.bookmark (
  "instance_id" uuid not null default '00000000-0000-0000-0000-000000000000',
  "id" uuid not null default uuid_generate_v4(),
  "user_id" uuid not null,
  "member_id" uuid not null,
  "asset_id" text not null,
  "asset_type" text not null,
  "is_active" boolean not null default false,
  "is_subscribed" boolean not null default false,
  "created_at" timestamptz default now(),
  "updated_at" timestamptz default now(),

  constraint "elwood_activity_user_id"
    foreign key ("user_id") references "auth"."users" ("id"),
  constraint "elwood_activity_member_id"
    foreign key ("member_id") references "elwood"."member" ("id"),
  primary key ("id")
);

create unique index if not exists elwood_idx_bookmark_user_asset on elwood.bookmark (
  "user_id",
  "asset_id",
  "asset_type"
);


alter table "elwood"."bookmark" enable row level security;

DROP VIEW  IF EXISTS public.elwood_bookmark;
CREATE VIEW public.elwood_bookmark AS
  SELECT
    "id",
    "user_id",
    "member_id",
    "asset_id",
    "asset_type",
    "is_active",
    "is_subscribed",
    "created_at",
    "updated_at"
  FROM elwood.bookmark;

create policy "Members can view their own bookmarks."
on elwood.bookmark for select
to authenticated
using ("user_id" = auth.uid());

create policy "Members can create their own bookmarks."
on elwood.activity for insert
to authenticated                     
with check ("user_id" = auth.uid());  

create policy "Members can update their own bookmarks."
on elwood.activity for update
to authenticated                     
with check ("user_id" = auth.uid());  


-- BEFORE INSERT
CREATE OR REPLACE FUNCTION elwood.before_bookmark_insert()
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

CREATE TRIGGER trigger_before_bookmark_insert
BEFORE INSERT
ON elwood.bookmark
FOR EACH ROW
EXECUTE FUNCTION elwood.before_bookmark_insert();
