import {type SupabaseClientOptions} from '@supabase/supabase-js';

export type ElwoodClientOptions<SchemaName> = SupabaseClientOptions<SchemaName>;

// copyright Supabase --begin--
// source: https://github.com/supabase/supabase-js/blob/master/src/lib/types.ts

export type GenericTable = {
  Row: Record<string, unknown>;
  Insert: Record<string, unknown>;
  Update: Record<string, unknown>;
};

export type GenericUpdatableView = GenericTable;

export type GenericNonUpdatableView = {
  Row: Record<string, unknown>;
};

export type GenericView = GenericUpdatableView | GenericNonUpdatableView;

export type GenericFunction = {
  Args: Record<string, unknown>;
  Returns: unknown;
};

export type GenericSchema = {
  Tables: Record<string, GenericTable>;
  Views: Record<string, GenericView>;
  Functions: Record<string, GenericFunction>;
};
// --end--
