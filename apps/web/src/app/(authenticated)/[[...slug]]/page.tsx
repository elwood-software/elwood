'use client';

import React, {useEffect, useState} from 'react';
import {
  Router,
  ElwoodProvider,
  createBrowserRouter,
  dashboardRoutes,
  type RouterProps,
} from '@elwood/react';
import {createClient} from '@/utils/supabase/client';

export default function Page(): JSX.Element {
  const [router, setRouter] = useState<RouterProps['router'] | null>(null);

  useEffect(() => {
    setRouter(
      createBrowserRouter(dashboardRoutes, {
        basename: `/`,
      }),
    );
  }, []);

  if (!router) {
    return <div />;
  }

  const client = createClient();

  return (
    <ElwoodProvider workspaceName="Hello" client={client}>
      <Router router={router} />
    </ElwoodProvider>
  );
}
