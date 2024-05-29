'use client';

import {useEffect, type PropsWithChildren, type ReactNode} from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import * as Toast from '@radix-ui/react-toast';
import {Toaster} from './components/sonner';
import {useTheme, type Theme} from './hooks/use-theme';

export type ElwoodThemeProviderProps = {
  onThemeChange?(theme: Theme): void;
};

export function ElwoodThemeProvider(
  props: PropsWithChildren<ElwoodThemeProviderProps>,
): ReactNode {
  const {children} = props;
  const {value} = useTheme();

  useEffect(() => {
    props.onThemeChange && props.onThemeChange(value);
  }, [value]);

  return (
    <Tooltip.Provider>
      <Toast.Provider swipeDirection="right">{children}</Toast.Provider>
      <Toaster richColors />
    </Tooltip.Provider>
  );
}
