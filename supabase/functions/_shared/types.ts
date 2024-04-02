import type {
  Kysely,
  ColumnType,
  Selectable,
  Updateable,
  Insertable,
  Generated,
  QueryCreator as KQueryCreator,
} from 'https://esm.sh/kysely@0.26.3';

// deno-lint-ignore no-explicit-any
export type JsonScalar = any;
export type JsonObject = Record<string, JsonScalar>;

export type Database = Kysely<DatabaseTables>;
export type QueryCreator = KQueryCreator<DatabaseTables>;

export type DatabaseTables = {
  access: AccessTable;
};

export type AccessTable = {
  id: Generated<string>;
  instance_id: string | null;
  user_id: string;
  created_by_user_id: string;
  path: string[];
  description: string | null;
  message: string | null;
  notes: string | null;
  type: string;
  role: string;
  data: JsonObject;
  flags: Record<string, boolean>;
  created_at: ColumnType<Date, never, never>;
  updated_at: ColumnType<Date, never, never>;
};

export type Access = Selectable<AccessTable>;
export type NewAccess = Insertable<AccessTable>;
export type UpdateAccess = Updateable<AccessTable>;
