import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "@elwood/api/app-router";

export type { Action } from "@elwood/api/app-router";

export type Inputs = inferRouterInputs<AppRouter>;
export type Outputs = inferRouterOutputs<AppRouter>;

export { useTRPC, useTRPCClient } from "#/lib/trpc";
