'use client'

import { ThemeProvider } from 'next-themes'

import { ElwoodThemeProvider } from '@elwood/ui'

export function Providers({ children }: { children: React.ReactNode }) {
  return <ElwoodThemeProvider>{children}</ElwoodThemeProvider>
}
