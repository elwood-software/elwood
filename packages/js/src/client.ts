import {
  SupabaseClient,
  type SupabaseClientOptions,
} from '@supabase/supabase-js';
import type {Database as ElwoodDatabase} from '@elwood/common';

import {GenericSchema} from './types';

export class ElwoodClient<
  Database = any,
  SchemaName extends string & keyof Database = 'public' extends keyof Database
    ? 'public'
    : string & keyof Database,
  Schema extends GenericSchema = Database[SchemaName] extends GenericSchema
    ? Database[SchemaName]
    : any,
> extends SupabaseClient<Database, SchemaName, Schema> {
  readonly #supabaseUrl: string;
  readonly #supabaseKey: string;
  readonly #options: SupabaseClientOptions<SchemaName>;
  readonly #elwoodClient: SupabaseClient<ElwoodDatabase, 'public'>;

  constructor(
    protected supabaseUrl: string,
    protected supabaseKey: string,
    options: SupabaseClientOptions<SchemaName> = {},
  ) {
    super(supabaseUrl, supabaseKey, options);

    this.#supabaseKey = supabaseKey;
    this.#supabaseUrl = supabaseUrl;
    this.#options = options;

    this.#elwoodClient = new SupabaseClient<ElwoodDatabase, 'public'>(
      this.#supabaseUrl,
      this.#supabaseKey,
      {
        ...options,
        db: {
          ...options.db,
          schema: 'public',
        },
      },
    );
  }

  get url() {
    return this.#supabaseUrl;
  }

  get key() {
    return this.#supabaseKey;
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

  /**
   * Merge the provided client with this client
   * @param supabaseClient
   * @returns ElwoodClient
   */
  mergeWith(
    supabaseClient: SupabaseClient,
  ): ElwoodClient<Database, SchemaName, Schema> {
    for (let key in supabaseClient) {
      if (supabaseClient.hasOwnProperty(key)) {
        (this as any)[key] = (supabaseClient as any)[key];
      }
    }

    return this;
  }
}
