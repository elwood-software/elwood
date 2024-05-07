import {useRef, useEffect, useState} from 'react';

import type {RendererProps} from '@elwood/common';
import {RenderStorageImage} from '@/hooks/ui/use-storage-image';

export type RenderHtmlProps = RendererProps<{
  style: string;
  html: string;
  headers: Array<{
    slug: string;
    text: string;
    level: number;
  }>;
}>;

export default function RenderHtml(props: RenderHtmlProps) {
  const {style, html, headers} = props.params;
  const ref = useRef<HTMLDivElement>(null);
  const [child, setChild] = useState<
    JSX.Element | JSX.Element[] | string | null
  >(null);

  useEffect(() => {
    props.postMessage('set-headers', {
      headers,
    });
  }, [headers]);

  useEffect(() => {
    import('html-react-parser').then(mod => {
      setChild(
        mod.default(html, {
          replace(domNode) {
            if (
              domNode instanceof mod.Element &&
              domNode.tagName.toLowerCase() === 'img' &&
              domNode.attribs['data-src']
            ) {
              const {'data-src': src, ...attr} = domNode.attribs;

              return (
                <RenderStorageImage
                  key={`remote-image:${src}`}
                  src={src}
                  attr={attr}
                />
              );
            }
          },
        }),
      );
    });
  }, [html]);

  useEffect(() => {
    if (style && document.querySelector('style[data-blob]') === null) {
      const el = document.createElement('style');
      el.dataset.blob = '';
      el.innerHTML = style;
      document.head.appendChild(el);

      return () => {
        document.head.removeChild(el);
      };
    }
  }, [style]);

  return (
    <div ref={ref} className="markdown-body">
      {child}
    </div>
  );
}
