import { type ReactNode } from "react";
import { Settings, Zap, Home } from "lucide-react";

import { Link } from "./link.js";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "#/components/ui/sidebar.js";
import { useSettings } from "#/hooks/use-settings.js";

import { AppSidebarUser } from "./app-sidebar-user.js";

export type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  section?: string;
  sidebarContent?: ReactNode;
};

export function AppSidebar(props: AppSidebarProps) {
  const { sidebarContent, ...sidebarProps } = props;
  const { Logo, sideBarNav = [] } = useSettings();

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row"
      {...sidebarProps}
    >
      <Sidebar
        collapsible="none"
        className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <Link href="/">
                  <Logo />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {sideBarNav.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      className="px-2.5 md:px-2"
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <AppSidebarUser />
        </SidebarFooter>
      </Sidebar>
      {sidebarContent && (
        <Sidebar
          collapsible="none"
          className="hidden flex-1 md:flex bg-background no-scrollbar"
        >
          <SidebarContent>{sidebarContent}</SidebarContent>
          <SidebarRail />
        </Sidebar>
      )}
    </Sidebar>
  );
}
