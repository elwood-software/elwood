import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { createFetchRequestHandler } from "npm:@elwood/api@0.4.0";

import config from "./elwood-config.ts";

Deno.serve(
  await createFetchRequestHandler({
    endpoint: "/api",
    config,
  }),
);
