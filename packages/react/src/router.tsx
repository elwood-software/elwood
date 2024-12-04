import { lazy } from "react";
import * as RR from "react-router";

const HomeScreen = lazy(() => import("./screens/home/home.js"));

const FilesLayout = lazy(() => import("./screens/files/layout.js"));
const FilesMainScreen = lazy(() => import("./screens/files/main.js"));
const TreeScreen = lazy(() => import("./screens/files/tree.js"));

export function Router() {
  return (
    <RR.Routes>
      <RR.Route>
        {/** HOME */}
        <RR.Route index path="/" element={<HomeScreen />} />

        {/** FILES */}
        <RR.Route
          path="/:bucket"
          element={
            <FilesLayout>
              <RR.Outlet />
            </FilesLayout>
          }
        >
          {/** MAIN */}
          <RR.Route path="" index element={<FilesMainScreen />} />

          {/** TREE */}
          <RR.Route path="tree">
            <RR.Route path="*" element={<TreeScreen />} />
          </RR.Route>

          {/** BLOB */}
          <RR.Route path="blob">
            <RR.Route index element={<div>blob</div>} />
          </RR.Route>
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
