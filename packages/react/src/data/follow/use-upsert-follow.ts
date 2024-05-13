import type {
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {invariant, type FollowRecord, type FollowType} from '@elwood/common';
import {useClient} from '@/hooks/use-client';
import keys from './_keys';
import {getFollow} from './use-follow';

export type UseUpsertFollowResult = FollowRecord;

export interface UseUpsertFollowInput {
  type: FollowType;
  assetType: string;
  assetId: string;
}

export function useUpsertFollow(
  opts: Omit<
    UseMutationOptions<UseUpsertFollowResult, Error, UseUpsertFollowInput>,
    'mutationFn'
  > = {},
): UseMutationResult<UseUpsertFollowResult, Error, UseUpsertFollowInput> {
  const client = useClient();
  const queryClient = useQueryClient();

  return useMutation({
    ...opts,
    mutationFn: async data => {
      return await upsertFollow(client, data);
    },
    async onSuccess(data, variables, context) {
      await queryClient.refetchQueries({
        queryKey: keys.get({
          type: variables.type,
          assetId: variables.assetId,
          assetType: variables.assetType,
        }),
      });
      await opts.onSuccess?.(data, variables, context);
    },
  });
}

export async function upsertFollow(
  client: ReturnType<typeof useClient>,
  input: UseUpsertFollowInput,
): Promise<UseUpsertFollowResult> {
  const {data} = await client.auth.getSession();
  invariant(data.session?.user.id, 'Must be logged in to create activity');

  const current = await getFollow(client, input);

  const result = await client
    .follow()
    .upsert(
      {
        type: input.type,
        user_id: data.session.user.id,
        asset_type: input.assetType,
        asset_id: input.assetId,
        is_active: !current?.is_active,
      },
      {ignoreDuplicates: false, onConflict: 'type,user_id,asset_id,asset_type'},
    )
    .eq('type', input.type ?? '')
    .eq('user_id', data.session.user.id)
    .eq('asset_id', input.assetId)
    .eq('asset_type', input.assetType)
    .select('*')
    .maybeSingle();

  if (result.error) {
    throw new Error(result.error.message);
  }

  invariant(result.data, 'Expected data to be present');

  return result.data as FollowRecord;
}
