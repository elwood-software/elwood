import React from 'react'
import { createMemoryRouter } from 'react-router-dom'

import { dashboardRoutes, Router, ElwoodProvider } from '@elwood/react'
import { createClient } from '@elwood/js'

export type WorkspaceProps = {
  id: string
}

export default function Workspace(props: WorkspaceProps) {
  return <div>Pooop</div>

  const client = createClient(
    'http://127.0.0.1:54321',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
  )
  const router = createMemoryRouter(dashboardRoutes)

  return (
    <ElwoodProvider workspaceName="poop" client={client}>
      <Router router={router} />
    </ElwoodProvider>
  )
}
