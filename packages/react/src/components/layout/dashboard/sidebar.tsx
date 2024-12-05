import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@elwood/ui";

export type DashboardLayoutSidebarProps = React.ComponentProps<
  typeof Sidebar
> & {
  header?: React.ReactNode;
  footer?: React.ReactNode;
};

export function DashboardLayoutSidebar(props: DashboardLayoutSidebarProps) {
  return (
    <Sidebar collapsible="none" className="hidden flex-1 md:flex">
      {props.header && (
        <SidebarHeader className="gap-3.5 border-b p-4">
          {props.header}
        </SidebarHeader>
      )}
      <SidebarContent>{props.children}</SidebarContent>
      {props.footer && (
        <SidebarFooter className="gap-3.5 border-b p-4">
          {props.footer}
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
