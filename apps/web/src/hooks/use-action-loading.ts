import {useState} from 'react';

export type FormAction<State> = (
  state: State,
  data?: FormData,
) => Promise<State>;

export function useFormActionLoading<State>(
  action: FormAction<State>,
): [boolean, FormAction<State>] {
  const [loading, setLoading] = useState(false);

  async function formAction(state: State, data?: FormData): Promise<State> {
    setLoading(true);
    try {
      return await action(state, data);
    } finally {
      setLoading(false);
    }
  }
  return [loading, formAction];
}
