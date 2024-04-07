import {type PropsWithChildren} from 'react';
import AuthPage from '@/app/(unauthenticated)/auth/page';
import {createClient} from '@/utils/supabase/server';

export default async function AuthenticatedLayout(
  props: PropsWithChildren,
): Promise<JSX.Element> {
  const client = createClient();
  const {
    data: {user},
  } = await client.auth.getUser();

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="flex flex-row w-screen h-screen">{props.children}</div>
  );
}
