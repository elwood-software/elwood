drop function if exists elwood.get_node_children(uuid, text[]);
create or replace function elwood.get_node_children(p_prefix text[])
returns jsonb[]
language PLPGSQL
as $$
DECLARE 
    _bucket_row storage.buckets;
    _search_row public.elwood_storage_search_result;    
    _object_row public.elwood_node;
    _nodes jsonb[];  
    _node_type public.elwood_node_type;
    _bucket_id text;
    _prefix text;
    _path text;
    _depth int;
BEGIN
    _nodes := ARRAY[]::jsonb[];
    _prefix := ARRAY_TO_STRING(p_prefix, '/');

    -- if there's nothing in input then return the root
    -- which is all the buckets
    IF array_length(p_prefix, 1) IS NULL THEN    
        FOR _bucket_row IN
            SELECT * FROM storage.buckets
        LOOP
            _object_row.id := elwood.create_node_id('BUCKET', _bucket_row.name::text, null);
            _object_row.type := 'BUCKET';
            _object_row.prefix := p_prefix;
            _object_row.name := _bucket_row.name;
            _object_row.mime_type := 'inode/directory';
            _object_row.size := (SELECT SUM(COALESCE((o.metadata->>'size')::int, 0)) FROM storage.objects as o WHERE o.bucket_id = _bucket_row.id);
            _nodes := _nodes || ARRAY[to_jsonb(_object_row)];
        END LOOP;
    END IF;


    _bucket_id := ARRAY_TO_STRING(p_prefix[:1], '');
    _path := ARRAY_TO_STRING(p_prefix[2:], '/');
    _depth := array_length(p_prefix[2:], 1) + 1;

    IF _depth IS NULL THEN  
        _depth := 1;
    END IF;

    RAISE WARNING 'get_node_children: p_prefix %, _bucket_id: %, _path: %, _depth: %', p_prefix, _bucket_id, _path, _depth;

    FOR _search_row IN
        SELECT * FROM storage.search(_path, _bucket_id, 100, _depth)
    LOOP
    RAISE WARNING 'get_node_children: _search_row %', _search_row.name;

        IF _search_row.id IS NULL THEN

        RAISE WARNING 'xxxx: xxx %', ARRAY[_bucket_id] || string_to_array(_search_row.name,'/');

            _object_row.type := 'TREE';
            _object_row.id := elwood.create_node_id_for_tree(ARRAY[_bucket_id] || string_to_array(_search_row.name,'/'));
        ELSE 
            _object_row.type := 'BLOB'; 
            _object_row.id := elwood.create_node_id(_node_type, _bucket_id, _search_row.id);
        END IF;

        IF _search_row.name != '.emptyFolderPlaceholder' THEN
            _object_row.prefix := p_prefix;
            _object_row.name := _search_row.name;
            _object_row.mime_type := _search_row.metadata->>'mimetype';
            _object_row.size := COALESCE((_search_row.metadata->>'size')::int, 0);
            _nodes := _nodes || to_jsonb(_object_row);
        END IF;
    END LOOP;

    RAISE WARNING 'get_node_children: length _depth: %', array_length(_nodes, 1);

    return _nodes;
END;
$$;
