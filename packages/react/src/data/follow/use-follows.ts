/* eslint-disable @typescript-eslint/no-floating-promises -- intentional */
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import {type FollowType, type FollowRecord} from '@elwood/common';
import {useClient} from '@/hooks/use-client';
import keys from './_keys';

export type UseFollowsResult = FollowRecord[];

export interface UseFollowsInput {
  type?: FollowType;
  assetId?: string;
  assetType?: string;
}

export function useFollows(
  input: UseFollowsInput,
  opts: Omit<UseQueryOptions<UseFollowsResult>, 'queryKey' | 'queryFn'> = {},
): UseQueryResult<UseFollowsResult> {
  const client = useClient();

  return useQuery<UseFollowsResult>({
    ...opts,
    queryKey: keys.search(input),
    queryFn: async () => {
      return await getFollows(client, input);
    },
  });
}

export async function getFollows(
  client: ReturnType<typeof useClient>,
  input: UseFollowsInput,
): Promise<UseFollowsResult> {
  const q = client.follow().select('*');

  if (input.type) {
    q.eq('type', input.type);
  }

  if (input.assetId) {
    q.eq('asset_id', input.assetId);
    q.eq('asset_type', input.assetType);
  }

  q.order('created_at', {ascending: false});

  const result = await q;

  return result.data;
}
