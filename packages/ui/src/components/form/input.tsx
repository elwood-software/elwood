import clsx from 'clsx';
import {forwardRef} from 'react';
import type {ElementRef, JSXElementConstructor, ForwardedRef} from 'react';

type BaseInputElement = ElementRef<'input'>;

export type InputRef = ForwardedRef<BaseInputElement>;
export type InputProps = JSX.IntrinsicElements['input'] & {
  as?: JSXElementConstructor<JSX.IntrinsicElements['input']>;
};

export const Input = forwardRef<BaseInputElement, InputProps>(
  function Input(props, forwardedRef): JSX.Element {
    const Element = props.as ?? 'input';

    const cn = clsx(
      props.className,
      'bg-background border text-foreground px-6 py-3 rounded-lg w-full ring-0 outline-none focus:border-foreground',
    );

    return <Element {...props} className={cn} ref={forwardedRef} />;
  },
);
