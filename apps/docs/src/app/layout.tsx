import { type Metadata } from 'next'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import { cookies } from 'next/headers'
import clsx from 'clsx'

import { Providers } from '@/app/providers'
import { Layout } from '@/components/Layout'

import '@/styles/tailwind.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

// Use local version of Lexend so that we can use OpenType features
const lexend = localFont({
  src: '../fonts/lexend.woff2',
  display: 'swap',
  variable: '--font-lexend',
})

export const metadata: Metadata = {
  title: {
    template: '%s - Docs',
    default: 'Elwood Documentation | Open Source Dropbox Alternative',
  },
  description:
    'Lighting fast, resumable uploads. Real-time, multi-user collaboration. Powerful role-based sharing (coming soon).',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const theme = cookies().get('system-theme')?.value ?? ''
  const validThemes = ['light', 'dark']
  const themeClassName = validThemes.includes(theme) ? theme : ''

  return (
    <html
      lang="en"
      className={clsx('h-full antialiased', inter.variable, lexend.variable)}
      suppressHydrationWarning
    >
      <body
        className={`flex min-h-full ${themeClassName}`}
        data-color-mode={themeClassName}
        data-color-server-theme={theme}
      >
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  )
}
