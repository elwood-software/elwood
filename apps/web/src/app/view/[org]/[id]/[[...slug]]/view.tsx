'use client';

import {useEffect, useState} from 'react';
import {invariant, toArray} from '@elwood/common';
import {
  ElwoodProvider,
  Router,
  createBrowserRouter,
  viewRoutes,
  type RouterProps,
} from '@elwood/react';
import {Spinner} from '@elwood/ui';
import type {NodeType} from '@elwood/common';
import {useOrgs} from '@/hooks/use-orgs';
import {createClient} from '@/utils/supabase/client';

export interface ViewProps {
  org: string;
  id: string;
  nodeType: NodeType;
  nodeName: string;
}

export function View(props: ViewProps): JSX.Element {
  const {org, id, nodeType, nodeName} = props;
  const [router, setRouter] = useState<RouterProps['router'] | null>(null);
  const query = useOrgs();
  const currentOrg = toArray(query.data).find(o => o.name === props.org);

  useEffect(() => {
    if (org) {
      setRouter(
        createBrowserRouter(viewRoutes, {
          basename: `/view/${org}/${id}`,
        }),
      );
    }
  }, [org, id]);

  if (!router || !currentOrg) {
    return <Spinner full />;
  }

  return (
    <ElwoodProvider
      initialData={{
        nodeName,
        nodeType,
      }}
      currentOrg={currentOrg}
      orgs={[]}
      supabaseClient={createClient()}>
      <Router router={router} />
    </ElwoodProvider>
  );
}
