import { PropsWithChildren } from "react";

import { AppLayout } from "#/components/app-layout";

export default function Layout(props: PropsWithChildren) {
  return <AppLayout defaultOpen={false}>{props.children}</AppLayout>;
}
