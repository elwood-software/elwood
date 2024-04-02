CREATE EXTENSION IF NOT EXISTS vector SCHEMA extensions;
CREATE SCHEMA IF NOT EXISTS elwood;

grant usage on schema elwood to postgres, anon, authenticated, service_role;
alter default privileges in schema elwood grant all on tables to postgres, anon, authenticated, service_role;
alter default privileges in schema elwood grant all on functions to postgres, anon, authenticated, service_role;
alter default privileges in schema elwood grant all on sequences to postgres, anon, authenticated, service_role;
