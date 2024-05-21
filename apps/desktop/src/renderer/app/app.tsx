import React from 'react'
import { RouterProvider, createHashRouter } from 'react-router-dom'
import { type RouteObject } from 'react-router-dom'

import { Layout } from './layout'
import { WorkspaceFrame } from './workspace-frame'
import { AuthWorkspace } from './auth-workspace'
import { Welcome } from './welcome'

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
          path: '/auth-workspace',
          element: <AuthWorkspace />
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
  const router = createHashRouter(routes)

  return <RouterProvider router={router} />
}
