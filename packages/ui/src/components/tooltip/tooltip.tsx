import * as Primitive from '@radix-ui/react-tooltip';
import type {PropsWithChildren, ReactNode} from 'react';

export interface TooltipProps {
  label: ReactNode;
}

export function Tooltip(props: PropsWithChildren<TooltipProps>): JSX.Element {
  return (
    <Primitive.Root>
      <Primitive.Trigger asChild>{props.children}</Primitive.Trigger>
      <Primitive.Portal>
        <Primitive.Content
          className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade select-none leading-none will-change-[transform,opacity] z-50"
          sideOffset={5}>
          <div className="bg-foreground/90 text-background text-sm px-3 py-1 rounded-md">
            {props.label}
          </div>
          <Primitive.Arrow className="fill-foreground/90" />
        </Primitive.Content>
      </Primitive.Portal>
    </Primitive.Root>
  );
}
