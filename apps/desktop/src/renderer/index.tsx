import { createRoot } from 'react-dom/client'
import { ElwoodThemeProvider } from '@elwood/ui'

import App from './app/app'
import Workspace from './workspace/workspace'

import './global.css'
import '@elwood/ui/style.css'

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
      <App />
    </ElwoodThemeProvider>
  )
}
