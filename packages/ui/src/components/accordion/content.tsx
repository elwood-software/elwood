import {forwardRef} from 'react';
import * as Primitive from '@radix-ui/react-accordion';
import {clsx} from 'clsx';

export type AccordionContentProps = React.ComponentProps<
  typeof Primitive.Content
>;

export const AccordionContent = forwardRef<
  HTMLDivElement,
  AccordionContentProps
>(({children, className, ...props}, forwardedRef) => (
  <Primitive.Content
    className={clsx(
      'data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden',
      className,
    )}
    {...props}
    ref={forwardedRef}>
    {children}
  </Primitive.Content>
));

AccordionContent.displayName = 'AccordionContent';
