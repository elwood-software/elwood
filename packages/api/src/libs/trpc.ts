import { initTRPC } from "@trpc/server";

import { createContext } from "./context.js";

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
