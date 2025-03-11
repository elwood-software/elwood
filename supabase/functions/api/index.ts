import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { fetchRequestHandler } from "npm:@trpc/server@11.0.0-rc.824/adapters/fetch";
import {
  appRouter,
  loadConfig,
  createContext,
  createInnerContext,
} from "npm:@elwood/api";

Deno.serve(function handler(request: Request) {
  if (request.method === "HEAD") {
    return new Response();
  }

  return fetchRequestHandler({
    endpoint: "/api",
    req: request,
    router: appRouter,
    createContext: () => ({}),
  });
});
