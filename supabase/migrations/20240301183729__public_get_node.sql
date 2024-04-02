-- @@
-- GET_NODE
-- get a node with all the other info you might need for that node
drop function if exists public.elwood_get_node(text[], int, int);
create or replace function public.elwood_get_node(
  p_path text[],
  p_limit int default 100,
  p_offset int default 0
)
returns jsonb
as $$
DECLARE 
  _node_leaf elwood.get_node_leaf_result;
  _parent_leaf elwood.get_node_leaf_result;
  _node public.elwood_node;  
  _prefix text[];
  _child_row jsonb;
  _children jsonb[] = ARRAY[]::jsonb[];  
  _key_children text[] = ARRAY[]::text[];
BEGIN
  -- get this node leaf
  _node_leaf := elwood.get_node_leaf(p_path);
  _node = _node_leaf.node;

  -- no node means stop
  IF _node.id IS NULL THEN
    return null;
  END IF;

  -- if this isn't root, get the parent
  IF _node.id != 'root' THEN
    SELECT * INTO _parent_leaf FROM elwood.get_node_leaf(p_path[1:array_length(p_path, 1)-1]);
    _prefix := _node.prefix || ARRAY[_node.name]::text[];
  END IF;

  IF _node.type = 'TREE' OR _node.type = 'BUCKET' THEN
    _children := elwood.get_node_children(_prefix);

    FOREACH _child_row IN ARRAY _children LOOP
      IF (SELECT _child_row->>'name' = ANY(ARRAY['readme.md']::text[])) THEN
        _key_children := _key_children || ARRAY[_child_row->>'name'];
      END IF; 
    END LOOP;
  END IF;

  return jsonb_build_object(
    'node', to_jsonb(_node),
    'parent', to_jsonb(_parent_leaf.node),
    'children', _children,
    'key_children', _key_children
  );
END;
$$
language plpgsql;
