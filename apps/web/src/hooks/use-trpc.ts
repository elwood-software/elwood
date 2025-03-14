import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "@elwood/api";

export type { Action } from "@elwood/api";

export type Inputs = inferRouterInputs<AppRouter>;
export type Outputs = inferRouterOutputs<AppRouter>;

export { useTRPC, useTRPCClient } from "#/lib/trpc";
