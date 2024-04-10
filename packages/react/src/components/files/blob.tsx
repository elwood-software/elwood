import {useEffect} from 'react';
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

export function FilesBlobContent(props: BlobContentProps): JSX.Element {
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

  if (props.html) {
    return (
      <div
        className="markdown-body"
        dangerouslySetInnerHTML={{__html: props.html}}
      />
    );
  }

  return (
    <div className="flex items-center justify-center p-6">
      {props.rawUrl ? (
        <Button href={props.rawUrl} rel="noopener" target="_blank">
          View Raw Content
        </Button>
      ) : null}
    </div>
  );
}
