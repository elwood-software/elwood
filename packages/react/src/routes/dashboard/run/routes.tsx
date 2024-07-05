import {lazy, Suspense} from 'react';
import {Outlet, type RouteObject} from 'react-router-dom';

import {PageLayout} from '@/components/layouts/page';

import Layout from './layout';

const RunNewRoute = lazy(() => import('./new'));

const fallback = <PageLayout />;

export const runRoutes: RouteObject[] = [
  {
    path: '/run',
    element: <Layout />,
    children: [
      {
        path: '/run',
        index: true,
        element: 'div',
      },
      {
        path: '/run/new',
        element: (
          <Suspense fallback={fallback}>
            <RunNewRoute />
          </Suspense>
        ),
      },
      {
        path: '/run/:id',
        element: 'div',
      },
    ],
  },
];
