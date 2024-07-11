'use client';

import {useState} from 'react';
import {useFormStatus, useFormState} from 'react-dom';

import {AuthForm, AuthFormProps} from '@elwood/react';
import type {LoginActionState} from './action';

export type LoginFormProps = {
  action(state: LoginActionState, data: FormData): Promise<LoginActionState>;
};

export function LoginForm(props: LoginFormProps) {
  // @ts-ignore
  const [state, formAction] = useFormState<LoginState>(props.action, {
    message: null,
  });

  return (
    <form action={formAction}>
      <FormWithLoading errors={state.message} />
    </form>
  );
}

function FormWithLoading(props: Omit<AuthFormProps, 'loading'>) {
  const status = useFormStatus();

  return <AuthForm loading={status.pending} {...props} />;
}
