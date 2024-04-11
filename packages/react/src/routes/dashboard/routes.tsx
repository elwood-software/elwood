import {lazy, Suspense} from 'react';
import {type RouteObject} from 'react-router-dom';
import {MainLayout} from '@/components/layouts/main';
import {PageLayout} from '@/components/layouts/page';
import {useProviderContext} from '@/hooks/use-provider-context';

const Home = lazy(() => import('./home'));

const NodeLayout = lazy(() => import('./node/layout'));
const Tree = lazy(() => import('./node/tree'));
const Blob = lazy(() => import('./node/blob'));
const Create = lazy(() => import('./node/new'));
const Bookmarks = lazy(() => import('./bookmarks'));
const Notifications = lazy(() => import('./notifications'));

const mainFallback = <MainFallback />;
const fallback = <PageLayout loading />;

export const dashboardRoutes: RouteObject[] = [
  {
    path: '/',
    children: [
      {
        path: '/',
        index: true,
        element: (
          <Suspense fallback={mainFallback}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: '/bookmarks',
        element: (
          <Suspense fallback={mainFallback}>
            <Bookmarks />
          </Suspense>
        ),
      },
      {
        path: '/notifications',
        element: (
          <Suspense fallback={mainFallback}>
            <Notifications />
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
        ],
      },
    ],
  },
];

function MainFallback(): JSX.Element {
  const {workspaceName} = useProviderContext();
  return <MainLayout title={workspaceName} loading />;
}
