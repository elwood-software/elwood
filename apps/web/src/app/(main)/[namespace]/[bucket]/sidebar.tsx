"use client";

import Link from "next/link";
import { Archive } from "lucide-react";

import { useTree } from "#/hooks/use-tree";
import { BlobNode } from "@elwood/api";

export type SidebarProps = {
  namespace: string;
};

export function Sidebar(props: SidebarProps) {
  const { data } = useTree({
    namespace: props.namespace,
  });

  return (
    <div className="w-[calc(var(--sidebar-width)-50px)]">
      <ul className="py-8 px-4 space-y-1">
        {data?.nodes.map((item) => {
          return (
            <li key={`sidebar-${props.namespace}-${item.id}`}>
              <Link
                href={`/${props.namespace}/${(item as BlobNode).path}`}
                className="flex gap-2 items-center hover:bg-muted/50 px-2 py-1 rounded-md"
              >
                <Archive className="size-[0.75rem] text-muted-foreground" />
                <span className="truncate text-sm text-muted-foreground">
                  {item.name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
