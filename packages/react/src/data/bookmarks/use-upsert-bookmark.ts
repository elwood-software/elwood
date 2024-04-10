import type {
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {invariant, type BookmarkRecord} from '@elwood/common';
import {useClient} from '@/hooks/use-client';
import keys from './_keys';
import {getBookmark} from './use-bookmark';

export type UseUpsertBookmarkResult = BookmarkRecord;

export interface UseUpsertBookmarkInput {
  assetType: string;
  assetId: string;
}

export function useUpsertBookmark(
  opts: Omit<
    UseMutationOptions<UseUpsertBookmarkResult, Error, UseUpsertBookmarkInput>,
    'mutationFn'
  > = {},
): UseMutationResult<UseUpsertBookmarkResult, Error, UseUpsertBookmarkInput> {
  const client = useClient();
  const queryClient = useQueryClient();

  return useMutation({
    ...opts,
    mutationFn: async data => {
      return await upsertBookmark(client, data);
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

export async function upsertBookmark(
  client: ReturnType<typeof useClient>,
  input: UseUpsertBookmarkInput,
): Promise<UseUpsertBookmarkResult> {
  const {data} = await client.auth.getSession();
  invariant(data.session?.user.id, 'Must be logged in to create activity');

  const current = await getBookmark(client, input);

  const result = await client
    .bookmarks()
    .upsert(
      {
        user_id: data.session.user.id,
        asset_type: input.assetType,
        asset_id: input.assetId,
        is_active: !current?.is_active,
      },
      {ignoreDuplicates: false, onConflict: 'user_id,asset_id,asset_type'},
    )
    .eq('user_id', data.session.user.id)
    .eq('asset_id', input.assetId)
    .eq('asset_type', input.assetType)
    .select('*')
    .maybeSingle();

  if (result.error) {
    throw new Error(result.error.message);
  }

  invariant(result.data, 'Expected data to be present');

  return result.data as BookmarkRecord;
}
