'use client';

import React, {useEffect, useState} from 'react';
import {
  Router,
  ElwoodProvider,
  createBrowserRouter,
  dashboardRoutes,
  type RouterProps,
} from '@elwood/react';
import {toArray} from '@elwood/common';
import {useOrgs} from '@/hooks/use-orgs';
import {createClient} from '@/utils/supabase/client';
import {RootLayout} from '@/components/layout';
import {Placeholder} from '../../placeholder';

export interface PageProps {
  params: {
    org: string;
  };
}

export default function Page(props: PageProps): JSX.Element {
  const {org: orgName} = props.params;
  const [router, setRouter] = useState<RouterProps['router'] | null>(null);
  const query = useOrgs();

  useEffect(() => {
    if (orgName) {
      setRouter(
        createBrowserRouter(dashboardRoutes, {
          basename: `/${orgName}`,
        }),
      );
    }
  }, [orgName]);

  if (query.isLoading || router === null) {
    return <Placeholder />;
  }

  // TODO: better error page
  if (query.error) {
    return <div>Error no org!</div>;
  }

  const orgs = toArray(query.data);
  const currentOrg = orgs.find(o => o.name === orgName);

  // TODO: better error page
  if (!currentOrg) {
    return <div>Error no org!</div>;
  }

  // TRAVIS: this should be swapped with a rotating provider
  // per org, but for now we only have one org in testings
  const client = createClient();

  const layoutOrgs = orgs.map(org => ({
    id: org.name,
    name: org.display_name,
    active: org.display_name === currentOrg.display_name,
  }));

  return (
    <RootLayout orgs={layoutOrgs}>
      <ElwoodProvider workspaceName={currentOrg.display_name} client={client}>
        <Router router={router} />
      </ElwoodProvider>
    </RootLayout>
  );
}
