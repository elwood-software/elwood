import 'https://esm.sh/v135/@supabase/functions-js@2.4.1/src/edge-runtime.d.ts';
import {RouterContext} from 'jsr:@oak/oak/router';

import {connectDatabase, sql} from '../../_shared/db.ts';
import {ObjectsTable, Webhook} from '../../_shared/types.ts';
import {assert} from '../../_shared/deps.ts';

export async function handler<R extends string>(
  ctx: RouterContext<R>,
): Promise<void> {
  const {db, connection} = connectDatabase();
  const body = (await ctx.request.body.json()) as Webhook.Payload<ObjectsTable>;
  const model = new Supabase.ai.Session('gte-small');
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  assert('SUPABASE_URL', 'Missing SUPABASE_URL in env');
  assert('SUPABASE_ANON_KEY', 'Missing SUPABASE_ANON_KEY in env');
  assert(
    'SUPABASE_SERVICE_ROLE_KEY',
    'Missing SUPABASE_SERVICE_ROLE_KEY in env',
  );

  assert(body, 'Missing body in request');
  assert(body.type, 'Missing type in body');
  assert(
    ['UPDATE', 'INSERT', 'DIRECT'].includes(body.type),
    'Invalid type in body',
  );
  assert(body.record, 'Missing record in body');

  const {id, bucket_id, name} = body.record;

  if (body.type === 'DIRECT') {
    assert(
      id || (bucket_id && name),
      'Missing ID or bucket_id & name in record',
    );
  }

  if (body.type === 'INSERT') {
    assert(body.record.bucket_id, 'Missing bucket_id in record');
    assert(body.record.name, 'Missing name in record');
  }

  const object = await connection
    .withSchema('storage')
    .selectFrom('objects')
    .select('id')
    .select('bucket_id')
    .select('name')
    .$if(!!id, query => query.where('id', '=', id))
    .$if(!!bucket_id, query =>
      query.where('bucket_id', '=', bucket_id).where('name', '=', name),
    )
    .executeTakeFirstOrThrow();

  assert(
    object.name !== '.emptyFolderPlaceholder',
    'Can not run embeddings on folder',
  );

  const response = await fetch(
    `${SUPABASE_URL}/storage/v1/object/authenticated/${object.bucket_id}/${object.name}`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY!}`,
      },
    },
  );

  assert(response.ok, 'Failed to fetch object to get content');

  const input = await response.text();
  const output = await model.run(input, {mean_pool: true, normalize: true});
  const embedding = JSON.stringify(output);
  const search_text = sql<string>`to_tsvector('english', ${[object.name, input].join(' ')})`;

  const result = await db
    .insertInto('embedding')
    .values(() => ({
      embedding,
      bucket_id,
      object_id: object.id,
      search_text,
    }))
    .onConflict(oc => {
      return oc.columns(['instance_id', 'bucket_id', 'object_id']).doUpdateSet({
        embedding,
        search_text,
      });
    })
    .execute();

  ctx.response.body = {
    ok: result.length > 0 && (result[0].numInsertedOrUpdatedRows as bigint) > 0,
  };
}
