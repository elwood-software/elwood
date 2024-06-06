import {useQuery} from '@tanstack/react-query';

import {useClient} from '@/hooks/use-client';
import {useConfiguration} from '@/hooks/use-provider-context';
import {ConfigurationNames} from '@/constants';

export type UseSearchInput = {
  value: string;
};

export function useSearch(input: UseSearchInput) {
  const client = useClient();
  const functionName = useConfiguration(ConfigurationNames.FunctionName);

  return useQuery({
    enabled: input.value.length > 0,
    queryKey: ['search', input.value],
    async queryFn({queryKey, signal}) {
      return await search(client, functionName, queryKey[1], signal);
    },
  });
}

export async function search(
  client: ReturnType<typeof useClient>,
  functionName: string,
  term: string,
  signal: AbortSignal,
) {
  const {data} = await client.auth.getSession();

  const response = await fetch(
    `${client.url}/functions/v1/${functionName}/search`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${data.session?.access_token}`,
      },
      body: JSON.stringify({
        term,
      }),
      signal,
    },
  );

  return (await response.json()).objects ?? [];
}
