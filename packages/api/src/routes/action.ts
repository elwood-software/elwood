import { z } from "zod";

import { publicProcedure } from "../libs/trpc.js";

const schema = z.object({
  path: z.string().optional(),
  bucket: z.string(),
  namespace: z.string(),
  type: z.string(),
  data: z.record(z.string(), z.any()),
});

const route = publicProcedure.input(schema).mutation(async ({ input, ctx }) => {
  const namespace = ctx.namespaces.get(input.namespace)!;
  return await namespace.action(input);
});

export default route;
