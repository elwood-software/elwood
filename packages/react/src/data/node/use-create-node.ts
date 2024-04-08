import type {
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import type {GetNodeResult, NodeRecord} from '@elwood/common';
import {invariant} from '@elwood/common';
import {useClient} from '@/hooks/use-client';
import {getNode} from './use-get-node';
import keys from './_keys';

export type UseCreateNodeResult = GetNodeResult;

export interface UseCreateNodeInputBlob {
  type: 'BLOB';
  blob: string;
}

export interface UseCreateNodeInputTree {
  type: 'TREE';
  blob?: never;
}

export interface UseCreateNodeInputBucket {
  type: 'BUCKET';
  blob?: never;
}

export interface UseCreateNodeInputBase
  extends Partial<Pick<NodeRecord, 'mime_type' | 'size'>> {
  name: string;
  prefix: string[];
}

export type UseCreateNodeInput = UseCreateNodeInputBase &
  (UseCreateNodeInputBlob | UseCreateNodeInputTree | UseCreateNodeInputBucket);

export function useCreateNode(
  opts: Omit<
    UseMutationOptions<UseCreateNodeResult, Error, UseCreateNodeInput>,
    'mutationFn'
  > = {},
): UseMutationResult<UseCreateNodeResult, Error, UseCreateNodeInput> {
  const supabase = useClient();
  const queryClient = useQueryClient();

  return useMutation({
    ...opts,
    mutationFn: async data => {
      return await createNode(supabase, data);
    },
    async onSuccess(data, variables, context) {
      await queryClient.refetchQueries({
        queryKey: keys.get({
          path: variables.prefix,
        }),
      });
      await opts.onSuccess?.(data, variables, context);
    },
  });
}

export async function createNode(
  supabase: ReturnType<typeof useClient>,
  input: UseCreateNodeInput,
): Promise<GetNodeResult> {
  let content: File | string | null = null;
  const [bucket, ...path] = [...input.prefix];
  const getNodePath = input.prefix;

  path.push(input.name);
  getNodePath.push(...input.name.split('/'));

  switch (input.type) {
    case 'TREE': {
      content = ':)';
      path.push('.emptyFolderPlaceholder');
      break;
    }
    case 'BLOB': {
      invariant(input.blob, 'Blob must be set');
      content = input.blob;
      break;
    }
    default: {
      invariant(false, `Invalid type ${input.type}`);
    }
  }

  invariant(content, 'Content must be set');

  const {error} = await supabase.storage
    .from(bucket)
    .upload(path.join('/'), content);

  invariant(!error, error?.message);

  const node = await getNode(supabase, {path: getNodePath});

  invariant(node, 'Node must be set');

  return node;
}
