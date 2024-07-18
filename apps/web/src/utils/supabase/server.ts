import {createServerClient, type CookieOptions} from '@supabase/ssr';
import {cookies} from 'next/headers';
import {type SupabaseClient} from '@elwood/js';
import {getSupabaseEnv} from './get-supabase-env';

export function createClient(): SupabaseClient {
  const [url, key] = getSupabaseEnv();
  const cookieStore = cookies();

  return createServerClient(url, key, {
    auth: {
      storageKey: 'elwood-auth',
    },
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({name, value, ...options});
        } catch (error) {
          // The `set` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({name, value: '', ...options});
        } catch (error) {
          // The `delete` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
}
