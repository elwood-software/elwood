drop function if exists public.elwood_get_node_tree(text[]);
create or replace function public.elwood_get_node_tree(p_path text[])
returns jsonb
as $$
DECLARE 
  _id text;
  _bucket_id text;
  _path text;
  _part text;
  _result jsonb[];
  _row jsonb;
  _row_path text[];
  _node_type public.elwood_node_type;
  _expanded_ids text[]; 
  _path_id text;
  _leaf elwood.get_node_leaf_result;
  _leaf_node public.elwood_node;
BEGIN

  -- IF array_length(p_path, 1) IS NULL THEN    
  --   _id := 'root';

  --   FOR _row IN
  --     SELECT * FROM elwood.get_node_children(p_path)
  --   LOOP
  --     _result := _result || jsonb_build_object(
  --       'id', _row.id,
  --       'node', to_jsonb(_row),
  --       'parent', 'root'
  --     );
  --   END LOOP;

  -- ELSE 
  --   _id := elwood.create_node_id('BUCKET'::public.elwood_node_type, array_to_string(p_path[1:1],''));
  -- END IF;

  -- FOREACH _part IN ARRAY p_path LOOP
  --   _row_path := _row_path || _part;    
  --   _leaf = elwood.get_node_leaf(_row_path);
  --   _leaf_node = _leaf.node;
  --   _expanded_ids := _expanded_ids || _leaf_node.id;

  --   FOREACH _row IN ARRAY elwood.get_node_children(_row_path)
  --   LOOP
  --     _result := _result || jsonb_build_object(
  --       'id', _row->>'id',
  --       'node', _row,
  --       'parent', _path_id
  --     );
  --   END LOOP;

  -- END LOOP;

  RETURN jsonb_build_object(
    'rootNodeId', _id,
    'expandedIds', _expanded_ids,
    'tree', _result
  );

END;
$$
language plpgsql;
