import { createHash } from "node:crypto";
import type {
  ActionInput,
  ActionResult,
  BlobInput,
  BlobResult,
  Provider,
  TreeInput,
  TreeResult,
  TreeNode,
} from "../types.js";

export abstract class AbstractProvider implements Provider {
  constructor(
    readonly id: string,
    readonly options: any,
  ) {}

  createBucketId(bucketName: string) {
    return [this.id, bucketName].join("-");
  }

  createNodeId(path: string) {
    return createHash("md5").update(`${this.id}:${path}`).digest("hex");
  }

  async initialize() {
    return this;
  }

  abstract tree(input: TreeInput): Promise<TreeResult>;
  abstract blob(input: BlobInput): Promise<BlobResult>;

  async action(_: ActionInput): Promise<ActionResult> {
    throw new Error("Action is not supported by provider");
  }

  getTreeParentFromPath(path: string | undefined): TreeNode | undefined {
    if (!path) {
      return undefined;
    }

    const parts = path.replace(/^\//, "").replace(/\/$/, "").split("/");

    if (parts.length <= 0) {
      return undefined;
    }

    const _currentPart = parts.pop();
    const lastPart = parts.pop()!;

    return {
      type: "TREE",
      id: [...parts, lastPart].join("-"),
      name: lastPart,
      path: [...parts, lastPart].join("/"),
      isHidden: lastPart.startsWith("."),
    };
  }
}
