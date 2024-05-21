import {RouterContext} from 'jsr:@oak/oak/router';
import {connectDatabase} from '../../_shared/db.ts';

export async function handler<R extends string>(
  ctx: RouterContext<R>,
): Promise<void> {
  const {db} = connectDatabase();

  const result = await db
    .selectFrom('setting')
    .where('name', '=', 'workspace_name')
    .select('value')
    .executeTakeFirst();

  const workspaceName = result?.value ?? 'Unnamed Workspace';

  ctx.response.body = {
    anon_key: Deno.env.get('SUPABASE_ANON_KEY'),
    workspace_name: workspaceName,
  };
}
