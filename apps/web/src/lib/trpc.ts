"use client";

import { createTRPCContext } from "@trpc/tanstack-react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";

import type { AppRouter } from "@elwood/api/app-router";

export const { TRPCProvider, useTRPC, useTRPCClient } =
  createTRPCContext<AppRouter>();

export function createClient() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_ELWOOD_API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error(`Missing NEXT_PUBLIC_ELWOOD_API_BASE_URL`);
  }

  return createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: apiBaseUrl,
      }),
    ],
  });
}
