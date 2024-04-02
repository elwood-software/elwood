'use client';

import {
  useState,
  type PropsWithChildren,
  type ReactNode,
  useEffect,
} from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import * as Toast from '@radix-ui/react-toast';

const storage =
  typeof localStorage === 'undefined'
    ? {
        getItem: (_: string) => undefined,
        setItem: (_: string, __: unknown) => undefined,
      }
    : localStorage;

export function ElwoodThemeProvider(props: PropsWithChildren): ReactNode {
  const {children} = props;
  const [theme, setTheme] = useState<string | null>(
    storage.getItem('theme') ?? null,
  );

  useEffect(() => {
    if (theme === null) {
      setTheme(
        window.matchMedia('(prefers-color-scheme: light)').matches
          ? 'light'
          : 'dark',
      );
    }

    function onLightChange(e: MediaQueryListEvent): void {
      setTheme(e.matches ? 'light' : 'dark');
    }
    function onDarkChange(e: MediaQueryListEvent): void {
      setTheme(e.matches ? 'dark' : 'light');
    }

    const lightMatch = window.matchMedia('(prefers-color-scheme: light)');
    const darkMatch = window.matchMedia('(prefers-color-scheme: dark)');

    lightMatch.addEventListener('change', onLightChange);
    darkMatch.addEventListener('change', onDarkChange);

    return function unload() {
      lightMatch.removeEventListener('change', onLightChange);
      darkMatch.removeEventListener('change', onDarkChange);
    };
  }, [theme]);

  useEffect(() => {
    const body = document.querySelector('body');

    if (theme && body) {
      if (theme !== storage.getItem('theme')) {
        storage.setItem('theme', theme);
        saveThemeToServer(theme);
      } else if (theme !== body.getAttribute('data-color-server-theme')) {
        saveThemeToServer(theme);
      }

      body.classList.remove('light', 'dark');
      body.classList.add(theme);
    }
  }, [theme]);

  return (
    <Tooltip.Provider>
      <Toast.Provider swipeDirection="right">{children}</Toast.Provider>
    </Tooltip.Provider>
  );
}

function saveThemeToServer(value: string): void {
  fetch(`/api/theme`, {method: 'POST', body: value})
    .then(() => {
      // noop
    })
    .catch(() => {
      // noop
    });
}
