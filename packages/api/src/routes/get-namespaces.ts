import { z } from "zod";

import { publicProcedure } from "../libs/trpc.js";

const schema = z.object({}).optional();

const route = publicProcedure.input(schema).query(async ({ input, ctx }) => {
  return Array.from(ctx.namespaces.values()).map((item) => {
    return {
      name: item.name,
      displayName: item.displayName,
    };
  });
});

export default route;
