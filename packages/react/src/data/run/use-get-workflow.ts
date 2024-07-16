import type {UseQueryOptions, UseQueryResult} from '@tanstack/react-query';
import {useQuery} from '@tanstack/react-query';
import {useClient} from '@/hooks/use-client';
import {JsonObject} from '@elwood/common';

export type UseGetRunWorkflowResult = {
  id: string;
  name: string;
  label: string;
  description: string;
  configuration: JsonObject;
  metadata: JsonObject;
};

export interface UseGetRunWorkflowInput {
  id: string;
}

export function useGetRunWorkflow(
  input: UseGetRunWorkflowInput,
  opts: Omit<
    UseQueryOptions<UseGetRunWorkflowResult>,
    'queryFn' | 'queryKey'
  > = {},
): UseQueryResult<UseGetRunWorkflowResult> {
  const supabase = useClient();

  return useQuery({
    ...opts,
    queryKey: ['runs-workflows', input.id],
    async queryFn() {
      const {data, error} = await supabase
        .from('elwood_run_workflow')
        .select('*')
        .eq('id', input.id)
        .order('created_at', {ascending: false})
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
  });
}
