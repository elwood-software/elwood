import {createBrowserClient} from '@supabase/ssr';
import {
  createClient as createElwoodClient,
  type ElwoodClient,
} from '@elwood/js';
import {getSupabaseEnv} from './get-supabase-env';

export function createClient(): ElwoodClient {
  const args = getSupabaseEnv();
  return createElwoodClient(...args).mergeWith(createBrowserClient(...args));
}
