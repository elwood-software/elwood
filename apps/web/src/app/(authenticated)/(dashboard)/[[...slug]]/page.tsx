'use client';

import React, {useEffect, useState} from 'react';
import {
  Router,
  createBrowserRouter,
  dashboardRoutes,
  type RouterProps,
} from '@elwood/react';
import {Spinner} from '@elwood/ui';
import {type ElwoodClient} from '@elwood/js';
import {createClient} from '@/utils/supabase/client';
import {Provider} from '@/app/provider';

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
    <Provider client={client}>
      <Router router={router} />
    </Provider>
  );
}
