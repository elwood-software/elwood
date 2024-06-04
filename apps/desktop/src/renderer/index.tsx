import React from 'react'
import { createRoot } from 'react-dom/client'
import { ElwoodThemeProvider } from '@elwood/ui'

import { ThemeBridge } from './components/theme-bridge'
import App from './routes/app'
import Workspace from './routes/workspace/view'

import './global.css'
import '@elwood/ui/dist/style.css'

try {
  window.elwood.log('info', 'Starting app render')

  const container = document.getElementById('root') as HTMLElement
  const root = createRoot(container)
  const searchParams = new URLSearchParams(window.location.search)

  if (searchParams.has('workspace')) {
    root.render(
      <ThemeBridge>
        <Workspace id={searchParams.get('workspace') as string} />
      </ThemeBridge>
    )
  } else {
    root.render(
      <ThemeBridge>
        <App />
      </ThemeBridge>
    )
  }
} catch (err) {
  window.elwood.log('error', 'Error rendering app', err)
}
