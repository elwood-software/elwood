"use client";

import { use } from "react";

import type { TreeNode, BlobNode } from "@elwood/api";

import { useTree } from "#/hooks/use-tree";
import { NodeTable } from "#/components/node-table/node-table";
import { ErrorNotice } from "@elwood/react";
import { NamespaceHeader } from "../../header";
import { Json } from "#/types";

export type PageProps = {
  params: Promise<{
    namespace: string;
    bucket: string;
    path?: string[];
  }>;
};

export default function Page(props: PageProps) {
  const { namespace, bucket, path } = use(props.params);
  const { isLoading, data, error } = useTree({
    namespace,
    bucket,
    path: path ? path.join("/") : undefined,
  });

  if (error) {
    return <ErrorNotice>Unable to load tree.</ErrorNotice>;
  }

  return (
    <>
      <NamespaceHeader namespace={namespace} bucket={bucket} path={path} />
      <NodeTable
        className="m-8 mt-4"
        loading={isLoading}
        parent={(data as Json)?.parent}
        data={(data?.nodes ?? []).map((item_) => {
          const item = item_ as BlobNode | TreeNode;
          return {
            type: item.type,
            name: item.name,
            href: `/${namespace}/${bucket}/${item.type.toLocaleLowerCase()}/${item.path}`,
            labels: (item as BlobNode).labels ?? [],
            size: (item as BlobNode).size,
            isHidden: (item as BlobNode).isHidden,
          };
        })}
      />
    </>
  );
}
