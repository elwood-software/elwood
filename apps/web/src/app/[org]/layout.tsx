import {type PropsWithChildren} from 'react';

import {createClient} from '@/utils/supabase/server';
import {redirect} from 'next/navigation';

export default async function AuthenticatedLayout(
  props: PropsWithChildren,
): Promise<JSX.Element> {
  const client = createClient();
  const {
    data: {user},
  } = await client.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  return <>{props.children}</>;
}
