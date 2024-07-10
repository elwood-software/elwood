import type {UseQueryOptions, UseQueryResult} from '@tanstack/react-query';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {useClient} from '@/hooks/use-client';
import {useEffect} from 'react';
import {JsonObject} from '@elwood/common';

export type UseGetRunResult = {
  status: string;
  result: string;
  report: JsonObject;
};

export interface UseGetRunInput {
  id: string;
}

export function useGetRun(
  input: UseGetRunInput,
  opts: Omit<UseQueryOptions<UseGetRunResult>, 'queryFn' | 'queryKey'> = {},
): UseQueryResult<UseGetRunResult> {
  const supabase = useClient();
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel(`elwood_run:id=eq.${input.id}`)
      .on(
        'postgres_changes',
        {event: 'UPDATE', schema: 'elwood', table: 'run'},
        payload => {
          queryClient.setQueryData(['run', input.id], payload.new);
        },
      )
      .subscribe();

    return function unload() {
      channel?.unsubscribe();
    };
  }, [input.id]);

  return useQuery({
    ...opts,
    queryKey: ['run', input.id],
    async queryFn() {
      const {data, error} = await supabase
        .from('elwood_run')
        .select('*')
        .eq('id', input.id)
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
  });
}