import {Suspense, lazy} from 'react';
import type {RouteObject} from 'react-router-dom';
import {Navigate, Outlet} from 'react-router-dom';
import {useProviderContext} from '@/hooks/use-provider-context';

const Tree = lazy(() => import('./tree'));

export const viewRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Outlet />,
    children: [
      {
        path: '/',
        index: true,
        element: <RootRedirect />,
      },
      {
        path: '/tree/',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Tree />
          </Suspense>
        ),
      },
      {
        path: '/blob/',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Tree />
          </Suspense>
        ),
      },
    ],
  },
];

function RootRedirect(): JSX.Element {
  const {initialData = {}} = useProviderContext();

  console.log(initialData);

  return <Navigate to={`/${initialData.nodeType.toLowerCase()}`} />;
}
