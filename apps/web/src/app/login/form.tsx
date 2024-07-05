'use client';

import {useState} from 'react';
import {useFormStatus, useFormState} from 'react-dom';

import {AuthForm} from '@elwood/react';
import type {LoginActionState} from './action';

export type LoginFormProps = {
  action(state: LoginActionState, data: FormData): Promise<LoginActionState>;
};

export function LoginForm(props: LoginFormProps) {
  const {pending} = useFormStatus();
  // @ts-ignore
  const [state, formAction] = useFormState<LoginState>(props.action, {
    message: null,
  });

  return (
    <AuthForm
      loading={pending}
      errors={state.message}
      loginAction={formAction as any}
    />
  );
}
