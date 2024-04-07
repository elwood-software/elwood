'use client';

import {type PropsWithChildren, createContext, useContext} from 'react';
import {invariant} from '@elwood/common';
import {createClient} from '@/utils/supabase/client';

const ClientContext = createContext<ReturnType<typeof createClient> | null>(
  null,
);

export function ClientProvider(props: PropsWithChildren): JSX.Element {
  return (
    <ClientContext.Provider value={createClient()}>
      {props.children}
    </ClientContext.Provider>
  );
}

export function useClient(): ReturnType<typeof createClient> {
  const client = useContext(ClientContext);
  invariant(client, 'Client is required for useClient');
  return client;
}
