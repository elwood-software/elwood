import {useState, type FormEvent} from 'react';
import {
  Button,
  useSonner,
  useSonnerFn,
  type ButtonProps,
  type ButtonButtonProps,
} from '@elwood/ui';
import {invariant, type GetNodeResult} from '@elwood/common';
import {CreateFolderDialog} from '@/components/files/create-folder-dialog';
import {useCreateNode} from '@/data/node/use-create-node';
import {useIsCurrentMemberReadOnly} from '../use-current-member';

export interface UseCreateFolderButtonInput
  extends Omit<ButtonProps, 'prefix' | 'href' | 'onClick' | 'type' | 'ref'> {
  prefix: string[];
  onOpenFolder(path: string): void;
}

export function useCreateFolderButton(
  input: UseCreateFolderButtonInput,
): JSX.Element {
  const {
    prefix,
    children = 'Create Folder',
    onOpenFolder,
    ...buttonProps
  } = input;
  const [isLoading, setIsLoading] = useState(false);
  const action = useCreateNode();
  const [createdNodes, setCreatedNodes] = useState<GetNodeResult[]>([]);
  const [value, setValue] = useState('');
  const toast = useSonnerFn();
  const isReadOnly = useIsCurrentMemberReadOnly();

  async function onSubmit(e: FormEvent): Promise<void> {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await action.mutateAsync({
        prefix: [...prefix],
        name: value,
        type: 'TREE',
      });

      invariant(result.node.prefix);

      let toastId: string | number | null = null;

      setCreatedNodes([...createdNodes, result]);
      setValue('');
      toastId = toast.success(`Folder "${value}" created.`, {
        action: {
          label: 'Open',
          onClick: () => {
            if (toastId) {
              toast.dismiss(toastId);
            }
            onOpenFolder([...result.node.prefix, value].join('/'));
          },
        },
      });
    } catch (e) {
      toast.error('Unable to create folder.', {
        description: (e as Error).message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  // if the member role ends in _RO, don't let them upload
  if (isReadOnly) {
    return <></>;
  }

  return (
    <CreateFolderDialog
      createdFolders={createdNodes}
      loading={isLoading}
      onSubmit={onSubmit}
      onChange={setValue}
      value={value}>
      <Button
        variant="secondary"
        {...(buttonProps as Omit<ButtonButtonProps, 'type'>)}
        loading={isLoading}
        type="button">
        {children}
      </Button>
    </CreateFolderDialog>
  );
}
