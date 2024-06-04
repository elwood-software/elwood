import {useContext} from 'react';
import {invariant} from '@elwood/common';
import {ProviderContext, type ProviderContextValue} from '@/context';

import {FeatureFlag} from '@/constants';

export function useProviderContext(): ProviderContextValue {
  const value = useContext(ProviderContext);
  invariant(value, 'ProviderContext not found');
  return value;
}

export function useFeatureFlag(): ProviderContextValue['featureFlags'];
export function useFeatureFlag(flag: FeatureFlag): boolean;
export function useFeatureFlag(
  flag?: FeatureFlag,
): boolean | ProviderContextValue['featureFlags'] {
  const {featureFlags} = useProviderContext();
  return flag ? featureFlags[flag] ?? false : featureFlags;
}
