import { type PropsWithChildren } from "react";

import { Layout } from "#/components/layout.js";
import { NavItem } from "#/constants.js";

import { Breadcrumbs } from "#/components/breadcrumbs.js";

export default function TreeLayout(props: PropsWithChildren) {
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
