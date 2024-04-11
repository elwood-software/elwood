
-- NODE_TYPE
DROP TYPE IF EXISTS public.elwood_node_type CASCADE;
CREATE TYPE public.elwood_node_type AS ENUM (
    'TREE',
    'BLOB',
    'BUCKET'
);

-- NODE
DROP TYPE IF EXISTS public.elwood_node CASCADE;
CREATE TYPE public.elwood_node AS  (
    "id" text,
    "object_id" uuid,
    "type" public.elwood_node_type, 
    "prefix" text[],
    "name" text,
    "mime_type" text,
    "size" int    
);


DROP TYPE IF EXISTS public.elwood_storage_search_result CASCADE;
CREATE TYPE public.elwood_storage_search_result AS (
    name text,
    id uuid,
    updated_at timestamptz,
    created_at timestamptz,
    last_accessed_at timestamptz,
    metadata jsonb
);

DROP TYPE IF EXISTS public.elwood_get_node_result CASCADE;
CREATE TYPE public.elwood_get_node_result AS  (
  "node" public.elwood_node,
  "parent" public.elwood_node,
  "children" public.elwood_node[],
  "key_children" text[]
);


DROP TYPE IF EXISTS public.elwood_node_tree CASCADE;
CREATE TYPE public.elwood_node_tree AS  (
  "node" public.elwood_node,
  "id" text,
  "parent" text
);

DROP TYPE IF EXISTS public.elwood_get_node_tree_result CASCADE;
CREATE TYPE public.elwood_get_node_tree_result AS  (
  "rootNodeId" text,
  "expandedIds" text[],
  "tree" public.elwood_node_tree[]
);

DROP TYPE IF EXISTS public.elwood_member_type CASCADE;
CREATE TYPE public.elwood_member_type AS ENUM (
  'USER',
  'TEAM'
);

--
-- @@ NAMESPACE: ELWOOD
--

DROP TYPE IF EXISTS elwood.get_node_leaf_result CASCADE;
CREATE TYPE elwood.get_node_leaf_result AS (
  "node" public.elwood_node
);

DROP TYPE IF EXISTS elwood.follow_type CASCADE;
CREATE TYPE elwood.follow_type AS ENUM (
  'SAVE',
  'SUBSCRIBE'
);

DROP TYPE IF EXISTS elwood.member_role CASCADE;
CREATE TYPE elwood.member_role AS ENUM (
  'ADMIN',
  'MANAGER',
  'MEMBER'
);

DROP TYPE IF EXISTS elwood.activity_type CASCADE;
CREATE TYPE elwood.activity_type AS ENUM (
    'COMMENT',
    'REACTION',
    'LIKE'
);
