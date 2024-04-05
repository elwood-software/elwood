import {Button} from '@elwood/ui';
import {type FormEventHandler, type ReactNode} from 'react';

export interface ChatFooterProps {
  textarea: ReactNode;
  onSubmit: FormEventHandler;
}

export function ChatFooter(props: ChatFooterProps): JSX.Element {
  return (
    <form
      onSubmit={props.onSubmit}
      className="flex items-center border rounded">
      <div className="flex-grow">{props.textarea}</div>
      <Button type="submit" variant="ghost" size="sm">
        Send
      </Button>
    </form>
  );
}
