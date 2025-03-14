import { ReactNode } from "react";

import type { BlobLabel } from "@elwood/api";

export type NodeTableData = {
  href: string;
  type: "BLOB" | "BUCKET" | "TREE" | "NAMESPACE";
  name: ReactNode;
  size?: number;
  labels?: BlobLabel[];
  isHidden?: boolean;
};
