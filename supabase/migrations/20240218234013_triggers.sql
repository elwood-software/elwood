-- BEFORE INSERT
create or replace function elwood.after_object_insert_or_update()
returns trigger
language PLPGSQL
as $$
DECLARE
  _path_parts text[];
  _path_parts_length int;
  _prefix text[];
  _part text;
  _path_tokens text[];
BEGIN

  -- ignore if there is a file name
  IF storage.filename(NEW.name) = '.emptyFolderPlaceholder' THEN
    RETURN NEW;
  END IF;

  -- split the new path into parts
  _path_parts := regexp_split_to_array(NEW.name, '/');
  _path_parts_length := array_length(_path_parts, 1);

  IF _path_parts_length = 1 THEN
    RETURN NEW;
  END IF;

  -- now loop through each part and make sure there's an object
  -- for the tree path so we can have an object id
  FOREACH _part IN ARRAY _path_parts[1:_path_parts_length-1] LOOP
    _prefix := _prefix || array[_part];
    _path_tokens := _prefix || array['.emptyFolderPlaceholder'];

    -- insert a placeholder object if it doesn't exist
    INSERT INTO storage.objects ("bucket_id", "owner_id", "name") VALUES (
      NEW.bucket_id,
      NEW.owner_id,
      array_to_string(
        _path_tokens,
        '/'
      )
    ) ON CONFLICT ("bucket_id","name") DO NOTHING;
  END LOOP;
  

  -- if we think this is a folder, insert a placeholder object 
  IF NEW.metadata IS NULL OR NEW.metadata->>'eTag' IS NULL THEN
    _path_tokens := _path_parts || array['.emptyFolderPlaceholder'];

   -- insert a placeholder object if it doesn't exist
    INSERT INTO storage.objects ("bucket_id", "owner_id", "name") VALUES (
      NEW.bucket_id,
      NEW.owner_id,
      array_to_string(
        _path_tokens,
        '/'
      )
    ) ON CONFLICT ("bucket_id","name") DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

create trigger trigger_after_object_insert_or_update
before insert on storage.objects
for each row
when (pg_trigger_depth() < 1)
execute function elwood.after_object_insert_or_update();
