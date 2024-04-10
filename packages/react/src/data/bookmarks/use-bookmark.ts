/* eslint-disable @typescript-eslint/no-floating-promises -- intentional */
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import {type BookmarkRecord} from '@elwood/common';
import {useClient} from '@/hooks/use-client';
import keys from './_keys';

export type UseBookmarkResult = BookmarkRecord | undefined;

export interface UseBookmarkInput {
  assetId: string;
  assetType: string;
}

export function useBookmark(
  input: UseBookmarkInput,
  opts: Omit<UseQueryOptions<UseBookmarkResult>, 'queryKey' | 'queryFn'> = {},
): UseQueryResult<UseBookmarkResult> {
  const client = useClient();

  return useQuery<UseBookmarkResult>({
    ...opts,
    queryKey: keys.get(input),
    queryFn: async () => {
      return await getBookmark(client, input);
    },
  });
}

export async function getBookmark(
  client: ReturnType<typeof useClient>,
  input: UseBookmarkInput,
): Promise<UseBookmarkResult> {
  const q = client.bookmarks().select('*');

  q.eq('asset_id', input.assetId);
  q.eq('asset_type', input.assetType);

  const result = await q.maybeSingle();

  return result.data as UseBookmarkResult;
}
