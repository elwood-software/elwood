import {lazy, Suspense} from 'react';
import {Outlet, type RouteObject} from 'react-router-dom';

import {PageLayout} from '@/components/layouts/page';

import Home from './home';
import NodeLayout from './node/layout';
import Layout from './layout';

const Tree = lazy(() => import('./node/tree'));
const Blob = lazy(() => import('./node/blob'));
const Create = lazy(() => import('./node/new'));

const fallback = <PageLayout />;

export const dashboardRoutes: RouteObject[] = [
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
        element: (
          <Suspense fallback={fallback}>
            <NodeLayout />
          </Suspense>
        ),
        children: [
          {
            path: '/tree/*',
            element: (
              <Suspense fallback={fallback}>
                <Tree />
              </Suspense>
            ),
          },
          {
            path: '/blob/*',
            element: (
              <Suspense fallback={fallback}>
                <Blob />
              </Suspense>
            ),
          },
          {
            path: '/new/*',
            element: (
              <Suspense fallback={fallback}>
                <Create />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
];
