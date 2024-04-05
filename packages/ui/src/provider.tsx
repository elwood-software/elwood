'use client';

import {type PropsWithChildren, type ReactNode} from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import * as Toast from '@radix-ui/react-toast';
import {Toaster} from './components/sonner';

export function ElwoodThemeProvider(props: PropsWithChildren): ReactNode {
  const {children} = props;

  return (
    <Tooltip.Provider>
      <Toast.Provider swipeDirection="right">{children}</Toast.Provider>
      <Toaster richColors />
    </Tooltip.Provider>
  );
}
