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
BEGIN

  FOREACH _part IN ARRAY p_path LOOP
    _row_path := _row_path || _part;
    _node_row := elwood_get_node(_row_path);
    _expanded_ids := _expanded_ids || ARRAY[(_node_row->>'node')::jsonb->>'id'::text];

    _result := _result || jsonb_build_object(
      'id', (_node_row->>'node')::jsonb->>'id',
      'node', _node_row->'node',
      'parent', (_node_row->'parent')::jsonb->>'id'
    );

    FOR _row IN SELECT jsonb_array_elements FROM jsonb_array_elements(_node_row->'children') LOOP
      _result := _result || jsonb_build_object(
        'id', _row->>'id',
        'node', _row,
        'parent', (_node_row->>'node')::jsonb->>'id'
      );
    END LOOP;

  END LOOP;


  RETURN jsonb_build_object(
    'rootNodeId', 'root',
    'expandedIds', _expanded_ids,
    'tree', _result
  );

END;
$$
language plpgsql;
