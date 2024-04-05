import {useState} from 'react';
import * as Primitive from '@radix-ui/react-dialog';
import {clsx} from 'clsx';
import {Icons} from '../../svg/icons';

export interface DialogPropsFnArgs {
  isOpen: boolean;
  close: () => void;
  open: () => void;
}

export interface DialogProps extends Omit<Primitive.DialogProps, 'children'> {
  title?: string;
  description?: string;
  content: JSX.Element | ((args: DialogPropsFnArgs) => JSX.Element);
  children?: JSX.Element | ((args: DialogPropsFnArgs) => JSX.Element);
  className?: string;
}

export function Dialog(props: DialogProps): JSX.Element {
  const [open, setOpen] = useState<boolean>(Boolean(props.defaultOpen));
  const contentClassName = clsx(
    props.className,
    !props.className?.includes('max-w') && 'max-w-[450px]',

    [
      'data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] translate-x-[-50%] translate-y-[-50%]',
      'rounded-[6px] bg-sidebar border',
      'focus:outline-none',
      'p-6',
    ],
  );

  function onChange(value: boolean): void {
    setOpen(value);
    props.onOpenChange && props.onOpenChange(value);
  }

  const fnArgs: DialogPropsFnArgs = {
    isOpen: open,
    close: () => {
      setOpen(false);
    },
    open: () => {
      setOpen(true);
    },
  };

  return (
    <Primitive.Root open={open} onOpenChange={onChange}>
      {props.children && typeof props.children !== 'function' ? (
        <Primitive.Trigger asChild>{props.children}</Primitive.Trigger>
      ) : null}
      {props.children && typeof props.children === 'function'
        ? props.children(fnArgs)
        : null}
      <Primitive.Portal>
        <Primitive.Overlay className="bg-black/50 backdrop-blur-md data-[state=open]:animate-overlayShow fixed inset-0" />
        <Primitive.Content className={contentClassName}>
          <header className={props.title ?? props.description ? 'mb-6' : ''}>
            {props.title ? (
              <Primitive.Title className="text-foreground m-0 text-xl font-medium">
                {props.title}
              </Primitive.Title>
            ) : null}
            {props.description ? (
              <Primitive.Description className="text-foreground/75 mt-1.5 mb-6 leading-normal text-sm">
                {props.description}
              </Primitive.Description>
            ) : null}
          </header>

          {typeof props.content === 'function'
            ? props.content(fnArgs)
            : props.content}

          <Primitive.Close asChild>
            <button
              type="button"
              className="absolute top-3 right-3 inline-flex h-6 w-6 appearance-none items-center justify-center text-muted"
              aria-label="Close">
              <Icons.Close />
            </button>
          </Primitive.Close>
        </Primitive.Content>
      </Primitive.Portal>
    </Primitive.Root>
  );
}
