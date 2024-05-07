'use client';

import {useState, useEffect, PropsWithChildren} from 'react';

import {type ElwoodClient} from '@elwood/js';

import {createClient} from '@/utils/supabase/client';
import {default as PageLoading} from './loading';
import {Provider} from '@/app/provider';

export default function RenderIframeLayout(
  props: PropsWithChildren,
): JSX.Element {
  const [client, setClient] = useState<ElwoodClient | null>(null);

  useEffect(() => {
    setClient(createClient());
  }, []);

  if (!client) {
    return <PageLoading />;
  }

  return <Provider client={client}>{props.children}</Provider>;
}
