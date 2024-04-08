import {
  createClient,
  SupabaseClient,
  type SupabaseClientOptions,
} from '@supabase/supabase-js';
import type {
  PostgrestClient,
  PostgrestFilterBuilder,
  PostgrestQueryBuilder,
} from '@supabase/postgrest-js';
import {invariant, type Database as ElwoodDatabase} from '@elwood/common';

import {GenericSchema} from './types';

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
  readonly #supabaseClient: SupabaseClient<Database, SchemaName>;

  readonly #options: SupabaseClientOptions<SchemaName>;
  readonly #elwoodClient: PostgrestClient<ElwoodDatabase, 'public'>;

  constructor(
    protected supabaseUrl: string,
    protected supabaseKey: string,
    options: SupabaseClientOptions<SchemaName> = {},
    initialClient: SupabaseClient<Database, SchemaName> | null = null,
  ) {
    console.log('init ElwoodClient');

    invariant(supabaseKey, 'supabaseKey is required');
    invariant(supabaseUrl, 'supabaseUrl is required');

    this.#supabaseKey = supabaseKey;
    this.#supabaseUrl = supabaseUrl;
    this.#options = options;

    this.#supabaseClient =
      initialClient ??
      createClient<Database, SchemaName>(supabaseUrl, supabaseKey, options);

    this.#elwoodClient = (
      this.#supabaseClient as SupabaseClient<ElwoodDatabase, 'public'>
    ).schema('public');
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

  members(): PostgrestQueryBuilder<
    ElwoodDatabase['public'],
    ElwoodDatabase['public']['Views']['elwood_members']
  > {
    return this.#elwoodClient.from('elwood_members');
  }

  async getNode(
    path: string[],
  ): Promise<
    ElwoodDatabase['public']['CompositeTypes']['elwood_get_node_result']
  > {
    const {data, error} = await this.#elwoodClient.rpc('elwood_get_node', {
      p_path: path,
    });

    if (error) {
      throw error;
    }

    return data as ElwoodDatabase['public']['CompositeTypes']['elwood_get_node_result'];
  }

  async getNodeTree(
    path: string[],
  ): Promise<
    ElwoodDatabase['public']['CompositeTypes']['elwood_get_node_tree_result']
  > {
    const {data, error} = await this.#elwoodClient.rpc('elwood_get_node_tree', {
      p_path: path,
    });

    if (error) {
      throw error;
    }

    return data as ElwoodDatabase['public']['CompositeTypes']['elwood_get_node_tree_result'];
  }
}
