import type {UseQueryOptions, UseQueryResult} from '@tanstack/react-query';
import {useQuery} from '@tanstack/react-query';
import type {NodeTree, GetNodeTreeResult} from '@elwood/common';
import type {SupabaseClient} from '@/hooks/use-client';
import {useSupabase} from '@/hooks/use-client';
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
  const supabase = useSupabase();

  return useQuery({
    ...opts,
    queryKey: keys.tree(input),
    async queryFn() {
      return getNodeTree(supabase, input);
    },
  });
}

export async function getNodeTree(
  supabase: SupabaseClient,
  input: UseGetNodeTreeInput,
): Promise<GetNodeTreeResult> {
  const result = await supabase.rpc('elwood_get_node_tree', {
    p_path: input.path,
  });
  return result.data as GetNodeTreeResult;
}
