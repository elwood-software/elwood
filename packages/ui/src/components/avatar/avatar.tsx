import {clsx} from 'clsx';
import type {Variant} from '../../types';
import {AvatarBase, AvatarBaseFallback, AvatarBaseImage} from './avatar-base';

export interface AvatarProps {
  className?: string;
  src?: string;
  fallback: string;
  variant?: Variant;
  size?: 9 | 10 | 12 | 14 | 16;
  round?: boolean;
}

export function Avatar(props: AvatarProps): JSX.Element {
  let fallback =
    props.fallback.length > 2 ? props.fallback.slice(0, 2) : props.fallback;

  if (props.fallback.includes(' ')) {
    fallback = props.fallback
      .split(' ')
      .map(word => word.charAt(0))
      .slice(0, 2)
      .join('');
  }

  const roundClass = clsx({
    'rounded-full': props.round,
  });

  return (
    <AvatarBase className={clsx(roundClass, props.className)}>
      <AvatarBaseImage src={props.src} />
      <AvatarBaseFallback className={clsx(roundClass)}>
        {fallback}
      </AvatarBaseFallback>
    </AvatarBase>
  );
}
