import {lazy, Suspense} from 'react';
import {Outlet, type RouteObject} from 'react-router-dom';

import {PageLayout} from '@/components/layouts/page';

const fallback = <PageLayout />;

export const studioRoutes: RouteObject[] = [
  {
    path: '/',
    element: <PageLayout />,
    children: [
      {
        path: '/',
        index: true,
        element: <PageLayout />,
      },
    ],
  },
];
