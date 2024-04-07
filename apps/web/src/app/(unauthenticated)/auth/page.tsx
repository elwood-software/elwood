'use client';

// eslint-disable-next-line import/named -- intentional
import {useFormState} from 'react-dom';
import {AuthForm} from '@elwood/react';
import {redirect, RedirectType} from 'next/navigation';
import {useFormActionLoading} from '@/hooks/use-action-loading';
import {login, type LoginActionState} from './actions';

export interface AuthPageProps {
  hideEmail?: boolean;
  email?: string;
  redirectUri?: string;
}

export default function AuthPage(props: AuthPageProps): JSX.Element {
  const [loginIsLoading, action] =
    useFormActionLoading<LoginActionState>(login);

  const [state, loginAction] = useFormState<LoginActionState>(action, {
    status: 'waiting',
  });

  if (state.status === 'success') {
    const url = new URL(window.location.href);
    const params = new URLSearchParams({
      redirect_uri: url.searchParams.get('redirect_uri') ?? url.pathname,
    });

    console.log(state, url, params);

    redirect(`/auth/complete?${params.toString()}`, RedirectType.replace);
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <AuthForm
        hideEmail={props.hideEmail}
        email={props.email}
        errors={state.message ?? []}
        loading={loginIsLoading}
        loginAction={loginAction}
      />
    </div>
  );
}
