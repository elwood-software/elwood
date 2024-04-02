import {type FormEvent, type FormEventHandler} from 'react';
import {Icons} from '@elwood/ui';
import {Button} from '@/components/button';

export interface CreateFolderFormProps {
  onSubmit: FormEventHandler | ((e: FormEvent) => Promise<void>);
  value?: string;
  onChange: (value: string) => void;
  loading?: boolean;
}

export function CreateFolderForm(props: CreateFolderFormProps): JSX.Element {
  return (
    <form onSubmit={e => props.onSubmit(e)}>
      <div className="bg-background border flex rounded items-center">
        <Icons.Folder className="h-4 w-4 text-muted fill-muted m-2" />
        <input
          placeholder="Untitled Folder"
          className="text-foreground flex-grow bg-transparent outline-none ring-0"
          onChange={e => {
            props.onChange(e.target.value);
          }}
          type="text"
          value={props.value ?? ''}
        />
        <Button variant="link" type="submit" loading={props.loading}>
          Create
        </Button>
      </div>
    </form>
  );
}
