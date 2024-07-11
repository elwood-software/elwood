import {CircleAlert, CircleEllipsis, CircleCheck} from '@elwood/ui';
import clsx from 'clsx';
import {type Status, type Result} from '@jsr/elwood__run/types';

export type RunStatusIconProps = {
  status: Status;
  result: Result;
  className?: string;
  color?: boolean;
};

export function RunStatusIcon(props: RunStatusIconProps) {
  let Icon =
    props.status === 'running'
      ? CircleEllipsis
      : props.result === 'success'
        ? CircleCheck
        : CircleAlert;

  if (['pending', 'queued', 'assigned'].includes(props.status)) {
    Icon = CircleEllipsis;
  }

  const color = {
    none: '',
    success: 'text-green-500',
    failure: 'text-red-500',
    cancelled: '',
    skipped: 'text-blue-500',
  }[props.result];

  return (
    <Icon
      className={clsx(
        props.className,
        'fill-current stroke-black',
        props.color && color,
      )}
    />
  );
}
