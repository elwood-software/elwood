import {type PropsWithChildren} from 'react';
import {createClient} from '@/utils/supabase/server';
import AuthPage from '@/app/(unauthenticated)/auth/page';

export default async function AuthenticatedLayout(
  props: PropsWithChildren,
): Promise<JSX.Element> {
  const client = createClient();
  const {data} = await client.auth.getUser();

  if (!data.user) {
    return <AuthPage />;
  }

  return <>{props.children}</>;
}
