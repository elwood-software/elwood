import {RunnerDefinition} from './types.ts';

export const RunnerStatus: Record<string, RunnerDefinition.Status> = {
  Pending: 'pending',
  Running: 'running',
  Complete: 'complete',
} as const;

export const RunnerResult: Record<string, RunnerDefinition.Result> = {
  None: 'none',
  Success: 'success',
  Failure: 'failure',
  Cancelled: 'cancelled',
  Skipped: 'skipped',
} as const;
