import type { z, ZodRawShape } from "zod";

import type { NodeTypes } from "./constants.js";

export type JsonScalar = any;
export type JsonObject = Record<string, JsonScalar>;

export type ProviderOptions = JsonObject;

export interface ProviderConstructor<T = Provider> {
  new (id: string, options: ProviderOptions): T;
  name: string;
  optionsSchema: z.ZodObject<ZodRawShape>;
}

export interface Provider {
  readonly id: string;
  readonly options: ProviderOptions;

  initialize(): Promise<this>;
  tree(input: TreeInput): Promise<TreeResult>;
  blob(input: BlobInput): Promise<BlobResult>;
  action(input: ActionInput): Promise<ActionResult>;
}

export type ProviderMap = Map<string, Provider>;

export type TreeInput = {
  bucket?: string;
  path?: string;
  cursor?: TreeResult["cursor"];
};

export type TreeResult = {
  bucket?: BucketNode;
  nodes: Node[];
  cursor?: Record<string, string | undefined>;
};

export type BlobInput = {
  bucket: string;
  path: string;
};

export type BlobResult = {
  node: BlobNode;
  actions: Action[];
  versions: BlobVersion[];
  notices: Notice[];
};

export type Node =
  | { type: NodeTypes; id: string; name: string }
  | BucketNode
  | TreeNode
  | BlobNode;

export interface BucketNode {
  type: "BUCKET";
  id: string;
  name: string;
  path: string;
}

export interface TreeNode {
  type: "TREE";
  id: string;
  path: string;
  name: string;
}

export interface BlobNode {
  type: "BLOB";
  id: string;
  path: string;
  name: string;
  size: number | undefined;
  isHidden: boolean;
  metadata: BlobNodeMetadata;
  labels?: BlobLabel[];
}

export interface BlobLabel {
  variant?: "" | string;
  name: string;
  text: string;
}

export interface BlobNodeMetadata {
  [index: string]: string | number | undefined;
  size?: number;
  contentType?: string;
}

export type ActionType = "delete" | "copy" | "download" | string;

export type Notice = {
  variant?: string;
  title: string;
  description?: string;
  inProgress?: boolean;
};

export type Action = {
  type: ActionType;
  label: string;
  attr?: Record<string, any>;
  form?: ActionFormField[];
};

export type ActionFormField = {
  type: string;
  name: string;
  defaultValue?: string;
  label: string;
  help?: string;
  required?: boolean;
  options?: Array<{ name: string; value: string }>;
};

export type BlobVersion = {
  id: string;
};

export type ActionInput = {
  namespace: string;
  bucket?: string;
  path?: string;
  type: ActionType;
  data: JsonObject;
};

export type ActionResult = {
  success: boolean;
  data: JsonObject;
};
