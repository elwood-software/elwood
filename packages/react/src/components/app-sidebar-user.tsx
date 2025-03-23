"use client";

import { useEffect, useState } from "react";
import { ChevronsUpDown, LogOut, UserCircle } from "lucide-react";

import { Link } from "./link.js";
import { Avatar, AvatarFallback } from "#/components/ui/avatar.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu.js";

import {
  useSidebar,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "#/components/ui/sidebar.js";

import { useSupabaseClient, type User } from "#/hooks/use-supabase.js";

export function AppSidebarUser() {
  const { isMobile } = useSidebar();
  const client = useSupabaseClient();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    client.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });
  }, [client]);

  const { display_name = "" } = user?.user_metadata ?? {};

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground md:h-8 md:p-0"
            >
              <Avatar className="h-8 w-8 rounded-lg flex items-center justify-center">
                {!display_name && <UserCircle className="size-4" />}
                {display_name && (
                  <AvatarFallback className="rounded-lg">
                    {display_name.slice(0, 1)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                {display_name && (
                  <span className="truncate font-semibold">{display_name}</span>
                )}
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-2 py-1.5 text-left text-sm">
                {user?.email}
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/auth/logout" className="flex items-center gap-2">
                <LogOut />
                Log out
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
