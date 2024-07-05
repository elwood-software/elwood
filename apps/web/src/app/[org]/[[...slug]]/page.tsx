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
import {useOrgs} from '@/data/use-orgs';

type Props = {
  params: {
    org: string;
  };
};

export default function Page(props: Props): JSX.Element {
  const [client, setClient] = useState<ElwoodClient | null>(null);
  const [router, setRouter] = useState<RouterProps['router'] | null>(null);
  const {data: orgs, loading} = useOrgs();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!loading && orgs.length === 0) {
      setError('No organizations found');
      return;
    }

    const org = orgs.find(o => o.name === props.params.org);

    if (!org) {
      setError('Organization not found');
      return;
    }

    setClient(createClient());
    setRouter(
      createBrowserRouter(dashboardRoutes, {
        basename: `/${org.name}`,
      }),
    );
  }, [props.params.org, orgs]);

  if (!router || !client) {
    return <Spinner full />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Provider
      client={client}
      workspaceName={
        orgs.find(o => o.name === props.params.org)?.display_name ?? '...'
      }>
      <Router router={router} />
    </Provider>
  );
}
