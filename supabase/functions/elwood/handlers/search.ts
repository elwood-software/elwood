import {RouterContext} from 'jsr:@oak/oak/router';
import {connectDatabase} from '../../_shared/db.ts';

export async function handler<R extends string>(
  ctx: RouterContext<R>,
): Promise<void> {
  const {connection} = connectDatabase();
  const {term} = (await ctx.request.body.json()) as {
    term: string;
  };

  const rows = await connection
    .withSchema('storage')
    .selectFrom('objects')
    .selectAll()
    .where('name', 'ilike', `%${term}%`)
    .execute();

  ctx.response.body = {
    term,
    objects: rows,
  };
}
