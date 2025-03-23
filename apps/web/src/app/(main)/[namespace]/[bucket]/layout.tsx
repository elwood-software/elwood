import type { PropsWithChildren } from "react";

import { AppLayout } from "@elwood/react";

export type LayoutProps = {
  params: Promise<{ namespace: string; bucket: string }>;
};

export default async function Layout(props: PropsWithChildren<LayoutProps>) {
  return <AppLayout defaultOpen={false}>{props.children}</AppLayout>;
}
