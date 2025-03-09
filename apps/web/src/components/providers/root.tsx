"use client";

import { PropsWithChildren } from "react";

import { QueryProvider } from "./query";
import { ThemeProvider } from "./theme";

export function RootProvider(props: PropsWithChildren) {
  return (
    <ThemeProvider>
      <QueryProvider>{props.children}</QueryProvider>
    </ThemeProvider>
  );
}
