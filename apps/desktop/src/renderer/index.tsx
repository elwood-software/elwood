import React from 'react'
import { createRoot } from 'react-dom/client'
import { ElwoodThemeProvider } from '@elwood/ui'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

import App from './app/app'
import Workspace from './workspace/workspace'

import './global.css'
import '@elwood/ui/style.css'

try {
  window.elwood.log('info', 'Starting app render')

  const queryClient = new QueryClient()
  const container = document.getElementById('root') as HTMLElement
  const root = createRoot(container)
  const searchParams = new URLSearchParams(window.location.search)

  if (searchParams.has('workspace')) {
    root.render(
      <ElwoodThemeProvider>
        <Workspace id={searchParams.get('workspace') as string} />
      </ElwoodThemeProvider>
    )
  } else {
    root.render(
      <ElwoodThemeProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </ElwoodThemeProvider>
    )
  }
} catch (err) {
  window.elwood.log('error', 'Error rendering app', err)
}
