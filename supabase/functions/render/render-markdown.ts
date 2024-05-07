import {default as sanitizeHtml} from 'https://esm.sh/sanitize-html@2.11.0?target=esnext&pin=v135';
import {join} from 'https://deno.land/std@0.223.0/path/mod.ts';
import {render, Renderer} from 'https://deno.land/x/gfm@0.6.0/mod.ts';
import {GitHubSlugger} from 'https://deno.land/x/gfm@0.6.0/deps.ts';

export type RenderMarkdownResult = {
  html: string;
  headings: Heading[];
};

type Heading = {
  slug: string;
  level: number;
  title: string;
};

class LocalRenderer extends Renderer {
  public accessToken: string = '';
  public baseUrl: string = '';
  public basePath = '';
  public headings: Heading[] = [];

  #slugger = new GitHubSlugger();

  public heading(
    text: string,
    level: 1 | 2 | 3 | 4 | 5 | 6,
    raw: string,
  ): string {
    const slug = this.#slugger.slug(raw);

    this.headings.push({
      slug,
      level,
      title: text,
    });

    return super.heading(text, level, raw);
  }

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

export function renderMarkdown(
  input: RenderMarkdownInput,
): RenderMarkdownResult {
  const renderer = new LocalRenderer();

  renderer.baseUrl = input.baseUrl;
  renderer.accessToken = input.accessToken;
  renderer.basePath = input.basePath;

  const html = render(input.text, {
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

  return {
    html,
    headings: renderer.headings,
  };
}
