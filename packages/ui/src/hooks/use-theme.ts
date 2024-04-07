import {useEffect, useState} from 'react';
import {useCookie, useMedia} from 'react-use';

export type Theme = 'light' | 'dark' | 'system';

export interface UseThemeResult {
  value: Theme;
  bodyClass: string;
  change: (value: Theme) => void;
}

export function useTheme(): UseThemeResult {
  const [cookie, setThemeCookie] = useCookie('theme');
  const [_, setSystemThemeCookie] = useCookie('system-theme');

  const isLight = useMedia('(prefers-color-scheme: light)', false);
  const isDark = useMedia('(prefers-color-scheme: dark)', false);

  const [value, setValue] = useState<Theme>((cookie ?? 'system') as Theme);
  const [themeValue, setThemeValue] = useState<'light' | 'dark'>(
    getCookieValue(cookie, isLight),
  );

  useEffect(() => {
    const body = document.querySelector('body');
    body?.classList.remove('light', 'dark');
    body?.classList.add(themeValue);
    setSystemThemeCookie(themeValue);
  }, [themeValue, setSystemThemeCookie]);

  useEffect(() => {
    if (value !== 'system') {
      setThemeValue(value);
    } else {
      setThemeValue(isLight ? 'light' : 'dark');
    }

    setValue(value);
    setThemeCookie(value);
  }, [isLight, isDark, value, setValue, setThemeCookie, setSystemThemeCookie]);

  return {
    value,
    bodyClass: themeValue,
    change: nextValue => {
      setValue(nextValue);
    },
  };
}

function getCookieValue(
  value: string | null,
  isLight: boolean,
): 'light' | 'dark' {
  if (value === 'system') {
    return isLight ? 'light' : 'dark';
  }

  if (value === 'light' || value === 'dark') {
    return value;
  }
  return 'light';
}
