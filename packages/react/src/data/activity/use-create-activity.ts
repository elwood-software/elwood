import type {
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {
  GetNodeResult,
  NodeRecord,
  invariant,
  type JsonObject,
  type ActivityType,
} from '@elwood/common';
import {useSupabase} from '@/hooks/use-client';
import keys from './_keys';

export interface UseCreateActivityInput {
  assetType: string;
  assetId: string;
  type: ActivityType;
  text?: string;
  attachments?: JsonObject;
}

export interface UseCreateActivityResult {
  id: string;
}

export function useCreateActivity(
  opts: Omit<
    UseMutationOptions<UseCreateActivityResult, Error, UseCreateActivityInput>,
    'mutationFn'
  > = {},
): UseMutationResult<UseCreateActivityResult, Error, UseCreateActivityInput> {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    ...opts,
    mutationFn: async data => {
      return await createActivity(supabase, data);
    },
    async onSuccess(data, variables, context) {
      await queryClient.refetchQueries({
        queryKey: keys.get({
          assetId: variables.assetId,
          assetType: variables.assetType,
        }),
      });
      await opts.onSuccess?.(data, variables, context);
    },
  });
}

export async function createActivity(
  supabase: ReturnType<typeof useSupabase>,
  input: UseCreateActivityInput,
): Promise<UseCreateActivityResult> {
  const {data} = await supabase.auth.getSession();

  invariant(data.session?.user.id, 'Must be logged in to create activity');

  const result = await supabase
    .from('elwood_activity')
    .insert({
      user_id: data.session.user.id,
      asset_type: input.assetType,
      asset_id: input.assetId,
      type: input.type,
      text: input.text ?? '',
      attachments: input.attachments ?? {},
    })
    .select('id')
    .maybeSingle();

  return result.data;
}
