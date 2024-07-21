export type * from '@supabase/supabase-js';

export * from './client';

import type {Database as ElwoodDatabase} from '@elwood/common';

import type {ElwoodClientOptions, GenericSchema} from './types';
import {ElwoodClient, SupabaseClientCreator} from './client';

export function createClient<
  Database = ElwoodDatabase,
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
  creator?: SupabaseClientCreator<any, any, any>,
): ElwoodClient<Database, SchemaName, Schema> {
  return new ElwoodClient<Database, SchemaName, Schema>(
    supabaseUrl,
    supabaseKey,
    options,
    creator,
  );
}
