import {forwardRef} from 'react';
import type {
  ButtonHTMLAttributes,
  ElementRef,
  PropsWithChildren,
  JSXElementConstructor,
  ForwardedRef,
} from 'react';
import {clsx} from 'clsx';
import {cva, type VariantProps} from 'class-variance-authority';
import {cn} from '../../lib/utils';
import {Icons} from '../../svg/icons';

type BaseButtonElement = ElementRef<'button'>;
type BaseAnchorButtonElement = ElementRef<'a'>;

export type ButtonElement = BaseButtonElement | BaseAnchorButtonElement;
export type ButtonRef = ForwardedRef<ButtonElement>;

export type ButtonButtonProps = JSX.IntrinsicElements['button'] & {
  type: ButtonHTMLAttributes<BaseButtonElement>['type'];
  href?: never;
};

export type ButtonAnchorProps = JSX.IntrinsicElements['a'] & {
  type?: never;
  href: string;
};

export type ButtonProps = (ButtonButtonProps | ButtonAnchorProps) & {
  icon?: JSX.Element;
  loading?: boolean;
  variant?:
    | 'default'
    | 'brand'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  size?: 'sm' | 'default' | 'lg' | 'icon' | 'icon-sm';
  outline?: boolean;
  rounded?: boolean | 'full';
  as?: JSXElementConstructor<ButtonAnchorProps>;
};

export const buttonVariants = cva(
  'relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        brand: '',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export const Button = forwardRef<
  BaseButtonElement | BaseAnchorButtonElement,
  PropsWithChildren<ButtonProps>
>(function Button(props: PropsWithChildren<ButtonProps>, forwardedRef) {
  const {
    className,
    children,
    rounded = true,
    outline = false,
    variant = 'default',
    size = 'default',
    loading = false,
    as,
    ...nativeProps
  } = props;

  // const variantClass = clsx(
  //   variant === 'primary' && 'text-white bg-primary',
  //   variant === 'secondary' && 'text-foreground/90 bg-secondary',
  //   variant === 'danger' && 'text-white bg-red-800',
  //   variant === 'muted' && 'bg-muted text-white',
  //   variant === 'ghost' && 'text-foreground bg-transparent',
  //   variant === 'outline' && 'text-foreground bg-transparent border',
  // );

  // const roundedClass = clsx(
  //   rounded === true && 'rounded-md',
  //   rounded === 'full' && 'rounded-full',
  // );

  // const cn = clsx(
  //   className,
  //   'inline-flex font-bold text-center justify-center border relative transition-all hover:scale-105',
  //   variantClass,
  //   size === 'sm' && 'px-3 py-1.5 text-xs',
  //   size === 'md' && 'px-6 py-2 text-sm',
  //   size === 'lg' && 'px-8 py-3 text-base',
  //   !outline && 'border-transparent',
  //   outline && variant === 'primary' && 'bg-transparent border-primary',
  //   outline && variant === 'white' && 'bg-transparent border-white',
  //   outline && variant === 'ghost' && 'bg-transparent border',
  //   outline && variant === 'secondary' && 'bg-transparent border-secondary',
  //   roundedClass,
  // );

  const _className = cn(buttonVariants({variant, size, className}));

  const loadingChildrenClass = clsx(loading && 'opacity-0 pointer-events-none');
  const loadingOverlay = loading && (
    <span
      className={clsx(
        'absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center',
      )}>
      <Icons.Loader className="animate-spin p-1 opacity-95" />
    </span>
  );

  if ('href' in props) {
    const Element = as ?? 'a';

    return (
      <Element
        {...(nativeProps as ButtonAnchorProps)}
        className={_className}
        ref={forwardedRef as ForwardedRef<BaseAnchorButtonElement>}>
        {loadingOverlay}
        {props.icon ? (
          <span className="mr-2 flex items-center justify-center">
            {props.icon}
          </span>
        ) : null}
        <span className={loadingChildrenClass}>{props.children}</span>
      </Element>
    );
  }

  return (
    // eslint-disable-next-line react/button-has-type -- intentional
    <button
      {...(nativeProps as ButtonButtonProps)}
      className={_className}
      ref={forwardedRef as ForwardedRef<BaseButtonElement>}>
      {loadingOverlay}
      {props.icon ? (
        <span className="mr-2 flex items-center justify-center">
          {props.icon}
        </span>
      ) : null}
      <span className={loadingChildrenClass}>{children}</span>
    </button>
  );
});
