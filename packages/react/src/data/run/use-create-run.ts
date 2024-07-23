import type {
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import type {Records} from '@elwood/common';
import {invariant} from '@elwood/common';
import {useClient} from '@/hooks/use-client';
import type {JsonObject, Json} from '@elwood/common';
import {parse as parseYaml} from 'yaml';

import {createWorkflow} from './use-create-workflow';

export type UseCreateRunInput = Records.Run.New;

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
      let workflowId = data.workflow_id;

      if (!workflowId) {
        const result = await createWorkflow(supabase, {
          configuration: data.configuration,
        });

        workflowId = result.id;
      }

      const result = await supabase
        .from('elwood_run')
        .insert({
          short_summary: data.short_summary,
          workflow_id: workflowId,
          variables: getValue(data.variables),
          metadata: {
            trigger: 'web',
            started_by_user_id: session?.session?.user?.id,
          },
        })
        .select('id')
        .single();

      return result.data as UseCreateRunResult;
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
