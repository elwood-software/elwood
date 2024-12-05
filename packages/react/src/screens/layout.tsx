import { type ComponentProps } from "react";

import { Icon, Loading, Skeleton } from "@elwood/ui";

import {
  DashboardLayout,
  type DashboardLayoutProps,
} from "#/components/layout/dashboard/index.js";
import { NavItem } from "#/constants.js";
import { Link } from "../components/link.js";

export type LayoutProps = Omit<DashboardLayoutProps, "nav"> & {
  loading?: boolean;
  activeNav?: NavItem;
};

const nav: ComponentProps<typeof DashboardLayout>["nav"] = [
  {
    key: NavItem.Home,
    isActive: false,
    asChild: true,
    children: (
      <Link href="/">
        <Icon.Home className="w-20" />
      </Link>
    ),
  },
  {
    key: NavItem.Files,
    isActive: false,
    asChild: true,
    children: (
      <Link href="/buckets">
        <Icon.Folder />
      </Link>
    ),
  },
  {
    key: NavItem.Actions,
    isActive: false,
    asChild: true,
    children: (
      <Link href="/actions">
        <Icon.Zap />
      </Link>
    ),
  },
  {
    key: NavItem.Settings,
    isActive: false,
    asChild: true,
    children: (
      <Link href="/settings">
        <Icon.Settings />
      </Link>
    ),
  },
];

export function Layout(props: LayoutProps): JSX.Element {
  const {
    header,
    sidebar,
    loading = false,
    activeNav,
    defaultOpen = true,
  } = props;
  const nav_ = nav.map((item) => ({
    ...item,
    isActive: item.key === activeNav,
  }));

  const orgMenu = (
    <Link href="/">
      <div className="flex aspect-square size-8 items-center justify-center rounded-xs bg-sidebar-primary text-sidebar-primary-foreground">
        P
      </div>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">Acme Inc</span>
        <span className="truncate text-xs">Enterprise</span>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <DashboardLayout
        defaultOpen={defaultOpen}
        nav={nav_}
        orgMenu={orgMenu}
        header={<Skeleton className="h-4 bg-muted w-20" />}
      >
        <Loading className="m-4" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      defaultOpen={defaultOpen}
      orgMenu={orgMenu}
      nav={nav_}
      header={header}
      sidebar={sidebar}
    >
      {props.children}
    </DashboardLayout>
  );
}
