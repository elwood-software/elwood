// deno-lint-ignore-file no-namespace

export namespace RunnerDefinition {
  export type Status = 'pending' | 'running' | 'complete';
  export type Result = 'none' | 'success' | 'failure' | 'cancelled' | 'skipped';

  export interface State {
    status: Status;
    result: Result;
    state: {
      [key: string]: unknown;
      reason: string | null;
    };
  }

  export interface Normalized {
    name: string;
    jobs: Job[];
  }

  export interface Job {
    id: string;
    name: string;
    steps: Step[];
  }

  export interface Step {
    id: string;
    name: string;
    action: string;
    with: Record<string, string>;
    permissions: StepPermission;
  }

  export interface StepPermission {
    env: string[];
  }
}
