"use client";

import { PropsWithChildren, useState } from "react";
import Link from "next/link";

import { RootProvider } from "@elwood/react";

import { createClient } from "#/lib/supabase/client";

export function Provider(props: PropsWithChildren) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_ELWOOD_API_BASE_URL!;
  const [supabaseClient] = useState(() => createClient());

  return (
    <RootProvider
      supabaseClient={supabaseClient}
      apiBaseUrl={apiBaseUrl}
      linkProvider={Link}
    >
      {props.children}
    </RootProvider>
  );
}
