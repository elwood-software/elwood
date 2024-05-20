import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { type RouteObject } from 'react-router-dom';

import { Layout } from './layout';
import { WorkspaceFrame } from './workspace-frame';
import { Welcome } from './welcome';

export default function App() {
  const routes: RouteObject[] = [
    {
      path: '/',
      children: [
        {
          path: '/',
          element: <Welcome />,
          index: true,
        },
        {
          path: '/workspace',
          element: <Layout />,
          children: [
            {
              path: '/workspace/:id',
              element: <WorkspaceFrame />,
            },
          ],
        },
      ],
    },
  ];
  const router = createMemoryRouter(routes);

  return <RouterProvider router={router} />;
}
