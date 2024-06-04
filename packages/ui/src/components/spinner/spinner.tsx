import {clsx} from 'clsx';
import {Icons} from '../../svg/icons';

export interface SpinnerProps {
  className?: string;
  active?: boolean;
  full?: boolean;
  size?: 'sm' | 'md' | 'lg';
  muted?: boolean;
}

export function Spinner(props: SpinnerProps): JSX.Element {
  const size = props.size ?? 'md';
  const cn = clsx(props.className, {
    'animate-spin': props.active !== false,
    'size-4': size === 'sm',
    'size-6': size === 'md',
    'size-8': size === 'lg',
    'stroke-muted-foreground': props.muted === true,
  });

  if (props.full) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Icons.Loader className={cn} />
      </div>
    );
  }

  return <Icons.Loader className={cn} />;
}
