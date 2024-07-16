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

export type UseCreateWorkflowInput = {
  configuration: string;
};

export type UseCreateWorkflowResult = {
  id: string;
};

export function useCreateWorkflow(
  opts: Omit<
    UseMutationOptions<UseCreateWorkflowResult, Error, UseCreateWorkflowInput>,
    'mutationFn'
  > = {},
): UseMutationResult<UseCreateWorkflowResult, Error, UseCreateWorkflowInput> {
  const supabase = useClient();
  const queryClient = useQueryClient();

  return useMutation({
    ...opts,
    mutationFn: async data => {
      return await createWorkflow(supabase, data);
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

export async function createWorkflow(
  supabase: ReturnType<typeof useClient>,
  input: UseCreateWorkflowInput,
): Promise<UseCreateWorkflowResult> {
  const {data: session} = await supabase.auth.getSession();
  const configuration = getValue(input.configuration);

  const result = await supabase
    .from('elwood_run_workflow')
    .insert({
      configuration,
      name: configuration.name,
      metadata: {
        started_by_user_id: session?.session?.user?.id,
      },
    })
    .select('id')
    .single();

  return result.data as UseCreateWorkflowResult;
}
