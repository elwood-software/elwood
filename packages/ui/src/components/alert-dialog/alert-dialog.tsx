import * as Primitive from '@radix-ui/react-alert-dialog';
import {useState} from 'react';
import type {MouseEventHandler, MouseEvent, PropsWithChildren} from 'react';
import {Button} from '../button/button';

export interface AlertDialogProps {
  title: string;
  description: string;
  cancelText?: string;
  actionText?: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  defaultOpen?: boolean;
}

export function AlertDialog(
  props: PropsWithChildren<AlertDialogProps>,
): JSX.Element {
  const {
    title,
    description,
    cancelText = 'Cancel',
    actionText = 'Yes',
    onClick,
    defaultOpen,
  } = props;
  const [open, setOpen] = useState(defaultOpen);

  function _onClick(e: MouseEvent<HTMLButtonElement>): void {
    setOpen(false);
    onClick(e);
  }

  return (
    <Primitive.Root onOpenChange={setOpen} open={open}>
      <Primitive.Trigger asChild>{props.children}</Primitive.Trigger>
      <Primitive.Portal>
        <Primitive.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Primitive.Content className="bg-sidebar shadow-2xl p-6 rounded-lg border-outline border data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] focus:outline-none">
          <Primitive.Title className="font-medium text-xl pb-3">
            {title}
          </Primitive.Title>
          <Primitive.Description className="leading-normal">
            {description}
          </Primitive.Description>
          <div className="flex justify-end gap-3 mt-6">
            <Primitive.Cancel asChild>
              <Button type="button" variant="secondary">
                {cancelText}
              </Button>
            </Primitive.Cancel>
            <Primitive.Action asChild>
              <Button onClick={_onClick} type="button" variant="destructive">
                {actionText}
              </Button>
            </Primitive.Action>
          </div>
        </Primitive.Content>
      </Primitive.Portal>
    </Primitive.Root>
  );
}
