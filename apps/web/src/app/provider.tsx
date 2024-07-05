'use client';

import {PropsWithChildren} from 'react';
import {useRouter} from 'next/navigation';
import {type ElwoodClient} from '@elwood/js';
import {ElwoodProvider} from '@elwood/react';

export type ProviderProps = {
  client: ElwoodClient;
  workspaceName: string;
};

export function Provider(props: PropsWithChildren<ProviderProps>) {
  const router = useRouter();

  function onLogout() {
    router.push('/auth/logout');
  }

  return (
    <ElwoodProvider
      workspaceName={props.workspaceName}
      client={props.client}
      onLogout={onLogout}>
      {props.children}
    </ElwoodProvider>
  );
}
