export type * from '@supabase/supabase-js';

export * from './client';

import type {SupabaseClient} from '@supabase/supabase-js';
import type {ElwoodClientOptions, GenericSchema} from './types';
import {ElwoodClient} from './client';

export const createClient = <
  Database = any,
  SchemaName extends string & keyof Database = 'public' extends keyof Database
    ? 'public'
    : string & keyof Database,
  Schema extends GenericSchema = Database[SchemaName] extends GenericSchema
    ? Database[SchemaName]
    : any,
>(
  supabaseUrl: string,
  supabaseKey: string,
  options?: ElwoodClientOptions<SchemaName>,
  supabaseClient?: SupabaseClient<Database, SchemaName, Schema> | null,
): ElwoodClient<Database, SchemaName, Schema> => {
  return new ElwoodClient<Database, SchemaName, Schema>(
    supabaseUrl,
    supabaseKey,
    options,
    supabaseClient,
  );
};
