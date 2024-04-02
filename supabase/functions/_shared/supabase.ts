import {
  createClient,
  type SupabaseClient,
  type User,
} from 'https://esm.sh/@supabase/supabase-js@2.39.7';

import {assert} from './deps.ts';

export function createSupabaseClient(accessToken?: string): SupabaseClient {
  const url = Deno.env.get('SUPABASE_URL');
  const key = accessToken ?? Deno.env.get('SUPABASE_ANON_KEY');

  assert(url, 'SUPABASE_URL is not set');
  assert(key, 'SUPABASE_ANON_KEY is not set');

  return createClient(url, key, {
    global: accessToken
      ? {headers: {Authorization: `Bearer ${accessToken}`}}
      : {},
  });
}

export function createServiceSupabaseClient(): SupabaseClient {
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  assert(url, 'SUPABASE_URL is not set');
  assert(key, 'SUPABASE_SERVICE_ROLE_KEY is not set');

  return createClient(url, key, {});
}

export function createSupabaseClientFromRequest(req: Request): SupabaseClient {
  if (!req.headers.has('authorization')) {
    return createSupabaseClient();
  }

  const accessToken = req.headers
    .get('authorization')
    ?.replace(/Bearer /i, '')
    .trim();

  return createSupabaseClient(accessToken);
}

export async function getSupabaseUser(client: SupabaseClient): Promise<User> {
  const result = await client.auth.getUser();

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data.user;
}

export type {
  SupabaseClient,
  User,
  Session,
} from 'https://esm.sh/@supabase/supabase-js@2.39.7';
