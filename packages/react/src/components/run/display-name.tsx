import {ReactNode} from 'react';

import type {
  UseGetRunsItem,
  UseGetRunItem,
  UseGetRunWorkflowItem,
  RunWorkflow,
} from '@/types';
import {useGetRunWorkflow} from '@/data/run/use-get-workflow';

export type RunDisplayNameProps = {
  run: UseGetRunItem | UseGetRunsItem;
  className?: string;
  postfix?: boolean;
  fallback?: ReactNode;
};

export function RunDisplayName(props: RunDisplayNameProps) {
  const {run} = props;

  return (
    <span className={props.className}>
      {run.short_summary ?? (
        <RunWorkflowDisplayName workflow={{id: run.workflow_id}} />
      )}
      {props.postfix !== false && (
        <span className="ml-2 text-muted-foreground font-normal text-xs">
          #{run.num}
        </span>
      )}
    </span>
  );
}

export type RunWorkflowDisplayNameProps = {
  workflow: UseGetRunWorkflowItem | {id: string | null};
  fallback?: ReactNode;
};

export function RunWorkflowDisplayName(props: RunWorkflowDisplayNameProps) {
  const query = useGetRunWorkflow(
    {
      id: props.workflow.id!,
    },
    {
      enabled: !!props.workflow.id,
    },
  );

  return query.data?.label ?? query.data?.name ?? props.fallback ?? null;
}

export type RunWorkflowJobOrStepDisplayNameProps = {
  item: RunWorkflow.Job | RunWorkflow.Step;
};

export function RunWorkflowJobOrStepDisplayName(
  props: RunWorkflowJobOrStepDisplayNameProps,
) {
  return <>{props.item.label ?? props.item.name}</>;
}
