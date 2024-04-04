
-- PROFILE
CREATE TABLE elwood.member (
  "instance_id" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000',
  "id" uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  "user_id" uuid NOT NULL,
  "type" public.elwood_member_type NOT NULL DEFAULT 'USER',
  "username" text NULL,
  "display_name" text NULL,
  "added_by_user_id" uuid NULL,
  
  "created_at" timestamptz default now(),
  "updated_at" timestamptz default now(),

  CONSTRAINT "elwood_member_user_id" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id"),
  CONSTRAINT "elwood_member_added_by_user_id" FOREIGN KEY ("added_by_user_id") REFERENCES "auth"."users"("id"),
  PRIMARY KEY ("id")
);

-- only one user_id per instance
CREATE UNIQUE INDEX IF NOT EXISTS elwood_idx_member_user_id ON elwood.member("instance_id", "user_id");
-- only one username per instance
CREATE UNIQUE INDEX IF NOT EXISTS elwood_idx_member_username ON elwood.member("instance_id", "username");


-- SETTINGS
CREATE TABLE elwood.settings (
  "instance_id" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000',
  "name" VARCHAR(20) NOT NULL PRIMARY KEY,
  "value" jsonb NOT NULL DEFAULT '{}'::jsonb,
  "created_at" timestamptz default now(),
  "updated_at" timestamptz default now()
);

-- only one name per instance
CREATE UNIQUE INDEX IF NOT EXISTS elwood_idx_settings_name ON elwood.settings("instance_id", "name");


-- MESSAGES
CREATE TABLE elwood.message (
  "instance_id" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000',
  "user_id" uuid NOT NULL,
  "asset" text NOT NULL,
  "asset_type" TEXT NOT NULL,
  "type" elwood.activity_type NOT NULL,
  "text" text NOT NULL,  
  "attachments" jsonb NOT NULL DEFAULT '{}'::jsonb,
  "created_at" timestamptz default now(),
  "updated_at" timestamptz default now()
);

