import {revalidatePath} from 'next/cache';
import {Logout} from './client';

export default async function Page(): Promise<JSX.Element> {
  revalidatePath('/', 'layout');

  return <Logout />;
}
