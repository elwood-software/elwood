import {RouterContext} from 'jsr:@oak/oak/router';

import {dirname} from 'https://deno.land/std@0.223.0/path/mod.ts';
import {CSS} from 'https://deno.land/x/gfm@0.6.0/mod.ts';
import {typeByExtension} from 'https://deno.land/std@0.217.0/media_types/type_by_extension.ts';
import {parseMediaType} from 'https://deno.land/std@0.217.0/media_types/parse_media_type.ts';
import {extname} from 'https://deno.land/std@0.217.0/path/extname.ts';

import {renderMarkdown} from '../libs/render-markdown.ts';
import {assert} from '../../_shared/deps.ts';

const CAN_RENDER = ['text/markdown', 'text/plain'];

export type HandlerInput = {
  bucket: string;
  key: string;
  baseUrl?: string;
};

export type HandlerResult = {
  content_type: string;
  params: Record<string, unknown>;
};

export async function handler<R extends string = string>(
  ctx: RouterContext<R>,
): Promise<void> {
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');
  const PUBLIC_SUPABASE_URL =
    Deno.env.get('PUBLIC_SUPABASE_URL') ?? SUPABASE_URL;

  const accessTokens = ctx.request.headers
    .get('Authorization')
    ?.replace('Bearer ', '');
  const contentType = ctx.request.headers.get('Content-Type');
  const input = (await ctx.request.body.json()) as HandlerInput;

  assert(accessTokens, 'Missing access token');

  const response = await fetch(
    `${SUPABASE_URL}/storage/v1/object/authenticated/${input.bucket}/${input.key}`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${accessTokens}`,
      },
    },
  );

  // by default, we take what the server gave back
  // as the true content type. if there isn't helpful,
  // we fallback to what the user gave us, what we can infer
  // from the file extension, or just default to octet
  const content_type =
    typeByExtension(extname(input.key)) ??
    parseMediaType(
      response.headers.get('content-type') ??
        contentType ??
        'application/octet-stream',
    )[0] ??
    'application/octet-stream';

  const params: Record<string, unknown> = {};

  if (CAN_RENDER.includes(content_type)) {
    const text = await response.text();
    const {html, headings} = renderMarkdown({
      text,
      baseUrl: `${PUBLIC_SUPABASE_URL}/functions/v1/render`,
      accessToken: accessTokens,
      basePath: `${input.bucket}/${dirname(input.key)}`,
    });

    params.headings = headings;
    params.html = html;
    params.style = CSS;
  }

  ctx.response.body = {
    content_type,
    params,
  } as HandlerResult;
}
