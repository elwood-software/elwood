'use client';
import {useState} from 'react';
import {AuthForm} from '@elwood/react';
import {revalidatePath} from 'next/cache';
import {redirect, RedirectType, useRouter} from 'next/navigation';
import {useClient} from '@/app/client-provider';

export interface AuthPageProps {
  hideEmail?: boolean;
  email?: string;
  redirectUri?: string;
}

export default function AuthPage(props: AuthPageProps): JSX.Element {
  const client = useClient();
  const [loginIsLoading, setLoginIsLoading] = useState(false);
  const [loginErrors, setLoginErrors] = useState<string[]>([]);
  const router = useRouter();

  async function onSubmit(formData: FormData): Promise<void> {
    setLoginIsLoading(true);

    try {
      const {error} = await client.auth.signInWithPassword({
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      });

      if (error) {
        setLoginErrors([error.message]);
        return;
      }

      console.log('poop');

      router.refresh();
    } catch (error) {
      // eslint-disable-next-line no-console -- intentional
      console.error('login error', error);
      setLoginErrors(['An unexpected error occurred']);
    } finally {
      setLoginIsLoading(false);
    }
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <AuthForm
        hideEmail={props.hideEmail}
        email={props.email}
        errors={loginErrors}
        loading={loginIsLoading}
        loginAction={onSubmit}
      />
    </div>
  );
}
