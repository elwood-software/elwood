import type {UseQueryOptions, UseQueryResult} from '@tanstack/react-query';
import {useQuery} from '@tanstack/react-query';
import {useDebounce} from 'react-use';
import type {SearchMembersResult} from '@elwood/common';
import {toArray} from '@elwood/common';
import {useState} from 'react';
import type {SupabaseClient} from '@/hooks/use-client';
import {useClient} from '@/hooks/use-client';
import keys from './_keys';

export type UseSearchMembersResult = SearchMembersResult;

export interface UseSearchMembersInput {
  path?: string[] | undefined;
  query?: string | null;
  role?: string;
  user_id?: string;
}

export function useSearchMembers(
  input: UseSearchMembersInput,
  opts: Omit<
    UseQueryOptions<UseSearchMembersResult>,
    'queryFn' | 'queryKey'
  > = {},
): UseQueryResult<UseSearchMembersResult> {
  const client = useClient();
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
      return await client.members();
    },
  });
}
