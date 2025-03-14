import { z } from "zod";

import { publicProcedure } from "../libs/trpc.js";

const schema = z.object({
  path: z.string().default("").optional(),
  bucket: z.string().optional(),
  namespace: z.string(),
  cursor: z.string().optional(),
});

const route = publicProcedure.input(schema).query(async ({ input, ctx }) => {
  const namespace = ctx.namespaces.get(input.namespace)!;

  const inputCursor = input.cursor
    ? Buffer.from(input.cursor, "base64url").toJSON()
    : {};

  const result = await namespace.tree({
    bucket: input.bucket,
    path: input.path,
    cursor: inputCursor,
  });

  return {
    ...result,
    cursor: {
      next: Buffer.from(JSON.stringify(result.cursor ?? {})).toString(
        "base64url",
      ),
      previous: input.cursor,
    },
  };
});

export default route;
