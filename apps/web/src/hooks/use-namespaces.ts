import { useQuery } from "@tanstack/react-query";

import { Inputs, useTRPC } from "./use-trpc";

export function useNamespaces(input: Inputs["namespaces"]["list"]) {
  const trpc = useTRPC();
  return useQuery(trpc.namespaces.list.queryOptions(input));
}
