import type {UseQueryOptions, UseQueryResult} from '@tanstack/react-query';
import {useQuery} from '@tanstack/react-query';
import {useClient} from '@/hooks/use-client';

export type UseGetRunWorkflowsResult = {
  id: string;
  name: string;
  label: string;
  description: string;
}[];

export interface UseGetRunWorkflowsInput {}

export function useGetRunWorkflows(
  input: UseGetRunWorkflowsInput = {},
  opts: Omit<
    UseQueryOptions<UseGetRunWorkflowsResult>,
    'queryFn' | 'queryKey'
  > = {},
): UseQueryResult<UseGetRunWorkflowsResult> {
  const supabase = useClient();

  return useQuery({
    ...opts,
    queryKey: ['runs-workflows'],
    async queryFn() {
      const {data, error} = await supabase
        .from('elwood_run_workflow')
        .select('*')
        .order('created_at', {ascending: false});

      if (error) {
        throw error;
      }

      return data;
    },
  });
}
