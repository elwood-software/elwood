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
  _node_row jsonb;
  _row_path text[];
  _node_type public.elwood_node_type;
  _expanded_ids text[]; 
  _path_id text;
  _leaf elwood.get_node_leaf_result;
  _leaf_node public.elwood_node;
  _root_id text := 'root';
BEGIN

  IF array_length(p_path, 1) > 0 THEN
    _root_id := elwood.create_node_id('BUCKET', array_to_string(p_path[0:1],'')::text, null);
  END IF;

  FOREACH _part IN ARRAY p_path LOOP
    _row_path := _row_path || _part;
    _node_row := elwood_get_node(_row_path);
    
    -- if this is a blob, it will be added when we loop to the parent
    -- so don't push it to the row now
    IF (_node_row->'node')::jsonb->>'type' != 'BLOB' THEN

      _result := _result || jsonb_build_object(
        'id', (_node_row->>'node')::jsonb->>'id',
        'node', _node_row->'node',
        'parent', (_node_row->'parent')::jsonb->>'id'
      );

      _expanded_ids := _expanded_ids || ARRAY[(_node_row->>'node')::jsonb->>'id'::text];

      FOR _row IN SELECT jsonb_array_elements FROM jsonb_array_elements(_node_row->'children') LOOP
        _result := _result || jsonb_build_object(
          'id', _row->>'id',
          'node', _row,
          'parent', (_node_row->>'node')::jsonb->>'id'
        );
      END LOOP;
    END IF;

  END LOOP;


  RETURN jsonb_build_object(
    'rootNodeId', _root_id,
    'expandedIds', _expanded_ids,
    'tree', _result
  );

END;
$$
language plpgsql;
