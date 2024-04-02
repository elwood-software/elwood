
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
  "children" public.elwood_node[]
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
  'TEAM',
  'GUEST'
);

DROP TYPE IF EXISTS public.elwood_member CASCADE;
CREATE TYPE public.elwood_member AS  (
  "username" text,
  "display_name" text,
  "type" public.elwood_member_type
);


--
-- @@ NAMESPACE: ELWOOD
--

-- NODE
DROP TYPE IF EXISTS elwood.get_node_leaf_result CASCADE;
CREATE TYPE elwood.get_node_leaf_result AS (
  "node" public.elwood_node
);
