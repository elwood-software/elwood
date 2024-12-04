import { PropsWithChildren, Suspense } from "react";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@elwood/ui";

import { Layout } from "#/components/layout.js";
import { NavItem } from "#/constants.js";
import { Link } from "#/components/link.js";
import { Breadcrumbs } from "#/components/breadcrumbs.js";

export default function Lazy(props: PropsWithChildren) {
  return (
    <Suspense fallback={<Layout loading />}>
      <TreeLayout>{props.children}</TreeLayout>
    </Suspense>
  );
}

export function TreeLayout(props: PropsWithChildren) {
  const header = (
    <Breadcrumbs
      items={[
        {
          href: "/",
          children: "Home",
        },
        {
          children: "Home",
        },
      ]}
    />
  );

  return (
    <Layout activeNav={NavItem.Files} header={header}>
      {props.children}
    </Layout>
  );
}
