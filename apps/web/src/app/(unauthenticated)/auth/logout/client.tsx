'use client';

import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {createClient} from '@/utils/supabase/client';

export function Logout(): JSX.Element {
  const router = useRouter();
  const client = createClient();

  useEffect(() => {
    client.auth
      .signOut()
      .catch(function noOp() {
        // noop
      })
      .finally(() => {
        router.replace('/');
      });
  }, [router, client.auth]);

  return <div className="flex" />;
}
