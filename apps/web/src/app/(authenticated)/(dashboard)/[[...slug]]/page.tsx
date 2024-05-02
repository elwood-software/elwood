'use client';

import React, {useEffect, useRef, useState} from 'react';
import {
  Router,
  ElwoodProvider,
  createBrowserRouter,
  dashboardRoutes,
  type RouterProps,
} from '@elwood/react';
import {Spinner} from '@elwood/ui';
import {type ElwoodClient} from '@elwood/js';
import {createClient} from '@/utils/supabase/client';

export default function Page(): JSX.Element {
  const [client, setClient] = useState<ElwoodClient | null>(null);
  const [router, setRouter] = useState<RouterProps['router'] | null>(null);

  useEffect(() => {
    setClient(createClient());
    setRouter(
      createBrowserRouter(dashboardRoutes, {
        basename: `/`,
      }),
    );
  }, []);

  if (!router || !client) {
    return <Spinner full />;
  }

  return (
    <ElwoodProvider workspaceName="Hello" client={client}>
      <Router router={router} />
    </ElwoodProvider>
  );
}
