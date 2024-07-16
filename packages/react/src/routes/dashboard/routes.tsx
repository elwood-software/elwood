import {lazy, Suspense} from 'react';
import {type RouteObject} from 'react-router-dom';

import {PageLayout} from '@/components/layouts/page';

import {runRoutes} from './run/routes';
import {nodeRoutes} from './node/routes';

import Home from './home';
import Layout from './layout';

const Assistant = lazy(() => import('./assistant'));

const fallback = <PageLayout />;

export const dashboardRoutes: RouteObject[] = [
  ...runRoutes,
  ...nodeRoutes,
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        index: true,
        element: <Home />,
      },
      {
        path: '/assistant',
        element: (
          <Suspense fallback={fallback}>
            <Assistant />
          </Suspense>
        ),
      },
    ],
  },
];
