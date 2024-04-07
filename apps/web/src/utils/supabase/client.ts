import {
  createClient as createElwoodClient,
  type ElwoodClient,
} from '@elwood/js';
import {getSupabaseEnv} from './get-supabase-env';

export function createClient(): ElwoodClient {
  return createElwoodClient(...getSupabaseEnv());
}
