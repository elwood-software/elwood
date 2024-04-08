import {useQuery} from '@tanstack/react-query';
import {FilesBlobContent} from '@/components/files/blob';
import {useClient} from '../use-client';

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
): [JSX.Element, UseRenderedBlobResultData | null] {
  const supabase = useClient();

  const query = useQuery({
    queryKey: ['file-content', input.prefix.join('/')],
    initialData: {
      raw_url: undefined,
      raw: undefined,
      html: undefined,
      style: undefined,
      is_video: false,
      is_image: false,
      content_type: 'application/octet-stream',
    },
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

  const blob = query.isFetching ? (
    <div />
  ) : (
    <FilesBlobContent
      base64EncodedRaw={query.data?.raw}
      contentType={query.data?.content_type ?? 'application/octet-stream'}
      html={query.data?.html ?? undefined}
      isImage={query.data?.is_image ?? false}
      isVideo={query.data?.is_video ?? false}
      key={`Content-${input.prefix.join('/')}`}
      rawUrl={query.data?.raw_url}
      style={query.data?.style}
    />
  );

  return [blob, query.data];
}
