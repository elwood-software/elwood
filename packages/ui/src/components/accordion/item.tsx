import {forwardRef} from 'react';
import * as Primitive from '@radix-ui/react-accordion';
import {clsx} from 'clsx';

export type AccordionItemProps = React.ComponentProps<typeof Primitive.Item>;

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({children, className, ...props}, forwardedRef) => (
    <Primitive.Item
      className={clsx(
        'overflow-hidden focus-within:relative focus-within:z-10',
        className,
      )}
      {...props}
      ref={forwardedRef}>
      {children}
    </Primitive.Item>
  ),
);

AccordionItem.displayName = 'AccordionItem';
