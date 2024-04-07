'use server';

import {z} from 'zod';
import {type ElwoodClient} from '@elwood/js';

const schema = z.object({
  email: z.string({
    invalid_type_error: 'Invalid Email',
  }),
  password: z.string({
    invalid_type_error: 'Invalid Password',
  }),
});

export interface LoginActionState {
  status: 'waiting' | 'success' | 'error';
  message?: string[];
}

export async function login(
  client: ElwoodClient,
  formData?: FormData,
): Promise<LoginActionState> {
  console.log();

  return {
    status: 'error',
    message: ['Invalid form data'],
  };

  if (!formData) {
    return {
      status: 'error',
      message: ['Invalid form data'],
    };
  }

  const validatedFields = schema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      status: 'error',
      message: validatedFields.error.issues.map(issue => issue.message),
    };
  }

  const {error} = await client.auth.signInWithPassword({
    email: validatedFields.data.email,
    password: validatedFields.data.password,
  });

  if (error) {
    return {
      status: 'error',
      message: [error.message],
    };
  }

  return {
    status: 'success',
  };
}
