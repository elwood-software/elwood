import {invariant} from '@elwood/common';
import {EnvValue} from '@/constants';

export function getSupabaseEnv(): [string, string] {
  invariant(
    EnvValue.PublicSupabaseUrl,
    'NEXT_PUBLIC_SUPABASE_URL is not defined',
  );
  invariant(
    EnvValue.PublicSupabaseAnonKey,
    'NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined',
  );

  return [EnvValue.PublicSupabaseUrl, EnvValue.PublicSupabaseAnonKey];
}
