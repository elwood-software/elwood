import { type ComponentProps } from "react";

import { DashboardLayout, Icon, Loading, Skeleton } from "@elwood/ui";

import { NavItem } from "#/constants.js";
import { Link } from "./link.js";

export type LayoutProps = Omit<
  ComponentProps<typeof DashboardLayout>,
  "nav"
> & {
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
        <Icon.Home />
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
  const { header, sidebar, loading = false, activeNav } = props;
  const nav_ = nav.map((item) => ({
    ...item,
    isActive: item.key === activeNav,
  }));

  if (loading) {
    return (
      <DashboardLayout
        nav={nav_}
        header={<Skeleton className="h-4 bg-muted w-20" />}
      >
        <Loading className="m-4" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout nav={nav_} header={header} sidebar={sidebar}>
      {props.children}
    </DashboardLayout>
  );
}
