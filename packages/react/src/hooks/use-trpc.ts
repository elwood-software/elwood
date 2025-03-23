"use client";

import {
  createTRPCContext,
  type TRPCOptionsProxy,
} from "@trpc/tanstack-react-query";
import type { AnyTRPCRouter } from "@trpc/server";
import type { TRPCClient } from "@trpc/client";

export const { TRPCProvider, ...trpc } = createTRPCContext<AnyTRPCRouter>();

export function useTRPC<
  Router extends AnyTRPCRouter,
>(): TRPCOptionsProxy<Router> {
  return trpc.useTRPC() as TRPCOptionsProxy<Router>;
}

export function useTRPCClient<
  Router extends AnyTRPCRouter,
>(): TRPCClient<Router> {
  return trpc.useTRPCClient();
}
