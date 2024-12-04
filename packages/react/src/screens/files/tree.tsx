import { Suspense } from "react";

import { Card } from "@elwood/ui";

import { Link } from "#/components/link.js";

export default function Lazy() {
  return (
    <Suspense fallback={<div>loading</div>}>
      <TreeScreen />
    </Suspense>
  );
}

export function TreeScreen() {
  return (
    <div className="p-4">
      <h1>Tree</h1>
      tree
      <Link href="/">Home</Link>
      <Card>a</Card>
    </div>
  );
}
