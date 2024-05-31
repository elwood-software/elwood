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
  setting: SettingsTable;
  objects: ObjectsTable;
  buckets: BucketsTable;
  embedding: EmbeddingTable;
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

export type SettingsTable = {
  name: string;
  value: string;
  created_at: ColumnType<Date, never, never>;
  updated_at: ColumnType<Date, never, never>;
};

export type Setting = Selectable<SettingsTable>;
export type NewSetting = Insertable<SettingsTable>;
export type UpdateSetting = Updateable<SettingsTable>;

export type BucketsTable = {
  id: string;
  name: string;
};

export type ObjectsTable = {
  id: string;
  bucket_id: string;
  name: string;
};

export type Object = Selectable<ObjectsTable>;
export type NewObject = Insertable<ObjectsTable>;
export type UpdateObject = Updateable<ObjectsTable>;

export type EmbeddingTable = {
  instance_id: string | null;
  id: Generated<string>;
  bucket_id: string;
  object_id: string;
  embedding: string;
  summary: string | null;
  search_text: string | null | undefined;
};

export type Embedding = Selectable<EmbeddingTable>;
export type NewEmbedding = Insertable<EmbeddingTable>;
export type UpdateEmbedding = Updateable<EmbeddingTable>;

// deno-lint-ignore no-namespace
export namespace Webhook {
  export type InsertPayload<R> = {
    type: 'INSERT';
    table: string;
    schema: string;
    record: R;
    old_record: null;
  };
  export type UpdatePayload<R> = {
    type: 'UPDATE';
    table: string;
    schema: string;
    record: R;
    old_record: R;
  };
  export type DeletePayload<R> = {
    type: 'DELETE';
    table: string;
    schema: string;
    record: null;
    old_record: R;
  };

  export type DirectPayload<R> = {
    type: 'DIRECT';
    table: string;
    schema: string;
    record: R;
  };

  export type Payload<R> =
    | InsertPayload<R>
    | UpdatePayload<R>
    | DeletePayload<R>
    | DirectPayload<R>;
}
