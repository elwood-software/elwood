'use client';

import {useState, useEffect, PropsWithChildren} from 'react';

import {type ElwoodClient} from '@elwood/js';
import {Spinner} from '@elwood/ui';
import {ElwoodProvider} from '@elwood/react';
import {createClient} from '@/utils/supabase/client';

export default function RenderIframeLayout(
  props: PropsWithChildren,
): JSX.Element {
  const [client, setClient] = useState<ElwoodClient | null>(null);

  useEffect(() => {
    setClient(createClient());
  }, []);

  if (!client) {
    return <Spinner />;
  }

  return (
    <ElwoodProvider workspaceName="Hello" client={client}>
      {props.children}
    </ElwoodProvider>
  );
}
