"use client";

import { createContext, useContext } from "react";

import type { SupabaseClient } from "@supabase/supabase-js";

export type SupabaseClientContextValue = SupabaseClient | null;

const Context = createContext<SupabaseClientContextValue>(null);

export const SupabaseClientProvider = Context.Provider;

export function useSupabaseClient(): SupabaseClient {
  const value = useContext(Context);

  if (!value) {
    throw new Error("No Supabase Client");
  }

  return value;
}

export type { User } from "@supabase/supabase-js";
