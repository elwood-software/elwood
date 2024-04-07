'use server';

import {z} from 'zod';
import {createClient} from '@/utils/supabase/server';

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
  state: LoginActionState | null,
  formData?: FormData,
): Promise<LoginActionState> {
  const client = createClient();

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

  const {data, error} = await client.auth.signInWithPassword({
    email: validatedFields.data.email,
    password: validatedFields.data.password,
  });

  console.log('aaxxxxx', data, error);

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
