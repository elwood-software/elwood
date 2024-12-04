import { Suspense } from "react";

import { NavItem } from "#/constants.js";
import { Layout } from "#/components/layout.js";
import { Link } from "#/components/link.js";

export default function Lazy() {
  return (
    <Suspense fallback={<Layout loading />}>
      <HomeScreen />
    </Suspense>
  );
}

export function HomeScreen() {
  return (
    <Layout activeNav={NavItem.Home}>
      <div>
        <h1>Home</h1>
        <p>Home page content poop</p>

        <Link href="/poop/tree/ss">tree</Link>
      </div>
    </Layout>
  );
}
