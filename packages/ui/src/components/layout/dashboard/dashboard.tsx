import type { PropsWithChildren } from "react";

import { Separator } from "#/components/ui/separator.js";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "#/components/ui/sidebar.js";

export type DashboardLayoutProps = PropsWithChildren<{
  nav: React.ComponentProps<typeof SidebarMenuButton>[];
  userMenu?: React.ReactNode;
  orgMenu?: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  defaultOpen?: boolean;
}>;

export function DashboardLayout(props: DashboardLayoutProps) {
  return (
    <div className="w-screen h-full min-h-screen fixed inset-0">
      <SidebarProvider
        defaultOpen={props.defaultOpen}
        style={
          {
            "--sidebar-width": "350px",
          } as React.CSSProperties
        }
      >
        <Sidebar
          collapsible="icon"
          className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row"
          {...props}
        >
          <Sidebar
            collapsible="none"
            className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r"
          >
            {props.orgMenu && (
              <SidebarHeader>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      size="lg"
                      asChild
                      className="md:h-8 md:p-0"
                    >
                      {props.orgMenu}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarHeader>
            )}
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent className="px-1.5 md:px-0">
                  <SidebarMenu>
                    {props.nav.map(({ key, ...item }) => (
                      <SidebarMenuItem key={key}>
                        <SidebarMenuButton {...item} />
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            {props.userMenu && <SidebarFooter>{props.userMenu}</SidebarFooter>}
          </Sidebar>
          {props.sidebar}
        </Sidebar>
        <SidebarInset>
          {props.header && (
            <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              {props.header}
            </header>
          )}
          <div className="flex-grow">{props.children}</div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
