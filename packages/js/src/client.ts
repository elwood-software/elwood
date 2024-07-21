import {
  createClient,
  SupabaseClient,
  type SupabaseClientOptions,
} from '@supabase/supabase-js';
import type {
  PostgrestQueryBuilder,
  PostgrestClient,
  PostgrestFilterBuilder,
} from '@supabase/postgrest-js';
import {invariant, Records, Database} from '@elwood/common';

import {GenericSchema} from './types';

type ElwoodSchema = Database['public'];
type ElwoodClientType = ElwoodClient<Database, 'public', ElwoodSchema>;

export type SupabaseClientCreator<
  Database = any,
  SchemaName extends string & keyof Database = 'public' extends keyof Database
    ? 'public'
    : string & keyof Database,
  Schema extends GenericSchema = Database[SchemaName] extends GenericSchema
    ? Database[SchemaName]
    : any,
> = (
  supabaseUrl: string,
  supabaseKey: string,
  options: any,
) => SupabaseClient<Database, SchemaName, Schema>;

export class ElwoodClient<
  Database = any,
  SchemaName extends string & keyof Database = 'public' extends keyof Database
    ? 'public'
    : string & keyof Database,
  Schema extends GenericSchema = Database[SchemaName] extends GenericSchema
    ? Database[SchemaName]
    : any,
> {
  readonly #supabaseUrl: string;
  readonly #supabaseKey: string;
  readonly #supabaseClient: SupabaseClient<Database, SchemaName, Schema>;
  readonly #elwoodClient: ElwoodClientType;

  constructor(
    protected supabaseUrl: string,
    protected supabaseKey: string,
    options: SupabaseClientOptions<SchemaName> = {},
    creator: SupabaseClientCreator<Database, SchemaName, Schema> | undefined,
  ) {
    console.log('init ElwoodClient');

    invariant(supabaseKey, 'supabaseKey is required');
    invariant(supabaseUrl, 'supabaseUrl is required');

    this.#supabaseClient = (creator ?? createClient)(
      supabaseUrl,
      supabaseKey,
      options,
    );
    this.#elwoodClient = this.#supabaseClient as unknown as ElwoodClientType;

    this.#supabaseKey = supabaseKey;
    this.#supabaseUrl = supabaseUrl;
  }

  get url() {
    return this.#supabaseUrl;
  }

  get key() {
    return this.#supabaseKey;
  }

  get functions(): SupabaseClient<Database, SchemaName, Schema>['functions'] {
    return this.#supabaseClient.functions;
  }

  get storage(): SupabaseClient<Database, SchemaName, Schema>['storage'] {
    return this.#supabaseClient.storage;
  }

  get auth(): SupabaseClient<Database, SchemaName, Schema>['auth'] {
    return this.#supabaseClient.auth;
  }

  from(
    ...args: Parameters<SupabaseClient['from']>
  ): ReturnType<SupabaseClient['from']> {
    return this.#supabaseClient.from(...args);
  }

  schema<DynamicSchema extends string & keyof Database>(
    schema: DynamicSchema,
  ): PostgrestClient<
    Database,
    DynamicSchema,
    Database[DynamicSchema] extends GenericSchema
      ? Database[DynamicSchema]
      : any
  > {
    return this.#supabaseClient.schema(schema);
  }

  rpc<
    FnName extends string & keyof Schema['Functions'],
    Fn extends Schema['Functions'][FnName],
  >(
    fn: FnName,
    args: Fn['Args'] = {},
    options: {
      head?: boolean;
      count?: 'exact' | 'planned' | 'estimated';
    } = {},
  ): PostgrestFilterBuilder<
    Schema,
    Fn['Returns'] extends any[]
      ? Fn['Returns'][number] extends Record<string, unknown>
        ? Fn['Returns'][number]
        : never
      : never,
    Fn['Returns']
  > {
    return this.#supabaseClient.rpc<FnName, Fn>(fn, args, options);
  }

  channel(
    ...args: Parameters<SupabaseClient['channel']>
  ): ReturnType<SupabaseClient['channel']> {
    return this.#supabaseClient.channel(...args);
  }

  getChannels(): ReturnType<SupabaseClient['getChannels']> {
    return this.#supabaseClient.getChannels();
  }

  removeChannel(
    ...args: Parameters<SupabaseClient['removeChannel']>
  ): ReturnType<SupabaseClient['removeChannel']> {
    return this.#supabaseClient.removeChannel(...args);
  }

  removeAllChannels(): ReturnType<SupabaseClient['removeAllChannels']> {
    return this.#supabaseClient.removeAllChannels();
  }

  /**
   * Elwood API
   */

  fromMembers(): PostgrestQueryBuilder<ElwoodSchema, Records.Member.View> {
    return this.#elwoodClient.from('elwood_member');
  }

  fromRuns(): PostgrestQueryBuilder<ElwoodSchema, Records.Run.View> {
    return this.#elwoodClient.from('elwood_run');
  }

  fromRunEvents(): PostgrestQueryBuilder<ElwoodSchema, Records.Run.EventView> {
    return this.#elwoodClient.from('elwood_run_event');
  }

  fromRunTriggers(): PostgrestQueryBuilder<
    ElwoodSchema,
    Records.Run.TriggerView
  > {
    return this.#elwoodClient.from('elwood_run_triggers');
  }

  fromRunWorkflows(): PostgrestQueryBuilder<
    ElwoodSchema,
    Records.Run.WorkflowView
  > {
    return this.#elwoodClient.from('elwood_run_workflow');
  }
}
