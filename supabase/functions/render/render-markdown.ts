import {default as sanitizeHtml} from 'https://esm.sh/sanitize-html@2.11.0?target=esnext&pin=v135';
import {join} from 'https://deno.land/std@0.223.0/path/mod.ts';
import {render, Renderer} from 'https://deno.land/x/gfm@0.6.0/mod.ts';
import {encodeBase64} from 'https://deno.land/std@0.217.0/encoding/base64.ts';

const BASE64_PLACEHOLDER_IMAGE =
  'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

class LocalRenderer extends Renderer {
  public accessToken: string = '';
  public baseUrl: string = '';
  public basePath = '';

  image(src: string, title: string | null, alt: string): string {
    if (src.includes('http')) {
      return super.image(src, title, alt);
    }
    const proxySrc = join(this.basePath, src);

    return `<img class="local-src-hidden" alt="${alt}" title="${title ?? ''}" data-src="${proxySrc}" />`;
  }
}

export type RenderMarkdownInput = {
  text: string;
  accessToken: string;
  baseUrl: string;
  basePath: string;
};

export function renderMarkdown(input: RenderMarkdownInput): string {
  const renderer = new LocalRenderer();

  renderer.baseUrl = input.baseUrl;
  renderer.accessToken = input.accessToken;
  renderer.basePath = input.basePath;

  return render(input.text, {
    renderer,
    baseUrl: input.baseUrl,
    allowIframes: false,
    allowedClasses: {
      img: ['local-src-hidden'],
    },
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ['data-src', '', 'alt', 'title'],
    },
  });
}
