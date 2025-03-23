"use client";

import { PropsWithChildren } from "react";

import {
  SupabaseClientProvider,
  type SupabaseClientContextValue,
} from "#/hooks/use-supabase.js";

import {
  type SettingsContextValue,
  SettingsProvider,
} from "#/hooks/use-settings.js";
import { QueryProvider } from "./query.js";
import { ThemeProvider } from "./theme.js";

export type RootProviderProps = PropsWithChildren<{
  supabaseClient: SupabaseClientContextValue;

  settings: SettingsContextValue;
}>;

export function RootProvider(props: RootProviderProps) {
  return (
    <ThemeProvider>
      <SupabaseClientProvider value={props.supabaseClient}>
        <SettingsProvider value={props.settings}>
          <QueryProvider>{props.children}</QueryProvider>
        </SettingsProvider>
      </SupabaseClientProvider>
    </ThemeProvider>
  );
}
