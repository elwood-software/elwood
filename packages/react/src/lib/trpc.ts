"use client";

import { createTRPCClient, httpBatchLink, HTTPHeaders } from "@trpc/client";

export function createClient(
  apiBaseUrl: string,
  headers: () => Promise<HTTPHeaders>,
) {
  if (!apiBaseUrl) {
    throw new Error(`Missing apiBaseUrl to TRPC context`);
  }

  return createTRPCClient<any>({
    links: [
      httpBatchLink({
        url: apiBaseUrl,
        headers,
      }),
    ],
  });
}
