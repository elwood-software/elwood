import { createHash } from "node:crypto";
import type {
  ActionInput,
  ActionResult,
  BlobInput,
  BlobResult,
  Provider,
  TreeInput,
  TreeResult,
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
}
