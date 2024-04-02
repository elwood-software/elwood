
DROP FUNCTION IF EXISTS public.elwood_get_node_tree(text[]);
CREATE OR REPLACE FUNCTION public.elwood_get_node_tree(
  p_path text[]
) RETURNS jsonb
AS $$
DECLARE 
  _id text;
  _for_user_id uuid;
  _bucket_id text;
  _path text;
  _part text;
  _result jsonb[];
  _row public.elwood_node;
  _row_path text[];
  _node_type public.elwood_node_type;
  _expanded_ids text[]; 
  _path_id text;
BEGIN
  _for_user_id := (auth.jwt()->>'sub')::uuid;

  IF array_length(p_path, 1) IS NULL THEN    
    _id := 'root';

    FOR _row IN
      SELECT * FROM elwood.get_node_children(_for_user_id, p_path)
    LOOP
      _result := _result || jsonb_build_object(
        'id', _row.id,
        'node', to_jsonb(_row),
        'parent', 'root'
      );
    END LOOP;

  ELSE 
    _id := elwood.create_node_id('BUCKET'::public.elwood_node_type, p_path[1:1], null);
  END IF;

  FOREACH _part IN ARRAY p_path LOOP
    _row_path := _row_path || _part;    
    
    IF array_length(_row_path, 1) = 1 THEN
      _node_type := 'BUCKET'::public.elwood_node_type;
      _path_id := elwood.create_node_id('BUCKET'::public.elwood_node_type, _row_path[1:1]);
    ELSE
      _node_type := 'TREE'::public.elwood_node_type;
      _path_id := elwood.create_node_id('TREE'::public.elwood_node_type, _row_path[1:array_length(_row_path,1)-1], _row_path[array_length(_row_path,1)]);
      _expanded_ids := _expanded_ids || _path_id;
    END IF;

    FOR _row IN
      SELECT * FROM elwood.get_node_children(_for_user_id, _row_path)
    LOOP
      _result := _result || jsonb_build_object(
        'id', _row.id,
        'node', to_jsonb(_row),
        'parent', _path_id
      );
    END LOOP;

  END LOOP;

  RETURN jsonb_build_object(
    'rootNodeId', _id,
    'expandedIds', _expanded_ids,
    'tree', _result
  );

END;
$$ language plpgsql;

