"use client";

import {
  createContext,
  createElement,
  Fragment,
  ReactNode,
  useContext,
  type ComponentProps,
} from "react";
import type { UrlObject } from "url";
import { LucideIcon } from "lucide-react";

export type LinkProviderProps = ComponentProps<"a"> & {
  href: string | UrlObject;
};

export type SettingsContextValue = {
  Logo: () => ReactNode;
  Link: (props: LinkProviderProps) => React.ReactNode;
  apiBaseUrl: string;
  sideBarNav: Array<{ title: string; url: string; icon: LucideIcon }>;
};

const Context = createContext<SettingsContextValue>({
  Logo: () => createElement(Fragment),
  Link: () => createElement(Fragment),
  apiBaseUrl: "#",
  sideBarNav: [],
});

export const SettingsProvider = Context.Provider;

export function useSettings(): SettingsContextValue {
  const value = useContext(Context);

  if (!value) {
    throw new Error("No Settings Context");
  }

  return value;
}
