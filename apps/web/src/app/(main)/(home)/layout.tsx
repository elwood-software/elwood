import { PropsWithChildren } from "react";

import { AppLayout } from "@elwood/react";

export default function Layout(props: PropsWithChildren) {
  return <AppLayout defaultOpen={false}>{props.children}</AppLayout>;
}
