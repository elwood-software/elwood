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
}

export function useActivity(
  input: UseActivityInput,
  opts: Omit<UseQueryOptions, 'queryKey' | 'queryFn'> = {},
): UseQueryResult<ActivityRecord[]> {
  const supabase = useClient();

  return useQuery({
    ...opts,
    queryKey: keys.get(input),
    queryFn: async () => {
      return await getActivity(supabase, input);
    },
  });
}

export async function getActivity(
  supabase: ReturnType<typeof useClient>,
  input: UseActivityInput,
): Promise<ActivityRecord[]> {
  const q = supabase.from('elwood_activity').select('*');

  q.eq('asset_id', input.assetId);
  q.eq('asset_type', input.assetType);

  const result = await q;

  return result.data as ActivityRecord[];
}
