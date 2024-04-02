import {render, CSS} from 'https://deno.land/x/gfm/mod.ts';
import {typeByExtension} from 'https://deno.land/std@0.217.0/media_types/type_by_extension.ts';
import {parseMediaType} from 'https://deno.land/std@0.217.0/media_types/parse_media_type.ts';
import {extname} from 'https://deno.land/std@0.217.0/path/extname.ts';
import {encodeBase64} from 'https://deno.land/std@0.217.0/encoding/base64.ts';

const CAN_RENDER = ['text/markdown'];

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
  const [content_type] = parseMediaType(
    response.headers.get('content-type') ??
      input.contentType ??
      typeByExtension(extname(input.key)) ??
      'application/octet-stream',
  );

  let raw: string | undefined = undefined;
  let raw_url: string | undefined = undefined;
  let html: string | undefined = undefined;
  let style: string | undefined = undefined;

  if (CAN_RENDER.includes(content_type)) {
    const text = await response.text();
    raw = encodeBase64(text);
    html = render(text as string, {
      baseUrl: input.baseUrl,
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
    is_video: Boolean(content_type?.startsWith('video/')),
    is_image: Boolean(content_type.startsWith('image/')),
  };
}
