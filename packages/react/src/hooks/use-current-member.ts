import {useState} from 'react';
import {ProviderContextValue} from '@/context';
import {useProviderContext} from './use-provider-context';

export function useCurrentMember(): ProviderContextValue['member'] {
  const {member} = useProviderContext();
  return member;
}

export function useIsCurrentMemberReadOnly(): boolean {
  const member = useCurrentMember();
  const [isCurrentMemberReadyOnly] = useState(
    member?.role?.endsWith('_RO') ?? true,
  );

  return isCurrentMemberReadyOnly;
}
