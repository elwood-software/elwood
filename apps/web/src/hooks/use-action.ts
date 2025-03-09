import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC, type Outputs, type Inputs } from "./use-trpc";

export type { Action } from "./use-trpc";

export type UseActionInput = Inputs["action"];
export type UseActionResult = Outputs["action"];

export function useAction() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.action.mutationOptions({
      onSuccess(_, vars) {
        queryClient.refetchQueries({
          queryKey: trpc.blob.get.queryKey({
            namespace: vars.namespace,
            bucket: vars.bucket,
            path: vars.path,
          }),
        });
      },
    }),
  );
}
