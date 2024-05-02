import {useQuery} from '@tanstack/react-query';
import {useMemo} from 'react';
import {Renderer} from '@elwood/common';
import {Render} from '@/components/render';

import {useClient} from '../use-client';
import {useRenderers} from './use-renderers';
import {RenderIframe} from './use-render-iframe';

export interface UseRenderedBlobResultData {
  path: string;
  html: string | undefined;
  style: string | undefined;
  content_type: string;
}

export interface UseRenderedBlobInput {
  prefix: string[];
}

export function useRenderedBlob(
  input: UseRenderedBlobInput,
): [JSX.Element, UseRenderedBlobResultData | null | undefined] {
  const supabase = useClient();
  const [findRenderer] = useRenderers();

  const query = useQuery({
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
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

    let renderer = findRenderer(query.data.content_type);

    if (!renderer) {
      return <div>Unable to render</div>;
    }

    if (renderer.iframe) {
      return (
        <RenderIframe
          src={`/render/iframe?${new URLSearchParams({path: input.prefix.join('/'), contentType: query.data.content_type})}`}
        />
      );
    }

    return (
      <Render
        path={input.prefix.join('/')}
        contentType={query.data.content_type}
        renderer={renderer}
        rendererParams={{}}
      />
    );
  }, [input.prefix, query.data]);

  return [blob, query.data];
}

export function RenderBlob(path: UseRenderedBlobInput) {
  return useRenderedBlob(path)[0];
}
