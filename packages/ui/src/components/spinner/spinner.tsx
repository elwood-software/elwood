import {clsx} from 'clsx';
import {Icons} from '../../svg/icons';

export interface SpinnerProps {
  className?: string;
  active?: boolean;
  full?: boolean;
}

export function Spinner(props: SpinnerProps): JSX.Element {
  const cn = clsx(props.className, {
    'animate-spin': props.active !== false,
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
