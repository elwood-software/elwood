/* eslint-disable @typescript-eslint/no-floating-promises -- intentional */
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import {toArray, type ActivityRecord, type MemberRecord} from '@elwood/common';
import {useClient} from '@/hooks/use-client';
import keys from './_keys';

export interface ActivityRecordWithMember extends ActivityRecord {
  member: Pick<MemberRecord, 'username' | 'display_name'>;
}

export interface UseActivityInput {
  assetId: string;
  assetType: string;
  forUserIds?: string[];
  types?: ActivityRecord['type'][];
}

export function useActivity(
  input: UseActivityInput,
  opts: Omit<
    UseQueryOptions<ActivityRecordWithMember[]>,
    'queryKey' | 'queryFn'
  > = {},
): UseQueryResult<ActivityRecordWithMember[]> {
  const client = useClient();

  return useQuery<ActivityRecordWithMember[]>({
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
): Promise<ActivityRecordWithMember[]> {
  const q = client
    .from('elwood_activity')
    .select(['*', 'member:elwood_member(username, display_name)'].join(','));

  q.eq('asset_id', input.assetId);
  q.eq('asset_type', input.assetType);

  if (input.forUserIds) {
    q.in('user_id', input.forUserIds);
  }

  if (input.types) {
    q.in('type', input.types);
  }

  const result = await q;

  return toArray(result.data ?? []) as unknown as ActivityRecordWithMember[];
}
