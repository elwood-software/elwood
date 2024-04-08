import type {ElwoodClient} from '@elwood/js';
import {invariant} from '@elwood/common';
import {useProviderContext} from './use-provider-context';

export function useClient(): ElwoodClient {
  const value = useProviderContext();
  invariant(value.client, 'No client in Provider context (for useClient())');
  return value.client;
}
