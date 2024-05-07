'use client';

import {PropsWithChildren} from 'react';
import {type ElwoodClient} from '@elwood/js';
import {ElwoodProvider} from '@elwood/react';

export type ProviderProps = {
  client: ElwoodClient;
};

export function Provider(props: PropsWithChildren<ProviderProps>) {
  return (
    <ElwoodProvider workspaceName="Dunder Mifflin" client={props.client}>
      {props.children}
    </ElwoodProvider>
  );
}
