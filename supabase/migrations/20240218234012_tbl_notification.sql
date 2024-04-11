create table if not exists elwood.notification (
  "instance_id" uuid not null default '00000000-0000-0000-0000-000000000000',
  "id" uuid not null default uuid_generate_v4(),
  "user_id" uuid not null,
  "type" text not null default 'GENERIC',
  "data" jsonb not null default '{}'::jsonb,
  "has_seen" boolean not null default false,
  "seen_at" timestamptz null,
  "created_at" timestamptz default now(),
  "updated_at" timestamptz default now(),
  constraint "elwood_notification_user_id"
    foreign key ("user_id") references "auth"."users" ("id"),
  primary key ("id")
);

alter table "elwood"."notification" enable row level security;

drop view if exists public.elwood_notification;
create view public.elwood_notification as
  select
    "id",
    "type",
    "data",
    "has_seen",
    "seen_at",
    "created_at",
    "updated_at"
  from elwood.notification;


create policy "Members can view their own notifications."
on elwood.notification for select
to authenticated
using (elwood.is_a_member() AND "user_id" = auth.uid());

create policy "Members can update their own notification."
on elwood.notification for update
to authenticated                     
with check (elwood.is_a_member() AND "user_id" = auth.uid());  
