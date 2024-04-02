import * as Primitive from '@radix-ui/react-progress';
import clsx from 'clsx';

export interface ProgressProps {
  value: number;
  className?: string;
}

export function Progress(props: ProgressProps): JSX.Element {
  const {value = 0} = props;
  const cn = clsx(props.className, 'relative overflow-hidden');

  return (
    <Primitive.Root
      className={cn}
      style={{
        transform: 'translateZ(0)',
      }}
      value={value}>
      <Primitive.Indicator
        className="bg-foreground w-full h-full transition-transform duration-[660ms] ease-[cubic-bezier(0.65, 0, 0.35, 1)]"
        style={{transform: `translateX(-${100 - value}%)`}}
      />
    </Primitive.Root>
  );
}
