"use client";

import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { TreeNode, Node, BlobNode } from "@elwood/api";

import { Skeleton } from "#/components/ui/skeleton";
import { cn } from "#/lib/utils";

import { columns } from "./columns";
import type { NodeTableData } from "./types";

interface DataTableProps<NodeTableData> {
  loading?: boolean;
  data: NodeTableData[];
  className?: string;
  parent?: TreeNode;
}

export function nodeToTableData(
  item: Node,
  prefix: string[] = [],
): NodeTableData {
  return {
    type: item.type,
    name: item.name,
    href: `/${[...prefix, item.type.toLocaleLowerCase(), (item as BlobNode).path!].join("/")}`,
    labels: (item as BlobNode).labels ?? [],
    size: (item as BlobNode).size,
    isHidden: (item as BlobNode).isHidden,
  };
}

export function NodeTable({
  data,
  parent,
  className,
}: DataTableProps<NodeTableData>) {
  const [showHidden, setShowHidden] = useState(false);
  const table = useReactTable({
    data: parent ? [nodeToTableData({ ...parent, name: ".." }), ...data] : data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const hasHidden = !!data.find((item) => item.isHidden);

  function handleChangeHidden(val?: boolean | undefined) {
    setShowHidden(val === undefined ? !showHidden : val);
  }

  return (
    <div className={cn("rounded-md border", className)}>
      <table className="w-full">
        <thead className="border-b bg-muted/25">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    className="px-3 py-2 text-left text-xs text-muted-foreground"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className="w-full">
          {table.getRowModel().rows?.length ? (
            table
              .getRowModel()
              .rows.filter((row) => {
                const isHidden = row.getValue("isHidden") === true;

                if (showHidden === false && isHidden === true) {
                  return false;
                }

                return true;
              })
              .map((row) => (
                <tr
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={row.index === 0 ? "" : "border-t"}
                >
                  {row.getVisibleCells().map((cell, idx) => {
                    return (
                      <td key={cell.id} className={idx === 0 ? "w-4" : ""}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
          ) : (
            <>
              <tr className="border-b">
                <td className="w-4 pl-4">
                  <Skeleton className="h-4 w-4" />
                </td>
                <td className="p-3">
                  <Skeleton className="h-4 w-[200px]" />
                </td>
              </tr>
              <tr className="">
                <td className="w-4 pl-4">
                  <Skeleton className="h-4 w-4" />
                </td>
                <td className="p-3">
                  <Skeleton className="h-4 w-[200px]" />
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>
      {hasHidden && (
        <footer className="px-3 py-1.5 border-t">
          <button
            onClick={() => handleChangeHidden()}
            className="text-xs text-muted-foreground"
          >
            {showHidden ? "Hide hidden files" : "Show hidden files"}
          </button>
        </footer>
      )}
    </div>
  );
}
