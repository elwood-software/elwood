import type {UseQueryOptions, UseQueryResult} from '@tanstack/react-query';
import {useQuery} from '@tanstack/react-query';
import {type User} from '@elwood/js';
import {useSupabase} from '@/hooks/use-client';

export type UseCurrenUserResult = User | null;

export function useCurrentUser(
  opts: Omit<UseQueryOptions<UseCurrenUserResult>, 'queryFn' | 'queryKey'> = {},
): UseQueryResult<UseCurrenUserResult> {
  const supabase = useSupabase();

  return useQuery({
    ...opts,
    queryKey: ['current-user'],
    async queryFn() {
      const user = await supabase.auth.getUser();

      return user.data.user ?? null;
    },
  });
}
