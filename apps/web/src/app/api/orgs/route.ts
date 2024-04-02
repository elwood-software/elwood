import type {Platform} from '@elwood/common';
import {createClient} from '@/utils/supabase/server';
import {getSupabaseEnv} from '@/utils/supabase/get-supabase-env';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request): Promise<Response> {
  const client = createClient();
  const {data, error} = await client.auth.getSession();

  if (error ?? !data.session) {
    return new Response(JSON.stringify({error: 'unauthorized', status: 401}), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return Response.json(await getOrgs());
}

async function getOrgs(): Promise<Platform.OrgRecord[]> {
  const [clientUrl, clientAnonKey] = getSupabaseEnv();

  return [
    {
      id: '00000000-0000-0000-0000-000000000000',
      name: 'default',
      display_name: 'Dunder Mifflin',
      clientUrl,
      clientAnonKey,
    },
  ];
}
