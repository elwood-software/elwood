import type {SupabaseClient as BaseSupabaseClient} from '@elwood/js';
import {invariant} from '@elwood/common';
import type {Database} from '@elwood/common';
import {useProviderContext} from './use-provider-context';

type OurSupabaseClient = BaseSupabaseClient<Database>;

export function useSupabase(): OurSupabaseClient {
  const value = useProviderContext();
  invariant(
    value.client,
    'No supabaseClient in Provider context (for useSupabase())',
  );
  return value.client;
}

export type SupabaseClient = OurSupabaseClient;
