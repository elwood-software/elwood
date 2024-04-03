'use client';

import {Spinner} from '@elwood/ui';
import {RootLayout} from './layout';

export function Placeholder(): JSX.Element {
  return (
    <RootLayout orgs={[]}>
      <Spinner full />
    </RootLayout>
  );
}
