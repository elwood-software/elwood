import type {UseQueryOptions, UseQueryResult} from '@tanstack/react-query';
import {useQuery} from '@tanstack/react-query';
import type {GetNodeTreeResult} from '@elwood/common';

import {useClient} from '@/hooks/use-client';
import keys from './_keys';

export type UseGetNodeTreeResult = GetNodeTreeResult;

export interface UseGetNodeTreeInput {
  path: string[];
}

export function useGetNodeTree(
  input: UseGetNodeTreeInput,
  opts: Omit<
    UseQueryOptions<UseGetNodeTreeResult>,
    'queryFn' | 'queryKey'
  > = {},
): UseQueryResult<UseGetNodeTreeResult> {
  const supabase = useClient();

  return useQuery({
    ...opts,
    queryKey: keys.tree(input),
    async queryFn() {
      return getNodeTree(supabase, input);
    },
  });
}

export async function getNodeTree(
  supabase: ReturnType<typeof useClient>,
  input: UseGetNodeTreeInput,
): Promise<GetNodeTreeResult> {
  const result = await supabase.rpc('elwood_get_node_tree', {
    p_path: input.path,
  });

  return result.data as GetNodeTreeResult;
}
