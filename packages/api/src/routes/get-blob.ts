import { z } from "zod";

import { publicProcedure } from "../libs/trpc.js";

const schema = z.object({
  path: z.string().default(""),
  bucket: z.string(),
  namespace: z.string(),
});

const route = publicProcedure.input(schema).query(async ({ input, ctx }) => {
  const namespace = ctx.namespaces.get(input.namespace)!;

  const result = await namespace.blob({
    bucket: input.bucket,
    path: input.path,
  });

  return {
    ...result,
  };
});

export default route;
