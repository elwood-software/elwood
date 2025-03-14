import type {
  ProviderMap,
  TreeInput,
  TreeResult,
  BlobInput,
  BlobResult,
  Provider,
  ActionInput,
  ActionResult,
} from "../types.js";
import type { ConfigurationNamespace } from "./config.js";

export type NamespaceMap = Map<string, Namespace>;

export class Namespace {
  constructor(
    private readonly config: Omit<ConfigurationNamespace, "providers">,
    private readonly providers: ProviderMap,
  ) {}

  get name() {
    return this.config.name;
  }

  get displayName() {
    return this.config.display_name;
  }

  async tree(input: TreeInput): Promise<TreeResult> {
    if (!input.bucket) {
      return {
        nodes: await this.#listAllBuckets(),
        cursor: {},
      };
    }

    const [provider, bucket] = this.#getProviderForBucket(input.bucket!);

    return await provider.tree({
      ...input,
      bucket,
    });
  }

  async blob(input: BlobInput): Promise<BlobResult> {
    const [provider, bucket] = this.#getProviderForBucket(input.bucket!);

    return await provider.blob({
      bucket,
      path: input.path,
    });
  }

  async action(input: ActionInput): Promise<ActionResult> {
    const [provider, bucket] = this.#getProviderForBucket(input.bucket!);

    return await provider.action({
      ...input,
      bucket,
    });
  }

  #getProviderForBucket(bucket: string): [Provider, string] {
    const [providerId, ...name] = bucket.split("-");
    const provider = this.providers.get(providerId!)!;

    return [provider, name.join("-")];
  }

  async #listAllBuckets() {
    const buckets: any[] = [];

    for (const provider of this.providers.values()) {
      const tree = await provider.tree({});
      buckets.push(...tree.nodes);
    }

    return buckets;
  }
}
