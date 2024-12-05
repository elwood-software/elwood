import { lazy, PropsWithChildren, Suspense } from "react";
import * as RR from "react-router";

import { Loading } from "@elwood/ui";

import { Layout } from "#/components/layout.js";

const HomeLayout = lazy(() => import("./screens/home/layout.js"));
const HomeScreen = lazy(() => import("./screens/home/home.js"));

const FilesLayout = lazy(() => import("./screens/files/layout.js"));
const FilesMainScreen = lazy(() => import("./screens/files/main.js"));
const TreeScreen = lazy(() => import("./screens/files/tree.js"));
const BlobScreen = lazy(() => import("./screens/files/blob.js"));

const ActionsLayout = lazy(() => import("./screens/actions/layout.js"));

export function Router() {
  return (
    <RR.Routes>
      <RR.Route>
        {/** HOME */}
        <RR.Route
          path="/"
          element={suspend(
            <HomeLayout>
              <RR.Outlet />
            </HomeLayout>,
            true,
          )}
        >
          <RR.Route index path="" element={suspend(<HomeScreen />)} />
        </RR.Route>
        {/** FILES */}
        <RR.Route
          path="/:bucket"
          element={suspend(
            <FilesLayout>
              <RR.Outlet />
            </FilesLayout>,
            true,
          )}
        >
          {/** MAIN */}
          <RR.Route path="" index element={suspend(<FilesMainScreen />)} />

          {/** TREE */}
          <RR.Route path="tree">
            <RR.Route path="*" element={suspend(<TreeScreen />)} />
          </RR.Route>

          {/** BLOB */}
          <RR.Route path="blob">
            <RR.Route path="*" element={suspend(<BlobScreen />)} />
          </RR.Route>
        </RR.Route>

        {/** ACTIONS */}
        <RR.Route
          path="/actions"
          element={suspend(
            <ActionsLayout>
              <RR.Outlet />
            </ActionsLayout>,
          )}
        >
          <RR.Route path="" index element={<div>actions</div>} />
        </RR.Route>

        {/** SETTINGS */}
        <RR.Route path="/settings">
          <RR.Route path="" index element={<div>settings</div>} />
        </RR.Route>
        {/** 404 ERROR */}
        <RR.Route path="*" element={<div>404</div>} />
      </RR.Route>
    </RR.Routes>
  );
}

export function BrowserRouter() {
  return (
    <RR.BrowserRouter>
      <Router />
    </RR.BrowserRouter>
  );
}

export function MemoryRouter() {
  return (
    <RR.MemoryRouter>
      <Router />
    </RR.MemoryRouter>
  );
}

export function HashRouter() {
  return (
    <RR.HashRouter>
      <Router />
    </RR.HashRouter>
  );
}

export function suspend(
  children: PropsWithChildren["children"],
  withLayout = false,
): JSX.Element {
  return (
    <Suspense
      fallback={
        withLayout ? <Layout defaultOpen={false} loading /> : <Loading />
      }
    >
      {children}
    </Suspense>
  );
}
