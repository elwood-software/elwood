import {useQuery} from '@tanstack/react-query';
import {useMemo} from 'react';
import {default as parse, Element} from 'html-react-parser';
import {FilesBlobContent} from '@/components/files/blob';
import {useClient} from '../use-client';
import {RenderStorageImage} from './use-storage-image';

export interface UseRenderedBlobResultData {
  raw: string | undefined;
  raw_url: string | undefined;
  html: string | undefined;
  style: string | undefined;
  is_video: boolean;
  is_image: boolean;
  content_type: string;
}

export interface UseRenderedBlobInput {
  prefix: string[];
}

export function useRenderedBlob(
  input: UseRenderedBlobInput,
): [JSX.Element, UseRenderedBlobResultData | null | undefined] {
  const supabase = useClient();

  const query = useQuery({
    queryKey: ['file-content', input.prefix.join('/')],
    async queryFn({queryKey}) {
      const [_, pPrefix] = queryKey;
      const [pBucketId, ...pFilePath] = pPrefix.split('/');
      const r = await supabase.functions.invoke<UseRenderedBlobResultData>(
        'render',
        {
          body: {
            bucket: pBucketId,
            key: pFilePath.join('/'),
          },
        },
      );

      return r.data;
    },
  });

  const blob = useMemo(() => {
    if (!query.data) {
      return <div />;
    }

    let child: ReturnType<typeof parse> | undefined;

    if (query.data.html) {
      child = parse(query.data.html, {
        replace(domNode) {
          if (
            domNode instanceof Element &&
            domNode.tagName.toLowerCase() === 'img'
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
      });
    }

    return (
      <FilesBlobContent
        base64EncodedRaw={query.data.raw}
        contentType={query.data.content_type}
        html={query.data.html}
        isImage={query.data.is_image}
        isVideo={query.data.is_video}
        key={`Content-${input.prefix.join('/')}`}
        rawUrl={query.data.raw_url}
        style={query.data.style}>
        {child}
      </FilesBlobContent>
    );
  }, [input.prefix, query.data]);

  return [blob, query.data];
}
