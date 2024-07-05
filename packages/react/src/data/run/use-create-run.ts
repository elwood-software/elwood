import type {
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import type {GetNodeResult, NodeRecord} from '@elwood/common';
import {invariant} from '@elwood/common';
import {useClient} from '@/hooks/use-client';
import type {JsonObject, Json} from '@elwood/common';
import {parse as parseYaml} from 'yaml';

export type UseCreateRunInput = {
  configuration: Json;
  variables: Json;
};

export type UseCreateRunResult = {
  id: string;
};

export function useCreateRun(
  opts: Omit<
    UseMutationOptions<UseCreateRunResult, Error, UseCreateRunInput>,
    'mutationFn'
  > = {},
): UseMutationResult<UseCreateRunResult, Error, UseCreateRunInput> {
  const supabase = useClient();
  const queryClient = useQueryClient();

  return useMutation({
    ...opts,
    mutationFn: async data => {
      const {data: session} = await supabase.auth.getSession();

      const result = await supabase
        .from('elwood_run')
        .insert({
          status: 'unassigned',
          configuration: getValue(data.configuration),
          variables: getValue(data.variables),
          metadata: {
            started_by_user_id: session?.user?.id,
          },
        })
        .select('id')
        .single();

      return result.data;
    },
    async onSuccess(data, variables, context) {
      // await queryClient.refetchQueries({
      //   queryKey: keys.get({
      //     path: variables.prefix,
      //   }),
      // });
      // await opts.onSuccess?.(data, variables, context);
    },
  });
}

export function getValue(value: string): JsonObject {
  if (value.startsWith('{') && value.endsWith('}')) {
    return JSON.parse(value);
  }

  return parseYaml(value);
}
