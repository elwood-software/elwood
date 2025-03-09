"use client";

import { AppLayout } from "#/components/app-layout";
import { useTree } from "#/hooks/use-tree";
import { NodeTable } from "#/components/node-table/node-table";

import Link from "next/link";
import { use } from "react";

export type PageProps = {
  params: Promise<{ namespace: string }>;
};

export default function Page(props: PageProps) {
  const { namespace } = use(props.params);

  const { data } = useTree({
    namespace,
  });

  return (
    <AppLayout defaultOpen={false}>
      <NodeTable
        data={data?.nodes ?? []}
        namespace={namespace}
        bucket="_"
        className="m-8"
      />
    </AppLayout>
  );
}
