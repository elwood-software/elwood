import {revalidatePath} from 'next/cache';
import {RedirectType, redirect} from 'next/navigation';

export interface AuthCompleteProps {
  searchParams: {
    redirect_uri: string | undefined;
  };
}

export default async function AuthComplete(
  props: AuthCompleteProps,
): Promise<void> {
  revalidatePath('/', 'layout');
  redirect(props.searchParams.redirect_uri ?? '/', RedirectType.replace);
}
