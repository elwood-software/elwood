create table elwood.setting (
  "instance_id" uuid not null default '00000000-0000-0000-0000-000000000000',
  "name" varchar(20) not null primary key,
  "value" jsonb not null default '{}'::jsonb,
  "created_at" timestamptz default now(),
  "updated_at" timestamptz default now()
);

create unique index if not exists elwood_idx_settings_name on elwood.setting (
  "instance_id",
  "name"
);

alter table elwood."setting" enable row level security;
