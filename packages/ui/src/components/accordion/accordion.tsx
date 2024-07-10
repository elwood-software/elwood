import React, {useState} from 'react';
import * as Primitive from '@radix-ui/react-accordion';
import {AccordionContent} from './content';
import {AccordionItem} from './item';
import {AccordionTrigger} from './trigger';

export interface AccordionPropsItem {
  id: string;
  label: JSX.Element | ((open: boolean) => JSX.Element);
  content: JSX.Element | ((open: boolean) => JSX.Element);
  open: boolean;
  arrow?: boolean;
}

export interface AccordionProps {
  items: AccordionPropsItem[];
  className?: string;
  itemClassName?: string;
  contentClassName?: string;
  triggerClassName?: string;
}

export function Accordion(props: AccordionProps): JSX.Element {
  const [value, setValue] = useState(
    props.items.filter(item => item.open).map(item => item.id),
  );

  return (
    <Primitive.Root
      className={props.className}
      value={value}
      onValueChange={setValue}
      type="multiple">
      {props.items.map(item => {
        return (
          <AccordionItem
            key={`AccordionItem-${item.id}`}
            value={item.id}
            className={props.itemClassName}>
            <AccordionTrigger className={props.triggerClassName}>
              {typeof item.label === 'function'
                ? item.label(value.includes(item.id))
                : item.label}
            </AccordionTrigger>
            <AccordionContent className={props.contentClassName}>
              {typeof item.content === 'function'
                ? item.content(value.includes(item.id))
                : item.content}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Primitive.Root>
  );
}
