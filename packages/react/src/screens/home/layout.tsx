import { type PropsWithChildren } from "react";

import { Layout } from "#/components/layout.js";
import { NavItem } from "#/constants.js";

export default function HomeLayout(props: PropsWithChildren) {
  return (
    <Layout defaultOpen={false} activeNav={NavItem.Home}>
      {props.children}
    </Layout>
  );
}
