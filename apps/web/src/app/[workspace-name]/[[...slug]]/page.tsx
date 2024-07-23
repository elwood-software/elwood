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
import {Provider} from '../provider';
import {useWorkspaces} from '@/data/use-workspaces';
import {toArray, type Platform} from '@elwood/common';

type Props = {
  params: {
    'workspace-name': string;
  };
};

export default function Page(props: Props): JSX.Element {
  const [client, setClient] = useState<ElwoodClient | null>(null);
  const [router, setRouter] = useState<RouterProps['router'] | null>(null);
  const {data, loading} = useWorkspaces();
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Platform.Workspace | null>(null);
  const workspaces = toArray(data);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!loading && workspaces.length === 0) {
      setError('No Workspaces found');
      return;
    }

    const activeWorkspace = workspaces.find(
      o => o.name === props.params['workspace-name'],
    );

    if (!activeWorkspace) {
      setError('Organization not found');
      return;
    }

    setSelected(activeWorkspace);
    setClient(createClient());
    setRouter(
      createBrowserRouter(dashboardRoutes, {
        basename: `/${activeWorkspace.name}`,
      }),
    );
  }, [props.params['workspace-name'], workspaces]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!router || !client || !selected) {
    return <Spinner full />;
  }

  return (
    <Provider
      client={client}
      workspaces={workspaces.map(item => ({
        ...item,
        selected: item.id === selected.id,
      }))}>
      <Router router={router} />
    </Provider>
  );
}
