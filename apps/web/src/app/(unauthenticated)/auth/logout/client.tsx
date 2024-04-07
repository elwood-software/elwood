'use client';

import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {useClient} from '@/app/client-provider';

export function Logout(): JSX.Element {
  const router = useRouter();
  const client = useClient();

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
