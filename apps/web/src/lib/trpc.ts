"use client";

import { createTRPCContext } from "@trpc/tanstack-react-query";
import { createTRPCClient, httpBatchLink, HTTPHeaders } from "@trpc/client";

import type { AppRouter } from "@elwood/api";

export const { TRPCProvider, useTRPC, useTRPCClient } =
  createTRPCContext<AppRouter>();

export function createClient(headers: () => Promise<HTTPHeaders>) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_ELWOOD_API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error(`Missing NEXT_PUBLIC_ELWOOD_API_BASE_URL`);
  }

  return createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: apiBaseUrl,
        headers,
      }),
    ],
  });
}
