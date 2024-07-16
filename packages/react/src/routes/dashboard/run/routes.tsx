import {lazy, Suspense} from 'react';
import {Outlet, type RouteObject} from 'react-router-dom';

import {PageLayout} from '@/components/layouts/page';

import Layout from './layout';

const RunNewRoute = lazy(() => import('./new'));
const RunHomeRoute = lazy(() => import('./home'));
const RunViewRoute = lazy(() => import('./view'));
const RunWorkflowNewRoute = lazy(() => import('./workflow/new'));
const RunWorkflowViewRoute = lazy(() => import('./workflow/view'));

const fallback = <PageLayout />;

export const runRoutes: RouteObject[] = [
  {
    path: '/run',
    element: <Layout />,
    children: [
      {
        path: '/run',
        index: true,
        element: (
          <Suspense fallback={fallback}>
            <RunHomeRoute />
          </Suspense>
        ),
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
        path: '/run/workflow/new',
        element: (
          <Suspense fallback={fallback}>
            <RunWorkflowNewRoute />
          </Suspense>
        ),
      },
      {
        path: '/run/workflow/:id',
        element: (
          <Suspense fallback={fallback}>
            <RunWorkflowViewRoute />
          </Suspense>
        ),
      },
      {
        path: '/run/:id',
        element: (
          <Suspense fallback={fallback}>
            <RunViewRoute />
          </Suspense>
        ),
      },
    ],
  },
];
