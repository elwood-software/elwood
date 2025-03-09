import { type ReactNode } from "react";
import { FolderOpen, Settings, Zap, Home } from "lucide-react";
import Link from "next/link";

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
} from "#/components/ui/sidebar";

import { AppSidebarUser } from "./app-sidebar-user";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Jobs",
      url: "/jobs",
      icon: Zap,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ],
};

export type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  section?: string;
  sidebarContent?: ReactNode;
};

export function AppSidebar(props: AppSidebarProps) {
  const { sidebarContent, ...sidebarProps } = props;

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
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <FolderOpen className="size-4" />
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {data.navMain.map((item) => (
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
