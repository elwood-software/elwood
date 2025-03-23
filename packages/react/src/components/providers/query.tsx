"use client";

import { type PropsWithChildren, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { TRPCProvider } from "#/hooks/use-trpc";
import { createClient } from "#/lib/trpc.js";
import { useSupabaseClient } from "#/hooks/use-supabase.js";
import { useSettings } from "#/hooks/use-settings";

export function QueryProvider(props: PropsWithChildren) {
  const supabaseClient = useSupabaseClient();
  const settings = useSettings();
  const [queryClient] = useState(new QueryClient());
  const [trpcClient] = useState(() =>
    createClient(settings.apiBaseUrl, async () => {
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
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}
