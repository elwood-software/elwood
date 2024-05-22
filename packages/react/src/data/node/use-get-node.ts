import type {UseQueryOptions, UseQueryResult} from '@tanstack/react-query';
import {useQuery} from '@tanstack/react-query';
import type {GetNodeResult} from '@elwood/common';
import {useClient} from '@/hooks/use-client';
import keys from './_keys';

export type UseGetNodeResult = GetNodeResult | null;

export interface UseGetNodeInput {
  path: string[];
}

export function useGetNode(
  input: UseGetNodeInput,
  opts: Omit<UseQueryOptions<UseGetNodeResult>, 'queryFn' | 'queryKey'> = {},
): UseQueryResult<UseGetNodeResult> {
  const supabase = useClient();

  return useQuery({
    ...opts,
    queryKey: keys.get(input),
    async queryFn() {
      return await getNode(supabase, input);
    },
  });
}

export async function getNode(
  supabase: ReturnType<typeof useClient>,
  input: UseGetNodeInput,
): Promise<GetNodeResult | null> {
  const result = await supabase.rpc('elwood_get_node', {p_path: input.path});

  console.log(result);

  return result.data as GetNodeResult | null;
}
