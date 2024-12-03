import * as RR from "react-router";

import { HomeScreen } from "./screens/home/home.js";

export function Router() {
  return (
    <RR.Routes>
      <RR.Route index path="/" element={<HomeScreen />} />
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
