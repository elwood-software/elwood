import 'https://esm.sh/v135/@supabase/functions-js@2.4.1/src/edge-runtime.d.ts';
import {RouterContext} from 'jsr:@oak/oak/router';
import OpenAI from 'npm:openai';

import {connectDatabase, sql} from '../../_shared/db.ts';
import {ObjectsTable, Webhook} from '../../_shared/types.ts';
import {assert} from '../../_shared/deps.ts';
import {embeddingSourceByExtension} from '../embedding-sources/by-ext.ts';

export async function handler<R extends string>(
  ctx: RouterContext<R>,
): Promise<void> {
  const {db, connection} = connectDatabase();
  const body = (await ctx.request.body.json()) as Webhook.Payload<ObjectsTable>;
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const OPEN_API_KEY = Deno.env.get('OPEN_API_KEY');

  // required env vars
  assert(OPEN_API_KEY, 'OPEN_API_KEY is required');
  assert(SUPABASE_URL, 'Missing SUPABASE_URL in env');
  assert(SUPABASE_ANON_KEY, 'Missing SUPABASE_ANON_KEY in env');
  assert(SUPABASE_SERVICE_ROLE_KEY, 'Missing SUPABASE_SERVICE_ROLE_KEY in env');

  // required body.
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

  const openai = new OpenAI({apiKey: OPEN_API_KEY});

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

  const content = await response.text();
  const source = embeddingSourceByExtension(object.name, content);

  if (!source) {
    ctx.response.body = {ok: false};
    return;
  }

  await source.generate();

  let currentChunkIds = (
    (await db
      .selectFrom('embedding')
      .select('chunk_id')
      .where('object_id', '=', object.id)
      .execute()) ?? []
  ).map(row => row.chunk_id);

  for (const chunk of source.chunks) {
    const embeddingResult = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: chunk.content.replace(/\n/g, ' '),
    });

    const embedding = JSON.stringify(embeddingResult.data[0].embedding);
    const search_text = sql<string>`to_tsvector('english', ${chunk.content}) || to_tsvector('english', ${chunk.summary})`;

    const result = await db
      .insertInto('embedding')
      .values(() => ({
        embedding,
        chunk_id: chunk.id,
        object_id: object.id,
        content: chunk.content,
        summary: chunk.summary,
        search_text,
      }))
      .onConflict(oc => {
        return oc
          .columns(['instance_id', 'object_id', 'chunk_id'])
          .doUpdateSet({
            embedding,
            search_text,
          });
      })
      .execute();

    if ((result[0].numInsertedOrUpdatedRows as bigint) > 0) {
      // remove this chunk from the currentChunkIds
      // since it's been updated.
      currentChunkIds = currentChunkIds.filter(id => id !== chunk.id);
    }
  }

  // remove any chunks that are no longer in the source.
  if (currentChunkIds.length > 0) {
    await db
      .deleteFrom('embedding')
      .where('chunk_id', 'in', currentChunkIds)
      .execute();
  }

  ctx.response.body = {
    ok: true,
  };
}
