'use client';

import {useEffect, useState} from 'react';
import {createMemoryRouter} from 'react-router-dom';
import {
  Router,
  ElwoodProvider,
  MainLayout,
  dashboardRoutes,
} from '@elwood/react';
import {Spinner} from '@elwood/ui';
import {type ElwoodClient, createClient, type User} from '@elwood/js';

export function Demo() {
  const [router] = useState(createMemoryRouter(dashboardRoutes));
  const [client, setClient] = useState<ElwoodClient | null>(null);
  const [_user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (client) {
      return;
    }

    setLoading(true);
    const localClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    localClient.auth.getSession().then(({data}) => {
      if (data.session) {
        setClient(localClient);
        setLoading(false);
        return;
      }

      return localClient.auth
        .signInWithPassword({
          email: process.env.NEXT_PUBLIC_DEMO_USER_EMAIL!,
          password: process.env.NEXT_PUBLIC_DEMO_USER_PW!,
        })
        .then(response => {
          setUser(response.data?.user ?? null);
        })
        .catch(error => {
          console.log(error.message);
        })
        .finally(() => {
          setClient(localClient);
          setLoading(false);
        });
    });
  }, []);

  const workspaceName = 'Dunder Mifflin';

  if (!client || loading) {
    return (
      <MainLayout header={<></>}>
        <Spinner className="stroke-muted-foreground m-3" />
      </MainLayout>
    );
  }

  return (
    <ElwoodProvider
      workspaceName={workspaceName}
      client={client}
      onLogout={() => {}}>
      <Router router={router} />
    </ElwoodProvider>
  );
}
