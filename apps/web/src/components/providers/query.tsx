"use client";

import { type PropsWithChildren, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import * as trpc from "#/lib/trpc";

export function QueryProvider(props: PropsWithChildren) {
  const [queryClient] = useState(new QueryClient());
  const [trpcClient] = useState(() => trpc.createClient());

  return (
    <QueryClientProvider client={queryClient}>
      <trpc.TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
      </trpc.TRPCProvider>
    </QueryClientProvider>
  );
}
