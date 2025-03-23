import type { ComponentProps, ReactNode } from "react";

import { AppSidebar } from "./app-sidebar.js";
import { SidebarProvider, SidebarInset } from "#/components/ui/sidebar.js";

export type AppLayoutProps = ComponentProps<typeof SidebarProvider> & {
  sidebar?: ReactNode;
  section?: string;
};

export function AppLayout(props: AppLayoutProps) {
  const { sidebar, children, ...sidebarProviderProps } = props;

  return (
    <SidebarProvider
      defaultOpen={false}
      {...sidebarProviderProps}
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }
    >
      <AppSidebar sidebarContent={sidebar} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
