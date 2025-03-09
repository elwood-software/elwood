export const NodeType = {
  Bucket: "BUCKET",
  Tree: "TREE",
  Blob: "BLOB",
} as const;

export type NodeTypes = (typeof NodeType)[keyof typeof NodeType];
