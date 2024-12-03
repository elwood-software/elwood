import * as RR from "react-router";

export function Router() {
  return <div>poop</div>

export function BrowserRouter() {
  return (
    <RR.BrowserRouter>
      <Router />
    </RR.BrowserRouter>
  );
}