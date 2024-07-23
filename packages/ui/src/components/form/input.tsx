import clsx from 'clsx';
import {forwardRef} from 'react';
import type {ElementRef, JSXElementConstructor, ForwardedRef} from 'react';

type BaseInputElement = ElementRef<'input'>;

export type InputRef = ForwardedRef<BaseInputElement>;
export type InputProps = JSX.IntrinsicElements['input'] & {
  ring?: boolean;
  as?: JSXElementConstructor<JSX.IntrinsicElements['input']>;
};

export const Input = forwardRef<BaseInputElement, InputProps>(
  function Input(props, forwardedRef): JSX.Element {
    const Element = props.as ?? 'input';
    const ring = props.ring ?? true;

    const cn = clsx(
      props.className,
      'flex w-full rounded-md bg-background px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
      ring && 'border border-input',
      props.className,
    );

    return <Element {...props} className={cn} ref={forwardedRef} />;
  },
);
