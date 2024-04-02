import {forwardRef} from 'react';
import * as Primitive from '@radix-ui/react-accordion';
import {clsx} from 'clsx';
import {ChevronDownIcon} from '../../svg/icons';

export type AccordionTriggerProps = React.ComponentProps<
  typeof Primitive.Trigger
>;

export const AccordionTrigger = forwardRef<
  HTMLButtonElement,
  AccordionTriggerProps
>(({children, className, ...props}, forwardedRef) => (
  <Primitive.Header className="flex">
    <Primitive.Trigger
      className={clsx(
        'group flex flex-1 cursor-default items-center justify-between outline-none',
        className,
      )}
      {...props}
      ref={forwardedRef}>
      {children}
      <ChevronDownIcon
        className="w-4 h-4 text-foreground ease-[cubic-bezier(0.87,_0,_0.13,_1)] transition-transform duration-300 group-data-[state=open]:rotate-180"
        aria-hidden
      />
    </Primitive.Trigger>
  </Primitive.Header>
));

AccordionTrigger.displayName = 'AccordionTrigger';
