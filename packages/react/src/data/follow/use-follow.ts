/* eslint-disable @typescript-eslint/no-floating-promises -- intentional */
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import {type FollowType, type FollowRecord} from '@elwood/common';
import {useClient} from '@/hooks/use-client';
import keys from './_keys';

export type UseFollowResult = FollowRecord | undefined;

export interface UseFollowInput {
  type: FollowType;
  assetId: string;
  assetType: string;
}

export function useFollow(
  input: UseFollowInput,
  opts: Omit<UseQueryOptions<UseFollowResult>, 'queryKey' | 'queryFn'> = {},
): UseQueryResult<UseFollowResult> {
  const client = useClient();

  return useQuery<UseFollowResult>({
    ...opts,
    queryKey: keys.get(input),
    queryFn: async () => {
      return await getFollow(client, input);
    },
  });
}

export async function getFollow(
  client: ReturnType<typeof useClient>,
  input: UseFollowInput,
): Promise<UseFollowResult> {
  const q = client.follow().select('*');

  q.eq('type', input.type);
  q.eq('asset_id', input.assetId);
  q.eq('asset_type', input.assetType);

  const result = await q.maybeSingle();

  return result.data;
}
