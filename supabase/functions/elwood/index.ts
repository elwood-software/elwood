import {addCorsHeaders} from '../_shared/cors.ts';
import {assert} from '../_shared/deps.ts';
import {handler} from './handler.ts';

Deno.serve(async req => {
  const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');

  if (req.method === 'OPTIONS') {
    return new Response('ok', {headers: addCorsHeaders({})});
  }

  if (req.method === 'GET') {
    const body = {
      anonKey: SUPABASE_ANON_KEY,
      name: 'Dunder Mifflin Paper Company',
    };

    return new Response(JSON.stringify(body), {
      status: 200,
      headers: addCorsHeaders({'Content-Type': 'application/json'}),
    });
  }

  try {
    assert(req.method === 'POST', 'Method not allowed');

    const {bucket, key} = await req.json();
    const body = await handler({
      bucket,
      key,
      accessTokens:
        req.headers.get('Authorization')?.replace('Bearer ', '') ?? '',
    });

    return new Response(JSON.stringify(body), {
      status: 200,
      headers: addCorsHeaders({'Content-Type': 'application/json'}),
    });
  } catch (err) {
    return new Response(JSON.stringify({error: err.message}), {
      status: 500,
      headers: addCorsHeaders({'Content-Type': 'application/json'}),
    });
  }
});
