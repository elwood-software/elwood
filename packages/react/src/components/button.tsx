import {forwardRef, type PropsWithChildren} from 'react';
import type {ButtonProps, ButtonElement} from '@elwood/ui';
import {Button as BaseButton} from '@elwood/ui';
import {Link} from './link';

export const Button = forwardRef<ButtonElement, PropsWithChildren<ButtonProps>>(
  function Button(props: PropsWithChildren<ButtonProps>, forwardedRef) {
    if ('href' in props) {
      return <BaseButton as={Link} ref={forwardedRef} {...props} />;
    }

    return <BaseButton {...props} ref={forwardedRef} />;
  },
);

export {
  type ButtonProps,
  type ButtonButtonProps,
  type ButtonAnchorProps,
} from '@elwood/ui';
