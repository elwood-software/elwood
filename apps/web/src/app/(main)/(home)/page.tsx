"use client";

import { useNamespaces } from "#/hooks/use-namespaces";
import { NodeTable } from "#/components/node-table/node-table";
import { ErrorNotice } from "#/components/error";

export default function Page() {
  const { data, error } = useNamespaces({});

  if (error) {
    return (
      <ErrorNotice className="m-8">Unable to load namespaces.</ErrorNotice>
    );
  }

  return (
    <NodeTable
      className="m-8"
      data={
        data?.map((item) => {
          return {
            type: "NAMESPACE",
            name: item.displayName,
            href: `/${item.name}`,
          };
        }) ?? []
      }
    />
  );
}
