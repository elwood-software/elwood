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
      className="flex items-center border rounded p-3">
      {props.textarea}
      <button type="submit" className="text-sm font-bold border-l pl-3 ml-3">
        Send
      </button>
    </form>
  );
}
