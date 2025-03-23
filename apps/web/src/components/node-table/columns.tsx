"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Folder, File, Archive, BookMarked } from "lucide-react";
import { default as filesize } from "filesize.js";

import type { BlobNode } from "@elwood/api";
import { Badge } from "@elwood/react";

import type { NodeTableData } from "./types";
import { ReactNode } from "react";

export const columns: ColumnDef<NodeTableData>[] = [
  {
    accessorKey: "type",
    header() {
      return <div className="w-4"></div>;
    },
    cell({ row }) {
      const type = row.getValue("type");
      let icon = <File className="size-4 stroke-muted-foreground" />;

      switch (type) {
        case "NAMESPACE": {
          icon = <BookMarked className="size-4 stroke-muted-foreground" />;
          break;
        }

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
    cell: ({ row }) => {
      const name = row.getValue("name") as ReactNode;
      const href = row.getValue("href") as string;

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
        <div className="space-0.5 px-3">
          {labels?.map((item) => <Badge key={item.name}>{item.text}</Badge>)}
        </div>
      );
    },
  },
  {
    accessorKey: "href",
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
