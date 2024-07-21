import {type Database} from '../database';

export type Row = Database['public']['Views']['elwood_run']['Row'];
export type New = Database['public']['Views']['elwood_run']['Insert'];
export type Update = Database['public']['Views']['elwood_run']['Update'];
export type View = Database['public']['Views']['elwood_run'];

export type Event = Database['public']['Views']['elwood_run_event']['Row'];
export type EventView = Database['public']['Views']['elwood_run_event'];

export type Trigger = Database['public']['Views']['elwood_run_triggers']['Row'];
export type TriggerView = Database['public']['Views']['elwood_run_triggers'];

export type Workflow =
  Database['public']['Views']['elwood_run_workflow']['Row'];
export type NewWorkflow =
  Database['public']['Views']['elwood_run_workflow']['Insert'];
export type UpdateWorkflow =
  Database['public']['Views']['elwood_run_workflow']['Update'];
export type WorkflowView = Database['public']['Views']['elwood_run_workflow'];
