import type {UseQueryOptions, UseQueryResult} from '@tanstack/react-query';
import {useQuery} from '@tanstack/react-query';
import {useDebounce} from 'react-use';
import type {SearchMembersResult} from '@elwood/common';
import {toArray} from '@elwood/common';
import {useState} from 'react';
import type {SupabaseClient} from '@/hooks/use-client';
import {useSupabase} from '@/hooks/use-client';
import keys from './_keys';

export type UseSearchMembersResult = SearchMembersResult;

export interface UseSearchMembersInput {
  path?: string[] | undefined;
  query?: string | null;
  role?: string;
}

export function useSearchMembers(
  input: UseSearchMembersInput,
  opts: Omit<
    UseQueryOptions<UseSearchMembersResult>,
    'queryFn' | 'queryKey'
  > = {},
): UseQueryResult<UseSearchMembersResult> {
  const supabase = useSupabase();
  const [debounce, setDebounce] = useState(input);

  useDebounce(
    () => {
      setDebounce({
        ...input,
        query: input.query ?? '',
      });
    },
    400,
    [input.query],
  );

  return useQuery({
    ...opts,
    enabled: Boolean(debounce.query),
    queryKey: keys.search(debounce),
    async queryFn() {
      return await searchMembers(supabase, debounce);
    },
  });
}

export async function searchMembers(
  supabase: SupabaseClient,
  input: UseSearchMembersInput,
): Promise<UseSearchMembersResult> {
  const query = supabase.rpc('elwood_search_members', {
    p_path: input.path ?? [],
  });

  if (input.query) {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises -- intentional
    query.or(
      [
        `username.ilike.%${input.query}%`,
        `display_name.ilike.%${input.query}%`,
      ].join(','),
    );
  }

  return toArray((await query).data) as SearchMembersResult;
}
