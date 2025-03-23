"use client";

import { use } from "react";

import { AppLayout } from "@elwood/react";
import { useTree } from "#/hooks/use-tree";
import { NodeTable } from "#/components/node-table/node-table";
import { BlobNode } from "@elwood/api";

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
        data={(data?.nodes ?? []).map((item) => {
          return {
            type: item.type,
            name: item.name,
            href: `/${namespace}/${(item as BlobNode).path}/tree`,
          };
        })}
        className="m-8"
      />
    </AppLayout>
  );
}
