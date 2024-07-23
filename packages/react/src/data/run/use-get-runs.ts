import type {UseQueryOptions, UseQueryResult} from '@tanstack/react-query';
import {useQuery} from '@tanstack/react-query';
import {type Records} from '@elwood/common';

import type {UseGetRunsItem} from '@/types';
import {useClient} from '@/hooks/use-client';

export type UseGetRunsResult = UseGetRunsItem[];

export interface UseGetRunsInput {
  workflow_id?: string;
}

export function useGetRuns(
  input: UseGetRunsInput = {},
  opts: Omit<UseQueryOptions<UseGetRunsResult>, 'queryFn' | 'queryKey'> = {},
): UseQueryResult<UseGetRunsResult> {
  const client = useClient();

  return useQuery({
    ...opts,
    queryKey: ['runs', input.workflow_id],
    async queryFn() {
      const q = client
        .fromRuns()
        .select(
          'id,num,summary,status,result,reason:report->>reason,workflow:elwood_run_workflow(id,name,configuration->>label)',
        )
        .order('created_at', {ascending: false});

      if (input.workflow_id) {
        q.eq('workflow_id', input.workflow_id);
      }

      const {data, error} = await q;

      if (error) {
        throw error;
      }

      return data as UseGetRunsResult;
    },
  });
}
