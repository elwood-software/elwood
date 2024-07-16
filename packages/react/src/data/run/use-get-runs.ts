import type {UseQueryOptions, UseQueryResult} from '@tanstack/react-query';
import {useQuery} from '@tanstack/react-query';
import {useClient} from '@/hooks/use-client';

export type UseGetRunsResult = {
  id: string;
  num: number;
  summary: string;
  status: string;
  result: string;
  reason: string;
}[];

export interface UseGetRunsInput {
  workflow_id?: string;
}

export function useGetRuns(
  input: UseGetRunsInput = {},
  opts: Omit<UseQueryOptions<UseGetRunsResult>, 'queryFn' | 'queryKey'> = {},
): UseQueryResult<UseGetRunsResult> {
  const supabase = useClient();

  return useQuery({
    ...opts,
    queryKey: ['runs', input.workflow_id],
    async queryFn() {
      const q = supabase
        .from('elwood_run')
        .select(
          'id,num,summary,status,result,reason:report->>reason,workflow:elwood_run_workflow(id,name)',
        )
        .order('created_at', {ascending: false});

      if (input.workflow_id) {
        q.eq('workflow_id', input.workflow_id);
      }

      const {data, error} = await q;

      if (error) {
        throw error;
      }

      return data;
    },
  });
}
