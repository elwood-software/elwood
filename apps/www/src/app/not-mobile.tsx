'use client';

import {PropsWithChildren} from 'react';
import {useMedia} from 'react-use';

export function NotMobile(props: PropsWithChildren) {
  const isWide = useMedia('(min-width: 960px)', false);
  return isWide ? props.children : null;
}
