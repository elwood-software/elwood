'use client';

import {useState, useEffect} from 'react';
import {useMeasure} from 'react-use';
import {useSearchParams} from 'next/navigation';

import {type ElwoodClient} from '@elwood/js';
import type {JsonObject} from '@elwood/common';
import {Spinner} from '@elwood/ui';
import {Render, useRenderers} from '@elwood/react';
import {ElwoodProvider} from '@elwood/react';
import {createClient} from '@/utils/supabase/client';

export default function RenderIframePage(): JSX.Element {
  const [client, setClient] = useState<ElwoodClient | null>(null);
  const [ref, {width, height}] = useMeasure<HTMLDivElement>();
  const [isReady, setIsReady] = useState(false);
  const searchParams = useSearchParams();
  const [findRenderer] = useRenderers();

  function postMessage(type: string, value: JsonObject) {
    window.parent.postMessage({type, value}, location.origin);
  }

  useEffect(() => {
    setClient(createClient());

    function onMessage(e: MessageEvent) {
      if (e.data === 'init') {
        postMessage('height', {height});
        return;
      }
    }

    window.addEventListener('message', onMessage);

    return function unload() {
      window.removeEventListener('message', onMessage);
    };
  }, []);

  useEffect(() => {
    if (parent) {
      postMessage('height', {height});
    }
  }, [height]);

  if (!searchParams.has('path')) {
    return <div>No source provided</div>;
  }

  if (!searchParams.has('contentType')) {
    return <div>No content type provided</div>;
  }

  const renderer = findRenderer(searchParams.get('contentType') ?? 'x');

  if (!renderer) {
    return <div>Unable to render</div>;
  }

  if (!client) {
    return <Spinner />;
  }

  return (
    <ElwoodProvider workspaceName="Hello" client={client}>
      <span ref={ref}>
        <Render renderer={renderer} rendererParams={{}} />
      </span>
    </ElwoodProvider>
  );
}
