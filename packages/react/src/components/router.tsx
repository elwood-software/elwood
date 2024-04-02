import {RouterProvider} from 'react-router-dom';
import type {Router as RemixRouter} from '@remix-run/router';

export interface RouterProps {
  router: RemixRouter;
}

export function Router(props: RouterProps): JSX.Element {
  return <RouterProvider router={props.router} />;
}

export {
  createBrowserRouter,
  createHashRouter,
  createMemoryRouter,
} from 'react-router-dom';
