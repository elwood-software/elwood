

DROP FUNCTION IF EXISTS elwood.get_node_leaf(text[]);
CREATE OR REPLACE FUNCTION elwood.get_node_leaf(
  "p_path" text[]
) RETURNS elwood.get_node_leaf_result LANGUAGE PLPGSQL
AS $$
DECLARE 
  _path_length int;
  _name text;
  _path text;
  _prefix text[];
  _bucket_id text;
  _node public.elwood_node;
  _bucket_row storage.buckets;
  _object_row storage.objects;  
  _result elwood.get_node_leaf_result;
BEGIN
  _path_length := array_length(p_path, 1);

  -- no path means root
  IF _path_length IS NULL THEN 
    _node.id = 'root';
    _node.type = 'BUCKET';  
    _node.prefix = ARRAY[]::text[];
  END IF;

  -- single path means bucket
  IF _path_length = 1 THEN
    SELECT * INTO _bucket_row FROM storage.buckets WHERE "name" = p_path[1];

    IF _bucket_row.id IS NULL THEN
      return null;
    END IF; 

    _node.id = elwood.create_node_id('BUCKET', ARRAY[]::text[], _bucket_row.name);
    _node.type = 'BUCKET';
    _node.prefix = ARRAY[]::text[];
    _node.name = _bucket_row.name;
    _node.mime_type = 'inode/directory';
  END IF;

  -- multiple paths means object
  IF _path_length > 1 THEN
    _bucket_id := ARRAY_TO_STRING(p_path[:1], '');
    _prefix := p_path[1:_path_length-1];
    _path := ARRAY_TO_STRING(p_path[2:], '/');
    _name := p_path[_path_length];

    SELECT * INTO _object_row FROM storage.objects WHERE "bucket_id" = _bucket_id AND "name" = _path;

    IF _object_row.id IS NULL THEN
      _node.id = elwood.create_node_id('TREE', _prefix, _name);
      _node.type = 'TREE';
      _node.prefix = _prefix;
      _node.name = _name;
      _node.mime_type = 'inode/directory';      
    END IF;
      
    IF _object_row.id IS NOT NULL THEN
      _node.id = elwood.create_node_id('BLOB', _prefix, _name);
      _node.type = 'BLOB';
      _node.prefix = _prefix;
      _node.name = _name;
      _node.mime_type = _object_row.metadata->>'mimetype';
      _node.size = COALESCE((_object_row.metadata->>'size')::int, 0);
    END IF;
  END IF;

  _result.node := _node;

  -- give it back
  return _result;

END;
$$;

