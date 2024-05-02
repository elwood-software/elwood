'use client';

import {useState, useEffect} from 'react';
import {useSearchParams} from 'next/navigation';

import {type ElwoodClient} from '@elwood/js';
import {Spinner} from '@elwood/ui';
import {Render, useRenderers} from '@elwood/react';
import {ElwoodProvider} from '@elwood/react';
import {createClient} from '@/utils/supabase/client';

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
    return <Spinner />;
  }

  return (
    <ElwoodProvider workspaceName="Hello" client={client}>
      <Render
        iframe={true}
        path={path}
        contentType={contentType}
        renderer={renderer}
        rendererParams={{}}
      />
    </ElwoodProvider>
  );
}
