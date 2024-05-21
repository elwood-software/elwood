import React from 'react'
import { RouterProvider, createHashRouter } from 'react-router-dom'
import { type RouteObject } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

import { WorkspaceManagerProvider } from '../hooks/workspace-manager'
import { Layout } from './layout'
import { WorkspaceFrame } from './workspace/frame'
import { Welcome } from './welcome'

const queryClient = new QueryClient()

export default function App() {
  const routes: RouteObject[] = [
    {
      path: '/',
      children: [
        {
          path: '/',
          element: <Welcome />,
          index: true
        },
        {
          path: '/workspace',
          element: <Layout />,
          children: [
            {
              path: '/workspace/:id',
              element: <WorkspaceFrame />
            }
          ]
        }
      ]
    }
  ]
  const router = createHashRouter(routes, {})

  return (
    <WorkspaceManagerProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </WorkspaceManagerProvider>
  )
}
