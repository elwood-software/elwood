import {clsx} from 'clsx';
import {type LabelHTMLAttributes} from 'react';

export type FormLabelProps = LabelHTMLAttributes<HTMLLabelElement> & {};

export function FormLabel(props: FormLabelProps): JSX.Element {
  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control -- intended
    <label
      {...props}
      className={clsx(
        props.className,
        'text-foreground font-bold text-sm leading-none',
      )}
    />
  );
}
