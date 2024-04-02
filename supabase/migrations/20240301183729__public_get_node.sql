
-- @@
-- GET_NODE
-- get a node with all the other info you might need for that node
DROP FUNCTION IF EXISTS public.elwood_get_node(text[], int, int);
CREATE OR REPLACE FUNCTION public.elwood_get_node(
  p_path text[],
  p_limit int default 100,
  p_offset int default 0  
) RETURNS jsonb
AS $$
DECLARE 
  _node_leaf elwood.get_node_leaf_result;
  _parent_leaf elwood.get_node_leaf_result;
  _node public.elwood_node;  
  _prefix text[];
  _children jsonb[] = ARRAY[]::jsonb[];
  _child_row public.elwood_node;
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
  END IF;

  return jsonb_build_object(
    'node', to_jsonb(_node),
    'parent', to_jsonb(_parent_leaf.node),
    'children', _children
  );
END;
$$ language plpgsql;
