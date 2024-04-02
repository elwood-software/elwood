import {redirect} from 'next/navigation';
import {invariant} from '@elwood/common';
import {type GetNodeResult} from '@elwood/common';
import {createClient} from '@/utils/supabase/server';
import AuthPage from '@/app/auth/page';
import {View} from './view';

export interface ViewPageProps {
  params: {
    id: string;
    org: string;
  };
}

export default async function ViewPage(
  props: ViewPageProps,
): Promise<JSX.Element> {
  const client = createClient();
  const {id, org} = props.params;

  const result = await client.functions.invoke<{
    status: number;
    headers: Record<string, string>;
    body: unknown;
  }>(`share?id=${id}`, {
    method: 'GET',
  });

  if (result.error || !result.data) {
    return <div>not found</div>;
  }

  const {status, headers = {}, body} = result.data;

  // if the function returns a redirect
  // that the user there
  if (status === 302) {
    const location = headers.location;
    invariant(location, 'Expected a location header');
    redirect(location);
  }

  //
  if (status === 401) {
    const {email} = body as {email: string};

    return (
      <AuthPage hideEmail email={email} redirectUri={`/view/${id}?auth=true`} />
    );
  }

  if (status === 403) {
    return <div>nope</div>;
  }

  const {node} = body as GetNodeResult;

  invariant(node, 'missing node');

  return <View id={id} org={org} nodeType={node.type} nodeName={node.name} />;
}
