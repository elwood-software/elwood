import {dirname} from 'https://deno.land/std@0.223.0/path/mod.ts';
import {CSS} from 'https://deno.land/x/gfm@0.6.0/mod.ts';
import {typeByExtension} from 'https://deno.land/std@0.217.0/media_types/type_by_extension.ts';
import {parseMediaType} from 'https://deno.land/std@0.217.0/media_types/parse_media_type.ts';
import {extname} from 'https://deno.land/std@0.217.0/path/extname.ts';
import {encodeBase64} from 'https://deno.land/std@0.217.0/encoding/base64.ts';

import {renderMarkdown} from './render-markdown.ts';

const CAN_RENDER = ['text/markdown', 'text/plain'];

export type HandlerInput = {
  bucket: string;
  key: string;
  baseUrl?: string;
  accessTokens: string;
  contentType?: string;
};

export type HandlerResult = {
  raw: string | undefined;
  raw_url: string | undefined;
  html: string | undefined;
  style: string | undefined;
  is_video: boolean;
  is_image: boolean;
  is_pdf: boolean;
  content_type: string;
};

export async function handler(input: HandlerInput): Promise<HandlerResult> {
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');
  const PUBLIC_SUPABASE_URL =
    Deno.env.get('PUBLIC_SUPABASE_URL') ?? SUPABASE_URL;

  const response = await fetch(
    `${SUPABASE_URL}/storage/v1/object/authenticated/${input.bucket}/${input.key}`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${input.accessTokens}`,
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
        input.contentType ??
        'application/octet-stream',
    )[0] ??
    'application/octet-stream';

  let raw: string | undefined = undefined;
  let raw_url: string | undefined = undefined;
  let html: string | undefined = undefined;
  let style: string | undefined = undefined;

  if (CAN_RENDER.includes(content_type)) {
    const text = await response.text();
    raw = encodeBase64(text);
    html = renderMarkdown({
      text,
      baseUrl: `${PUBLIC_SUPABASE_URL}/functions/v1/render`,
      accessToken: input.accessTokens,
      basePath: `${input.bucket}/${dirname(input.key)}`,
    });
    style = CSS;
  } else {
    const response = await fetch(
      `${SUPABASE_URL}/storage/v1/object/sign/${input.bucket}/${input.key}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${input.accessTokens}`,
        },
        body: JSON.stringify({
          expiresIn: 60 * 60 * 24, // 24 hours
        }),
      },
    );

    const data = await response.json();

    raw_url = `${PUBLIC_SUPABASE_URL}/storage/v1${data.signedURL}`;
  }

  return {
    content_type,
    raw,
    raw_url,
    style,
    html,
    is_pdf: content_type === 'application/pdf',
    is_video: Boolean(content_type?.startsWith('video/')),
    is_image: Boolean(content_type.startsWith('image/')),
  };
}
