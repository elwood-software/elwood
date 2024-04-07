import type {MouseEventHandler, PropsWithChildren} from 'react';
import {Button} from '../button/button';
import * as Primitive from './alert-dialog-base';

export interface AlertDialogProps extends Primitive.AlertDialogProps {
  title: string;
  description: string;
  cancelText?: string;
  actionText?: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export function AlertDialog(
  props: PropsWithChildren<AlertDialogProps>,
): JSX.Element {
  const {
    title,
    description,
    cancelText = 'Cancel',
    actionText = 'Yes',
    children,
    onClick,
    ...primitiveProps
  } = props;

  return (
    <Primitive.AlertDialog {...primitiveProps}>
      <Primitive.AlertDialogTrigger asChild>
        {children}
      </Primitive.AlertDialogTrigger>
      <Primitive.AlertDialogPortal>
        <Primitive.AlertDialogOverlay />
        <Primitive.AlertDialogContent>
          <Primitive.AlertDialogTitle>{title}</Primitive.AlertDialogTitle>
          <Primitive.AlertDialogDescription className="leading-normal">
            {description}
          </Primitive.AlertDialogDescription>
          <Primitive.AlertDialogFooter>
            <Primitive.AlertDialogCancel asChild>
              <Button type="button" variant="secondary">
                {cancelText}
              </Button>
            </Primitive.AlertDialogCancel>
            <Primitive.AlertDialogAction asChild>
              <Button onClick={onClick} type="button" variant="destructive">
                {actionText}
              </Button>
            </Primitive.AlertDialogAction>
          </Primitive.AlertDialogFooter>
        </Primitive.AlertDialogContent>
      </Primitive.AlertDialogPortal>
    </Primitive.AlertDialog>
  );
}
