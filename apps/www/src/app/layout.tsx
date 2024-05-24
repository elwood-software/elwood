import type {PropsWithChildren} from 'react';
import {type Metadata} from 'next';
import {cookies} from 'next/headers';
import {ElwoodThemeProvider} from '@elwood/ui';
import {Analytics} from '@vercel/analytics/react';

import './global.css';
import '@elwood/ui/style.css';

export const metadata: Metadata = {
  title: 'Elwood',
};

export default function RootLayout(props: PropsWithChildren): JSX.Element {
  const theme = cookies().get('system-theme')?.value ?? '';
  const validThemes = ['light', 'dark'];
  const themeClassName = validThemes.includes(theme) ? theme : '';

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`w-screen h-screen text-foreground bg-background ${themeClassName}`}
        data-color-mode={themeClassName}
        data-color-server-theme={theme}>
        <ElwoodThemeProvider>{props.children}</ElwoodThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
