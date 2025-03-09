import type { PropsWithChildren } from "react";

import { AppLayout } from "#/components/app-layout";

export type LayoutProps = {
  params: Promise<{ namespace: string; bucket: string }>;
};

export default async function Layout(props: PropsWithChildren<LayoutProps>) {
  return <AppLayout defaultOpen={false}>{props.children}</AppLayout>;
}
