'use client';

import React, {useEffect, useRef, useState} from 'react';
import {
  Router,
  ElwoodProvider,
  createBrowserRouter,
  dashboardRoutes,
  type RouterProps,
} from '@elwood/react';
import {createClient} from '@/utils/supabase/client';

export default function Page(): JSX.Element {
  const client = useRef(createClient());
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

  return (
    <ElwoodProvider workspaceName="Hello" client={client.current}>
      <Router router={router} />
    </ElwoodProvider>
  );
}
