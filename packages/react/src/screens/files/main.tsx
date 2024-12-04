import { Suspense } from "react";

import { Link } from "#/components/link.js";

export default function Lazy() {
  return (
    <Suspense fallback={<div>loading</div>}>
      <FilesMainScreen />
    </Suspense>
  );
}

export function FilesMainScreen() {
  return (
    <div>
      <h1>Main</h1>
      tree
      <Link href="/">Home</Link>
    </div>
  );
}
