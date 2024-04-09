CREATE SCHEMA IF NOT EXISTS "local_only";


CREATE OR REPLACE FUNCTION "local_only".create_user(
  user_id uuid, 
  email text, 
  password text, 
  sudo_user text
) RETURNS uuid AS $$
DECLARE
  encrypted_pw text;
BEGIN
  encrypted_pw := crypt(password, gen_salt('bf'));
  
  INSERT INTO auth.users
    (
        "instance_id", 
        "id", 
        "aud", 
        "role", 
        "email", 
        "encrypted_password", 
        "email_confirmed_at", 
        "recovery_sent_at", 
        "last_sign_in_at", 
        "raw_app_meta_data", 
        "raw_user_meta_data", 
        "created_at", 
        "updated_at", 
        "confirmation_token", 
        "email_change", 
        "email_change_token_new", 
        "recovery_token",
        "is_super_admin"
    )
  VALUES
    ('00000000-0000-0000-0000-000000000000', 
    user_id, 
    'authenticated', 
    'authenticated', 
    email, 
    encrypted_pw, 
    now(), 
    now(), 
    now(), 
    jsonb_build_object(
      'provider', 'email',
      'providers', json_build_array(ARRAY['email']),
      'sudo_user', sudo_user
    ),
    '{}', 
    now(), 
    now(), 
    '', 
    '', 
    '', 
    '',
    false
    );
  
  INSERT INTO auth.identities (
        "id", 
        "user_id", 
        "identity_data", 
        "provider",
        "provider_id", 
        "last_sign_in_at", 
        "created_at", 
        "updated_at"
    )
    VALUES (
        gen_random_uuid(), 
        user_id, 
        format('{"sub":"%s","email":"%s"}', 
        user_id::text, 
        email)::jsonb, 
        'email', 
        email,
        now(), 
        now(), 
        now()
    );

    RETURN user_id;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
    user_id uuid;
    user_id_two uuid;
    user_id_three uuid;
    user_id_four uuid;
BEGIN

  -- create super admin
  user_id := local_only.create_user('48ee2fe0-e702-4ff1-a5e8-7461ef8711e0', 'super_admin@elwood.local', 'admin', 'super_admin');
  INSERT INTO elwood.member ("user_id", "username", "display_name") VALUES (user_id, 'super_admin', 'Super Admin User');

  -- create admin
  user_id_two := local_only.create_user('def30197-b829-43a3-8b45-fb3a354e5d4d', 'admin@elwood.local', 'admin', '');
  INSERT INTO elwood.member ("user_id", "username", "display_name") VALUES (user_id_two, 'admin', 'Admin');

  -- create member
  user_id_three := local_only.create_user('fe636a7f-e263-4392-9366-5a86e9b75846', 'member@elwood.local', 'member', '');
  INSERT INTO elwood.member ("user_id", "username", "display_name") VALUES (user_id_three, 'member', 'Basic Member');

  -- not a member
  user_id_three := local_only.create_user(gen_random_uuid(), 'no_member@elwood.local', 'no_member', '');


END $$;



-- @@
-- BUCKETS
----------------

DROP POLICY IF EXISTS "select_for_buckets" on "storage"."buckets";
CREATE POLICY "select_for_buckets"
ON storage.buckets
FOR SELECT
USING (
  auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "insert_for_buckets" on "storage"."buckets";
CREATE POLICY "insert_for_buckets"
ON storage.buckets
FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated'
);

DROP POLICY IF EXISTS "update_for_buckets" on "storage"."buckets";
CREATE POLICY "update_for_buckets"
ON storage.buckets
FOR UPDATE
WITH CHECK (
  auth.role() = 'authenticated'
);

DROP POLICY IF EXISTS "delete_for_buckets" on "storage"."buckets";
CREATE POLICY "delete_for_buckets"
ON storage.buckets
FOR DELETE
USING (
  auth.role() = 'authenticated'
);


-- @@
-- OBJECTS
----------------

DROP POLICY IF EXISTS "select_for_objects" on "storage"."objects";
CREATE POLICY "select_for_objects"
ON storage.objects
FOR SELECT
USING (
  auth.role() = 'authenticated'
);

DROP POLICY IF EXISTS "insert_for_objects" on "storage"."objects";
CREATE POLICY "insert_for_objects"
ON storage.objects
FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated'
);