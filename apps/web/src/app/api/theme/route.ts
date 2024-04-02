export const dynamic = 'force-dynamic';

export async function POST(request: Request): Promise<Response> {
  const value = await request.text();

  if (!['light', 'dark'].includes(value)) {
    return new Response('false', {status: 401});
  }

  return new Response('true', {
    headers: {'Set-Cookie': `theme=${value}; Path=/`},
  });
}
