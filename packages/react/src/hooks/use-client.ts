import type {ElwoodClient} from '@/routes/dashboard/node/js/src';
import {invariant} from '@elwood/common';
import {useProviderContext} from './use-provider-context';

export function useClient(): ElwoodClient {
  const value = useProviderContext();
  invariant(value.client, 'No client in Provider context (for useClient())');
  return value.client;
}
