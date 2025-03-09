import { useQuery } from "@tanstack/react-query";
import { Inputs, Outputs, useTRPC } from "./use-trpc";

export type TreeNode = Outputs["tree"]["get"]["nodes"][0];

export function useTree(input: Inputs["tree"]["get"]) {
  const trpc = useTRPC();

  return useQuery(trpc.tree.get.queryOptions(input));
}
