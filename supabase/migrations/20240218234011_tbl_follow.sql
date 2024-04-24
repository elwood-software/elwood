create table if not exists elwood.follow (
  "instance_id" uuid not null default '00000000-0000-0000-0000-000000000000',
  "id" uuid not null default uuid_generate_v4(),
  "user_id" uuid not null,
  "type" elwood.follow_type not null DEFAULT 'SAVE',
  "asset_type" text not null,
  "asset_id" text not null,
  "is_active" boolean not null default false,
  "created_at" timestamptz default now(),
  "updated_at" timestamptz default now(),

  constraint "elwood_follow_user_id"
    foreign key ("user_id") references "auth"."users" ("id"),

  primary key ("id")
);

create unique index if not exists elwood_idx_follow_user_asset on elwood.follow (
  "user_id",
  "type",
  "asset_type",
  "asset_id"
);


alter table "elwood"."follow" enable row level security;

DROP VIEW  IF EXISTS public.elwood_follow;
CREATE VIEW public.elwood_follow AS
  SELECT
    "id",
    "user_id",
    "type",
    "asset_type",
    "asset_id",
    "is_active",
    "created_at",
    "updated_at",
    (split_part(asset_id, ':', 3) = 'blob')::boolean as is_object_blob,
    (select name from storage.buckets where id = split_part(asset_id, ':', 4)) as bucket_name,
    replace(
      CASE
        WHEN split_part(asset_id, ':', 5) = '' THEN NULL
        ELSE (select name from storage.objects where id = split_part(asset_id, ':', 5)::uuid)
      END,
      '/.emptyFolderPlaceholder',
      ''
    ) as object_name
  FROM elwood.follow;

create policy "Members can view their own follows."
on elwood.follow for select
to authenticated
using (elwood.is_a_member() AND "user_id" = auth.uid());

create policy "Members can create their own follow."
on elwood.follow for insert
to authenticated                     
with check (elwood.is_a_member() AND "user_id" = auth.uid());  

create policy "Members can update their own follow."
on elwood.follow for update
to authenticated                     
with check (elwood.is_a_member() AND "user_id" = auth.uid());  


-- BEFORE INSERT
CREATE OR REPLACE FUNCTION elwood.before_follow_insert()
  RETURNS TRIGGER
  LANGUAGE PLPGSQL
AS
$$
DECLARE
  _user_id uuid := auth.uid();
BEGIN
  -- users can only insert activity for themselves
  NEW.user_id = _user_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_before_follow_insert
BEFORE INSERT
ON elwood.follow
FOR EACH ROW
EXECUTE FUNCTION elwood.before_follow_insert();
