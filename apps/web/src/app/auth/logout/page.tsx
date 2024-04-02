import {revalidatePath} from 'next/cache';
import {createClient} from '@/utils/supabase/server';
import {Logout} from './client';

export default async function Page(): Promise<JSX.Element> {
  const client = createClient();
  await client.auth.signOut();

  revalidatePath('/', 'layout');

  return <Logout />;
}
