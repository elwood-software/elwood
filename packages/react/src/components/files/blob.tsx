import {type PropsWithChildren, useEffect, useRef} from 'react';
import {invariant} from '@elwood/common';
import {useClient} from '@/hooks/use-client';
import {Button} from '@/components/button';

export interface BlobContentProps {
  html?: string | undefined;
  base64EncodedRaw?: string;
  style?: string;
  isImage: boolean;
  isVideo: boolean;
  contentType: string;
  rawUrl?: string;
}

export function FilesBlobContent(
  props: PropsWithChildren<BlobContentProps>,
): JSX.Element {
  const client = useClient();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (props.style && document.querySelector('style[data-blob]') === null) {
      const style = document.createElement('style');
      style.dataset.blob = '';
      style.innerHTML = props.style;
      document.head.appendChild(style);
      return () => {
        document.head.removeChild(style);
      };
    }
  }, [props.style]);

  if (props.isImage) {
    return <img alt="User Provided Blob" src={props.rawUrl} />;
  }

  if (props.children) {
    return (
      <div ref={ref} className="markdown-body">
        {props.children}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-6">
      {props.rawUrl ? (
        <Button
          href={props.rawUrl}
          rel="noopener"
          target="_blank"
          variant="secondary">
          View Raw Content
        </Button>
      ) : null}
    </div>
  );
}
