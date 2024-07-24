import {createClient} from '@elwood/js';

import {ElwoodProvider, type ElwoodProviderProps} from '../provider';
import {Router, createBrowserRouter} from '../components/router';
import {dashboardRoutes} from '../routes/dashboard/routes';
import {useEffect} from 'react';

export function Main() {
  const client = createClient(
    'http://127.0.0.1:54321',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
    {},
  );

  const workspaces: ElwoodProviderProps['workspaces'] = [
    {
      id: '00000000-0000-0000-0000-000000000000',
      name: 'duner-mifflin',
      displayName: 'Duner Mifflin',
      selected: true,
    },
  ];

  useEffect(() => {
    client.auth.signInWithPassword({
      email: 'admin@elwood.local',
      password: 'admin',
    });
  }, []);

  return (
    <ElwoodProvider
      isPlatform={false}
      client={client}
      workspaces={workspaces}
      onLogout={() => {}}>
      <Router router={createBrowserRouter(dashboardRoutes)} />
    </ElwoodProvider>
  );
}
