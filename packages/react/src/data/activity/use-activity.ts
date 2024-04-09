/* eslint-disable @typescript-eslint/no-floating-promises -- intentional */
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import {type ActivityRecord} from '@elwood/common';
import {useClient} from '@/hooks/use-client';
import keys from './_keys';

export interface UseActivityInput {
  assetId: string;
  assetType: string;
  forUserIds?: string[];
  types?: ActivityRecord['type'][];
}

export function useActivity(
  input: UseActivityInput,
  opts: Omit<UseQueryOptions<ActivityRecord[]>, 'queryKey' | 'queryFn'> = {},
): UseQueryResult<ActivityRecord[]> {
  const client = useClient();

  return useQuery<ActivityRecord[]>({
    ...opts,
    queryKey: keys.get(input),
    queryFn: async () => {
      return await getActivity(client, input);
    },
  });
}

export async function getActivity(
  client: ReturnType<typeof useClient>,
  input: UseActivityInput,
): Promise<ActivityRecord[]> {
  const q = client.from('elwood_activity').select('*');

  q.eq('asset_id', input.assetId);
  q.eq('asset_type', input.assetType);

  if (input.forUserIds) {
    q.in('user_id', input.forUserIds);
  }

  if (input.types) {
    q.in('type', input.types);
  }

  const result = await q;

  return (result.data ?? []) as ActivityRecord[];
}
