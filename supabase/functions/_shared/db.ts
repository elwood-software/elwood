import {Pool} from 'https://deno.land/x/postgres@v0.17.0/mod.ts';
import {
  Kysely,
  PostgresAdapter,
  PostgresIntrospector,
  PostgresQueryCompiler,
} from 'https://esm.sh/kysely@0.26.3';
import {PostgresDriver} from './postgres-driver.ts';

import type {DatabaseTables, Database, QueryCreator} from './types.ts';
import {assert} from 'https://deno.land/std@0.160.0/_util/assert.ts';

// export
export {sql} from 'https://esm.sh/kysely@0.26.3';

export type ConnectDatabaseResult = {
  db: QueryCreator;
  connection: Database;
};

export function connectDatabase(
  databaseUrl = Deno.env.get('SUPABASE_DB_URL'),
): ConnectDatabaseResult {
  assert(databaseUrl, 'SUPABASE_DB_URL is not set');

  const pool = new Pool(databaseUrl, 3, true);
  const connection = new Kysely<DatabaseTables>({
    dialect: {
      createAdapter() {
        return new PostgresAdapter();
      },
      createDriver() {
        return new PostgresDriver({pool});
      },
      createIntrospector(db: Kysely<unknown>) {
        return new PostgresIntrospector(db);
      },
      createQueryCompiler() {
        return new PostgresQueryCompiler();
      },
    },
  });

  return {
    db: connection.withSchema('elwood'),
    connection,
  };
}

export type WithDatabase<T> = T & ConnectDatabaseResult;
