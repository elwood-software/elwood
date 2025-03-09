import { useQuery } from "@tanstack/react-query";
import { Inputs, useTRPC } from "./use-trpc";

export function useBlob(input: Inputs["blob"]["get"]) {
  const trpc = useTRPC();
  return useQuery(trpc.blob.get.queryOptions(input));
}
