'use client';

import {useState, useEffect} from 'react';
import {useSearchParams} from 'next/navigation';

import {type ElwoodClient} from '@elwood/js';
import {Render, useRenderers} from '@elwood/react';
import {createClient} from '@/utils/supabase/client';
import {Provider} from '../../../provider';
import {default as PageLoading} from './loading';

export default function RenderIframePage(): JSX.Element {
  const [client, setClient] = useState<ElwoodClient | null>(null);
  const searchParams = useSearchParams();
  const [findRenderer] = useRenderers();

  const path = searchParams.get('path');
  const contentType = searchParams.get('contentType');

  useEffect(() => {
    setClient(createClient());
  }, []);

  if (!path) {
    return <div>No source provided</div>;
  }

  if (!contentType) {
    return <div>No content type provided</div>;
  }

  const renderer = findRenderer(contentType);

  if (!renderer) {
    return <div>Unable to render</div>;
  }

  if (!client) {
    return <PageLoading />;
  }

  return (
    <Provider client={client}>
      <Render
        iframe={true}
        path={path}
        contentType={contentType}
        renderer={renderer}
        rendererParams={{}}
      />
    </Provider>
  );
}
