'use client';

import {useState, useEffect} from 'react';
import {cookies} from 'next/headers';

const storage =
  typeof localStorage === 'undefined'
    ? {
        getItem: (_: string) => undefined,
        setItem: (_: string, __: unknown) => undefined,
      }
    : localStorage;

export function ThemeManager(): null {
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
        cookies().set('theme', theme);
      } else if (theme !== body.getAttribute('data-color-server-theme')) {
        cookies().set('theme', theme);
      }

      body.classList.remove('light', 'dark');
      body.classList.add(theme);
    }
  }, [theme]);

  return null;
}
