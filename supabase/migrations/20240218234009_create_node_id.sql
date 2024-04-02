
DROP FUNCTION IF EXISTS elwood.create_node_id(text, text[], text);
CREATE OR REPLACE FUNCTION elwood.create_node_id(
  p_type public.elwood_node_type,
  p_prefix text[] default null,
  p_name text default null
) RETURNS text
AS $$
DECLARE 
  _node_id text[];
  _prefix_part text;
  _prefix_parts text[];
BEGIN
  _node_id := ARRAY['urn', 'enid', lower(p_type::text)];

  IF p_prefix IS NOT NULL THEN
    FOREACH _prefix_part IN ARRAY p_prefix LOOP
      _prefix_parts := _prefix_parts || lower(REGEXP_REPLACE(_prefix_part, '([^a-zA-Z0-9])+', '-'));
    END LOOP;

    _node_id := _node_id || array_to_string(_prefix_parts,'.');
  END IF;

  IF p_name IS NOT NULL THEN
    _node_id := _node_id || ARRAY[
      lower(REGEXP_REPLACE(p_name, '([^a-zA-Z0-9])+', '-'))
    ];
  END IF;

  return array_to_string(_node_id,':');
END;
$$ language plpgsql;
