import type {Records} from '@elwood/common';
import type {Status, Result, Workflow} from '@jsr/elwood__run/types';

export type RunWorkflowStatus = Status;
export type RunWorkflowResult = Result;
export {Workflow as RunWorkflow};

export type UseGetRunsItem = Pick<
  Records.Run.Row,
  | 'id'
  | 'num'
  | 'created_at'
  | 'summary'
  | 'short_summary'
  | 'tracking_id'
  | 'workflow_id'
> & {
  status: Status;
  result: Result;
  reason?: string;
  workflow: Pick<Records.Run.Workflow, 'id' | 'name'> & {
    label: string;
  };
};

export type UseGetRunItem = Pick<
  Records.Run.Row,
  | 'id'
  | 'num'
  | 'created_at'
  | 'summary'
  | 'short_summary'
  | 'tracking_id'
  | 'workflow_id'
  | 'configuration'
  | 'variables'
> & {
  status: Status;
  result: Result;
  report: Workflow.Report;
};

export type UseGetRunWorkflowsItem = Pick<
  Records.Run.Workflow,
  'id' | 'name'
> & {
  label?: string;
};

export type UseGetRunWorkflowItem = Pick<
  Records.Run.Workflow,
  'id' | 'name' | 'configuration'
> & {
  label?: string;
};

export type UseGetRunTriggerItem = Pick<Records.Run.Trigger, 'trigger'>;
