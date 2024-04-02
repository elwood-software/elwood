import {lazy, Suspense} from 'react';
import {type RouteObject} from 'react-router-dom';
import {MainLayout} from '@/components/layouts/main';
import {useProviderContext} from '@/hooks/use-provider-context';

const Home = lazy(() => import('./home'));

const NodeLayout = lazy(() => import('./node/layout'));
const Tree = lazy(() => import('./node/tree'));
const Blob = lazy(() => import('./node/blob'));
const Create = lazy(() => import('./node/new'));
const Share = lazy(() => import('./node/share'));

const fallback = <Fallback />;

export const dashboardRoutes: RouteObject[] = [
  {
    path: '/',
    children: [
      {
        path: '/',
        index: true,
        element: (
          <Suspense fallback={fallback}>
            <Home />
          </Suspense>
        ),
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
          {
            path: '/share/*',
            element: (
              <Suspense fallback={fallback}>
                <Share />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
];

function Fallback(): JSX.Element {
  const {workspaceName} = useProviderContext();
  return <MainLayout title={workspaceName} loading />;
}
