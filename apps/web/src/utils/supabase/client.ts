import {default as Cookies} from 'universal-cookie';
import {createBrowserClient} from '@supabase/ssr';
import {
  createClient as createElwoodClient,
  type ElwoodClient,
} from '@elwood/js';
import {getSupabaseEnv} from './get-supabase-env';

export function createClient(): ElwoodClient {
  const [url, key] = getSupabaseEnv();
  const c = new Cookies();
  const storage = {
    getItem: (key: string) => {
      return c.get(key) ?? null;
    },
    setItem: (key: string, value: string) => {
      c.set(key, value);
    },
    removeItem: (key: string) => {
      c.remove(key);
    },
  };

  return createElwoodClient(
    url,
    key,
    {
      auth: {
        storageKey: 'elwood-auth',
        storage,
      },
    },
    createBrowserClient,
  );
}
