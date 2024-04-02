import {useContext} from 'react';
import {invariant} from '@elwood/common';
import {ProviderContext, type ProviderContextValue} from '@/context';

export function useProviderContext(): ProviderContextValue {
  const value = useContext(ProviderContext);
  invariant(value, 'ProviderContext not found');
  return value;
}
