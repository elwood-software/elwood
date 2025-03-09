"use client";

import Link from "next/link";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Folder, File, Archive } from "lucide-react";
import { default as filesize } from "filesize.js";

import { Skeleton } from "#/components/ui/skeleton";
import { cn } from "#/lib/utils";
import type { TreeNode } from "#/hooks/use-tree";

import { BlobNode } from "@elwood/api/src/types";
import { useState } from "react";
import { Badge } from "../ui/badge";

interface DataTableProps<TData> {
  loading?: boolean;
  data: TData[];
  namespace: string;
  bucket?: string;
  className?: string;
}

export const columns: ColumnDef<TreeNode>[] = [
  {
    accessorKey: "type",
    header() {
      return <div className="w-4"></div>;
    },
    cell({ row }) {
      const type = row.getValue("type");
      let icon = <File className="size-4 stroke-muted-foreground" />;

      switch (type) {
        case "BUCKET": {
          icon = <Archive className="size-4 stroke-muted-foreground" />;
          break;
        }

        case "TREE": {
          icon = (
            <Folder className="size-4 fill-muted-foreground stroke-muted-foreground" />
          );
          break;
        }
      }

      return <div className="w-4 pl-4 py-3">{icon}</div>;
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row, table }) => {
      const { namespace, bucket } = table.options.meta as {
        namespace: string;
        bucket?: string;
      };
      const name = row.getValue("name") as string;
      const path = row.getValue("path");
      const type = String(row.getValue("type")!).toLowerCase();

      const href =
        type === "bucket"
          ? `/${namespace}/${path}/tree`
          : `/${namespace}/${bucket}/${type}/${path}`;

      return (
        <div className="p-3 text-sm">
          <Link href={href}>{name}</Link>
        </div>
      );
    },
  },
  {
    accessorKey: "size",
    header() {
      return "Size";
    },
    cell({ row }) {
      const size = row.getValue("size") as number | undefined;
      return (
        <div className="px-3 text-muted-foreground text-xs font-mono">
          {size && filesize(size)}
        </div>
      );
    },
  },
  {
    accessorKey: "labels",
    header() {
      return <>Labels</>;
    },
    cell({ row }) {
      const labels = (row.getValue("labels") ?? []) as BlobNode["labels"];

      return (
        <div className="space-0.5">
          {labels?.map((item) => <Badge key={item.name}>{item.text}</Badge>)}
        </div>
      );
    },
  },
  {
    accessorKey: "path",
    header() {
      return <></>;
    },
    cell() {
      return <></>;
    },
  },

  {
    accessorKey: "isHidden",
    header() {
      return <></>;
    },
    cell() {
      return <></>;
    },
  },
];

export function NodeTable({
  data,
  className,
  namespace,
  bucket,
}: DataTableProps<TreeNode>) {
  const [showHidden, setShowHidden] = useState(false);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: { namespace, bucket },
  });

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
      <footer className="px-3 py-1.5 border-t">
        <button
          onClick={() => handleChangeHidden()}
          className="text-xs text-muted-foreground"
        >
          {showHidden ? "Hide hidden files" : "Show hidden files"}
        </button>
      </footer>
    </div>
  );
}
