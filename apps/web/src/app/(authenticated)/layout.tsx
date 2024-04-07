'use client';

import {useEffect, type PropsWithChildren, useState} from 'react';
import {type User} from '@elwood/js';
import {invariant} from '@elwood/common';
import {Spinner} from '@elwood/ui';
import AuthPage from '@/app/(unauthenticated)/auth/page';
import {useClient} from '@/app/client-provider';

export default function AuthenticatedLayout(
  props: PropsWithChildren,
): JSX.Element {
  const client = useClient();
  const [user, setUser] = useState<User | null | false>(null);

  useEffect(() => {
    client.auth
      .getUser()
      .then(({data}) => {
        invariant(data.user, 'User is required');
        setUser(data.user);
      })
      .catch(() => {
        setUser(false);
      });
  }, [client]);

  if (user === null) {
    return <Spinner full />;
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="flex flex-row w-screen h-screen">{props.children}</div>
  );
}
