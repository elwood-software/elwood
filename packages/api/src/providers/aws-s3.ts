import { basename, dirname } from "node:path";
import type AwsS3Sdk from "@aws-sdk/client-s3";
import type AwsPreSign from "@aws-sdk/s3-request-presigner";
import { date, z } from "zod";

import type {
  Action,
  ActionInput,
  BlobInput,
  BlobNode,
  BlobResult,
  Provider,
  TreeInput,
  TreeResult,
} from "../types.js";
import { AbstractProvider } from "./abstract.js";
import { NodeType } from "../constants.js";

const optionsSchema = z.object({
  config: z.record(z.string(), z.any()),
});

type Options = z.infer<typeof optionsSchema>;

export default class AwsS3Provider
  extends AbstractProvider
  implements Provider
{
  #sdk: typeof AwsS3Sdk | undefined = undefined;
  #preSign: typeof AwsPreSign | undefined = undefined;
  #client: AwsS3Sdk.S3 | undefined = undefined;

  static name = "aws-s3";
  static optionsSchema = optionsSchema;

  async initialize() {
    this.#sdk = await import("@aws-sdk/client-s3");
    this.#preSign = await import("@aws-sdk/s3-request-presigner");

    this.#client = new this.#sdk.S3(this.options.config);
    return this;
  }

  get client() {
    return this.#client;
  }

  async tree(input: TreeInput): Promise<TreeResult> {
    const { bucket, path, cursor } = input;

    if (!bucket) {
      const buckets = await this.#client!.listBuckets();

      return {
        nodes:
          buckets.Buckets?.map((item) => {
            return {
              type: NodeType.Bucket,
              id: this.createBucketId(item.Name!),
              name: item.Name!,
              path: this.createBucketId(item.Name!),
            };
          }) ?? [],
      };
    }

    const objects = await this.#client!.listObjectsV2({
      Bucket: bucket,
      Prefix: path ? `${path}/` : undefined,
      Delimiter: "/",
      EncodingType: "url",
      ContinuationToken: cursor?.token,
    });

    return {
      bucket: {
        type: NodeType.Bucket,
        id: this.createBucketId(bucket),
        name: bucket,
        path: "",
      },
      nodes: [
        ...(objects.CommonPrefixes?.map((item) => {
          return {
            type: NodeType.Tree,
            id: this.createNodeId(item.Prefix!),
            name: basename(item.Prefix!),
            path: item.Prefix!,
          };
        }) ?? []),
        ...(objects.Contents?.map((item) => {
          return {
            type: NodeType.Blob,
            id: this.createNodeId(item.Key!),
            name: basename(item.Key!),
            path: item.Key!,
            size: item.Size ?? undefined,
            isHidden: basename(item.Key!).startsWith("."),
            labels: this.getNodeLabels(item),
            metadata: this.getNodeMetadata(item),
          };
        }) ?? []),
      ],
      cursor: {
        token: objects.ContinuationToken,
      },
    };
  }

  async blob(input: BlobInput): Promise<BlobResult> {
    const item = await this.#client!.headObject({
      Bucket: input.bucket,
      Key: input.path,
    });

    return {
      actions: this.getNodeActions(item),
      notices: this.getNodeNotices(item),
      node: {
        type: NodeType.Blob,
        id: this.createNodeId(input.path),
        name: basename(input.path),
        path: input.path,
        size: item.ContentLength ?? undefined,
        isHidden: basename(input.path).startsWith("."),
        metadata: this.getNodeMetadata(item),
        labels: this.getNodeLabels(item),
      },
      versions: [],
    };
  }

  async action(input: ActionInput) {
    switch (input.type) {
      case "restore": {
        const _result = await this.#client!.restoreObject({
          Bucket: input.bucket,
          Key: input.path,
          RestoreRequest: {
            Days: input.data.restoreForDays ?? 7,
            GlacierJobParameters: {
              Tier: input.data.tier ?? "Standard",
            },
          },
        });

        return { success: true, data: {} };
      }
      case "download": {
        const command = new this.#sdk!.GetObjectCommand({
          Bucket: input.bucket!,
          Key: input.path!,
        });

        const signedUrl = await this.#preSign!.getSignedUrl(
          this.#client!,
          command,
          {
            expiresIn: input.data.expiresIn,
          },
        );

        return {
          success: true,
          data: {
            downloadUrl: signedUrl,
          },
        };
      }
    }

    return {
      success: false,
      data: {},
    };
  }

  isObjectArchived(item: AwsS3Sdk._Object): boolean {
    return ["GLACIER_IR", "GLACIER", "DEEP_ARCHIVE"].includes(
      item.StorageClass!,
    );
  }

  isAvailable(item: AwsS3Sdk.HeadObjectCommandOutput) {
    return (
      // not archived
      !this.isObjectArchived(item) ||
      // is archived but there is an expire
      (this.isObjectArchived(item) && this.parseRestoreHeader(item.Restore)[1])
    );
  }

  getNodeLabels(item: AwsS3Sdk._Object) {
    const labels: BlobNode["labels"] = [];

    if (this.isObjectArchived(item)) {
      labels.push({
        name: "archived",
        text: "Archived",
      });
    }

    return labels;
  }

  getNodeMetadata(item: AwsS3Sdk.HeadObjectCommandOutput | AwsS3Sdk._Object) {
    const { Metadata, ContentType } = item as AwsS3Sdk.HeadObjectCommandOutput;

    return {
      ...(Metadata ?? {}),
      etag: item.ETag,
      lastModified: item.LastModified?.toUTCString(),
      storageClass: item.StorageClass,
      contentType: ContentType ?? "application/o",
    };
  }

  getNodeNotices(item: AwsS3Sdk.HeadObjectCommandOutput) {
    const notices: BlobResult["notices"] = [];

    if (item.Restore) {
      const [inProgress, expire] = this.parseRestoreHeader(item.Restore);

      notices.push({
        variant: inProgress ? "info" : "success",
        inProgress,
        title: inProgress ? "Restore in Progress" : "Restore Complete",
        description: inProgress
          ? undefined
          : `Restored file expires on ${expire}`,
      });
    }

    return notices;
  }

  getNodeActions(item: AwsS3Sdk.HeadObjectCommandOutput) {
    const actions: Action[] = [];

    if (this.isAvailable(item)) {
      actions.push({
        type: "download",
        label: "Download",
      });
    }

    if (
      this.isObjectArchived(item) &&
      !this.parseRestoreHeader(item.Restore)[1]
    ) {
      actions.push({
        type: "restore",
        label: "Restore",
        form: [
          {
            name: "restoreForDays",
            type: "number",
            label: "Restore For Days",
            defaultValue: "7",
            help: "The number of days the restored copy remains available",
          },
          {
            name: "tier",
            type: "select",
            label: "Restore Tier",
            defaultValue: "Standard",
            options: [
              { name: "Expedited", value: "Expedited" },
              { name: "Standard", value: "Standard" },
              { name: "Bulk", value: "Bulk" },
            ],
          },
        ],
      });
    }

    return actions;
  }

  parseRestoreHeader(
    header: string | undefined,
  ): [boolean, string | undefined] {
    if (!header) {
      return [false, undefined];
    }

    const ongoing = header.match(/ongoing-request="(true|false)"/);
    const expiry = header.match(/expiry-date="([^"]+)"/);
    return [ongoing?.[1] === "true", expiry?.[1]];
  }
}
