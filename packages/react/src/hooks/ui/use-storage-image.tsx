import {useQuery} from '@tanstack/react-query';
import {useMemo, useEffect, useState} from 'react';
import {default as parse, Element} from 'html-react-parser';
import {invariant} from '@elwood/common';
import {FilesBlobContent} from '@/components/files/blob';
import {useClient} from '../use-client';

export interface UseStorageImageOptions {
  src: string;
  attr: Record<string, string>;
}

export function useStorageImage(props: UseStorageImageOptions): JSX.Element {
  const client = useClient();
  const [src, setSrc] = useState<string | null | false>(null);

  useEffect(() => {
    if (!props.src) {
      return;
    }

    const [bucket, ...path] = props.src.split('/');

    client.storage
      .from(bucket)
      .createSignedUrl(path.join('/'), 60 * 5)
      .then(({data}) => {
        invariant(data?.signedUrl, 'Signed URL is required');
        setSrc(data.signedUrl);
      })
      .catch(() => {
        setSrc(false);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional
  }, [props.src]);

  if (!props.src) {
    return (
      <img src={props.attr.src} alt={props.attr.alt} title={props.attr.title} />
    );
  }

  if (src === false) {
    return <span>remote image failed to load</span>;
  }

  if (!src) {
    return <span />;
  }

  return <img src={src} alt={props.attr.alt} title={props.attr.title} />;
}

export function RenderStorageImage(props: UseStorageImageOptions): JSX.Element {
  return useStorageImage(props);
}
