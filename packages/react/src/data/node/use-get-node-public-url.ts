import type {UseQueryOptions, UseQueryResult} from '@tanstack/react-query';
import {useQuery} from '@tanstack/react-query';

import {useClient} from '@/hooks/use-client';
import keys from './_keys';

export type UseGetNodePublicUrlResult = {
  signedUrl: string;
};

export interface UseGetNodePublicUrlInput {
  path: string[];
}

export function useGetNodePublicUrl(
  input: UseGetNodePublicUrlInput,
  opts: Omit<
    UseQueryOptions<UseGetNodePublicUrlResult>,
    'queryFn' | 'queryKey'
  > = {},
): UseQueryResult<UseGetNodePublicUrlResult> {
  const supabase = useClient();

  return useQuery({
    ...opts,
    refetchInterval: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    queryKey: keys.get(input),
    async queryFn() {
      return await getNodePublicUrl(supabase, input);
    },
  });
}

export async function getNodePublicUrl(
  client: ReturnType<typeof useClient>,
  input: UseGetNodePublicUrlInput,
): Promise<UseGetNodePublicUrlResult> {
  const [bucket, ...path] = input.path;

  const result = await client.storage
    .from(bucket)
    .createSignedUrl(path.join('/'), 60);

  if (result.error) {
    throw result.error;
  }

  return {signedUrl: result.data.signedUrl};
}
