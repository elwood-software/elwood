import {CircleAlert, CircleEllipsis, CircleCheck, Spinner} from '@elwood/ui';
import clsx from 'clsx';

import type {
  RunWorkflowStatus,
  RunWorkflowResult,
  UseGetRunItem,
  UseGetRunsItem,
} from '@/types';

export type RunStatusIconPropsWithRun = {
  run: UseGetRunItem | UseGetRunsItem;
};
export type RunStatusIconPropsWithValues = {
  status: RunWorkflowStatus;
  result: RunWorkflowResult;
};

export type RunStatusIconProps = (
  | RunStatusIconPropsWithRun
  | RunStatusIconPropsWithValues
) & {
  className?: string;
  color?: boolean;
};

export function RunStatusIcon(props: RunStatusIconProps) {
  const status: RunWorkflowStatus =
    ((props as RunStatusIconPropsWithRun).run
      ? (props as RunStatusIconPropsWithRun).run.status
      : (props as RunStatusIconPropsWithValues).status) ?? 'queued';
  const result: RunWorkflowResult =
    ((props as RunStatusIconPropsWithRun).run
      ? (props as RunStatusIconPropsWithRun).run.result
      : (props as RunStatusIconPropsWithValues).result) ?? 'none';

  let Icon =
    status === 'running'
      ? CircleEllipsis
      : result === 'success'
        ? CircleCheck
        : CircleAlert;

  if (['pending', 'queued', 'assigned'].includes(status)) {
    Icon = CircleEllipsis;
  }

  if (status === 'running') {
    return <Spinner className={clsx(props.className)} />;
  }

  const color = {
    none: '',
    success: 'text-green-500',
    failure: 'text-red-500',
    cancelled: '',
    skipped: 'text-blue-500',
  }[result];

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
