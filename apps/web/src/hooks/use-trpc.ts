import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "@elwood/api";
import { useTRPC as useRootTRPC } from "@elwood/react";

export type Inputs = inferRouterInputs<AppRouter>;
export type Outputs = inferRouterOutputs<AppRouter>;

export function useTRPC() {
  return useRootTRPC<AppRouter>();
}
