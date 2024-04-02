import {useState, type FormEvent} from 'react';
import {Button, type ButtonProps, type ButtonButtonProps} from '@elwood/ui';
import {type GetNodeResult} from '@elwood/common';
import {CreateFolderDialog} from '@/components/files/create-folder-dialog';
import {useCreateNode} from '@/data/node/use-create-node';

export interface UseCreateFolderButtonInput
  extends Omit<ButtonProps, 'prefix' | 'href' | 'onClick' | 'type' | 'ref'> {
  prefix: string[];
}

export function useCreateFolderButton(
  input: UseCreateFolderButtonInput,
): JSX.Element {
  const {prefix, children = 'Create Folder', ...buttonProps} = input;
  const [isLoading, setIsLoading] = useState(false);
  const action = useCreateNode();
  const [createdNodes, setCreatedNodes] = useState<GetNodeResult[]>([]);
  const [value, setValue] = useState('');

  async function onSubmit(e: FormEvent): Promise<void> {
    e.preventDefault();
    setIsLoading(true);

    try {
      const _result = await action.mutateAsync({
        prefix,
        name: value,
        type: 'TREE',
      });

      setCreatedNodes([...createdNodes, _result]);
      setValue('');
    } finally {
      setIsLoading(false);
    }
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
        {...(buttonProps as ButtonButtonProps)}
        loading={isLoading}
        type="button">
        {children}
      </Button>
    </CreateFolderDialog>
  );
}
