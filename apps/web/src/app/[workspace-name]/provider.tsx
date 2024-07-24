'use client';

import {PropsWithChildren} from 'react';
import {useRouter} from 'next/navigation';
import {type ElwoodClient} from '@elwood/js';
import {ElwoodProvider, type ElwoodProviderProps} from '@elwood/react';
import type {Platform} from '@elwood/common';

export type ProviderProps = {
  client: ElwoodClient;
  workspaces: ElwoodProviderProps['workspaces'];
};

export function Provider(props: PropsWithChildren<ProviderProps>) {
  const router = useRouter();

  function onLogout() {
    router.push('/logout');
  }

  return (
    <ElwoodProvider
      isPlatform={false}
      workspaces={props.workspaces}
      client={props.client}
      onLogout={onLogout}>
      {props.children}
    </ElwoodProvider>
  );
}
