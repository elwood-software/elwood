"use client";

import { use } from "react";

import { useTree } from "#/hooks/use-tree";
import { NodeTable } from "#/components/node-table/node-table";

import { NamespaceHeader } from "../../header";

export type PageProps = {
  params: Promise<{
    namespace: string;
    bucket: string;
    path?: string[];
  }>;
};

export default function Page(props: PageProps) {
  const { namespace, bucket, path } = use(props.params);
  const { isLoading, data } = useTree({
    namespace,
    bucket,
    path: path ? path.join("/") : undefined,
  });

  return (
    <>
      <NamespaceHeader namespace={namespace} bucket={bucket} path={path} />
      <NodeTable
        loading={isLoading}
        namespace={namespace}
        bucket={bucket}
        data={data?.nodes ?? []}
        className="m-8 mt-4"
      />
    </>
  );
}
