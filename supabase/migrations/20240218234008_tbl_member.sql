

CREATE TABLE elwood.member (
  "instance_id" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000',
  "id" uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  "user_id" uuid NOT NULL,
  "type" public.elwood_member_type NOT NULL DEFAULT 'USER',
  "username" text NULL,
  "display_name" text NULL,
  "added_by_user_id" uuid NULL,
  "role" elwood.member_role NOT NULL DEFAULT 'MEMBER',
  "created_at" timestamptz default now(),
  "updated_at" timestamptz default now(),

  CONSTRAINT "elwood_member_user_id" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id"),
  CONSTRAINT "elwood_member_added_by_user_id" FOREIGN KEY ("added_by_user_id") REFERENCES "auth"."users"("id"),
  PRIMARY KEY ("id")
);


CREATE UNIQUE INDEX IF NOT EXISTS elwood_idx_member_user_id ON elwood.member("instance_id", "user_id");
CREATE UNIQUE INDEX IF NOT EXISTS elwood_idx_member_username ON elwood.member("instance_id", "username");
alter table elwood."member" enable row level security;

DROP FUNCTION IF EXISTS elwood.is_a_member() CASCADE;
create function elwood.is_a_member()
returns boolean
language plpgsql
security definer
as $$
begin
  return exists (
    select 1 from elwood.member
    where auth.uid() = user_id 
  );
end;
$$;


CREATE VIEW public.elwood_member AS
  SELECT 
    "id",
    "user_id",
    "type",
    "username",
    "display_name",
    "added_by_user_id",
    "role",
    "created_at",
    "updated_at"
  FROM elwood.member;

create policy "Members can view all members."
on elwood.member for select
to authenticated
using (elwood.is_a_member());

create policy "Member can update their own member row."
on elwood.member for update
to authenticated           
using ( auth.uid() = user_id )
with check ( auth.uid() = user_id ); 