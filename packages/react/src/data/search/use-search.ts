import type {UseQueryOptions, UseQueryResult} from '@tanstack/react-query';
import {useQuery} from '@tanstack/react-query';

import {useClient} from '@/hooks/use-client';

export type UseSearchInput = {
  value: string;
};

export function useSearch(input: UseSearchInput) {
  const client = useClient();

  return useQuery({
    enabled: input.value.length > 0,
    queryKey: ['search', input.value],
    async queryFn({queryKey, signal}) {
      return await search(client, queryKey[1], signal);
    },
  });
}

export async function search(
  client: ReturnType<typeof useClient>,
  term: string,
  abort: AbortSignal,
) {
  const result = await client.functions.invoke('elwood/search', {
    method: 'POST',
    body: {
      term,
    },
  });

  return result.data?.objects ?? [];
}
