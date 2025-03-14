"use client";

import { type PropsWithChildren, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import * as trpc from "#/lib/trpc";
import { createClient } from "#/lib/supabase/client";

export function QueryProvider(props: PropsWithChildren) {
  const [supabaseClient] = useState(() => createClient());
  const [queryClient] = useState(new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient(async () => {
      const { data } = await supabaseClient.auth.getSession();

      return {
        apikey: data?.session?.access_token,
        Authorization: data?.session?.access_token
          ? `Bearer ${data?.session?.access_token}`
          : undefined,
      };
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <trpc.TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
      </trpc.TRPCProvider>
    </QueryClientProvider>
  );
}
