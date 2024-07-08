import type {UseQueryOptions, UseQueryResult} from '@tanstack/react-query';
import {useQuery} from '@tanstack/react-query';
import {useClient} from '@/hooks/use-client';

export type UseGetRunsResult = {
  id: string;
  num: number;
  status: string;
  result: string;
}[];

export interface UseGetRunsInput {}

export function useGetRuns(
  input: UseGetRunsInput = {},
  opts: Omit<UseQueryOptions<UseGetRunsResult>, 'queryFn' | 'queryKey'> = {},
): UseQueryResult<UseGetRunsResult> {
  const supabase = useClient();

  return useQuery({
    ...opts,
    queryKey: ['runs'],
    async queryFn() {
      const {data, error} = await supabase.from('elwood_run').select('*');

      if (error) {
        throw error;
      }

      return data;
    },
  });
}
