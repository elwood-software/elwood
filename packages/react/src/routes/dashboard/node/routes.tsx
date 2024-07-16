import {lazy, Suspense} from 'react';
import {Outlet, type RouteObject} from 'react-router-dom';

import {PageLayout} from '@/components/layouts/page';

import NodeLayout from './layout';

const Tree = lazy(() => import('./tree'));
const Blob = lazy(() => import('./blob'));
const Create = lazy(() => import('./new'));

const fallback = <PageLayout />;

export const nodeRoutes: RouteObject[] = [
  {
    path: '/',
    element: <NodeLayout />,
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
];
