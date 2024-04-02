begin;
select plan(3); -- only one statement to run

SELECT is(
  (SELECT elwood.create_node_id('BUCKET', null, null))::text,
  'urn:enid:bucket'::text
);

SELECT is(
  (elwood.create_node_id('BUCKET', ARRAY['thIs', 'path']::TEXT[]))::text,
  'urn:enid:bucket:this.path'::text
);

SELECT is(
  (elwood.create_node_id('BUCKET', ARRAY['another', 'patH', 'With space']::TEXT[], 'name.mov'))::text,
  'urn:enid:bucket:another.path.with-space:name-mov'::text
);

select * from finish();
rollback;