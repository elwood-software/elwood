import type {JsonObject} from '@elwood/common';
import {Spinner} from '@elwood/ui';
import {useCallback, useEffect, useRef, useState} from 'react';

export type UseRenderIframeInput = {
  src: string;
  onMessage?(type: string, data: JsonObject): void;
};

export function useRenderIframe(input: UseRenderIframeInput): JSX.Element {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(1);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (typeof e.data === 'object') {
        switch (e.data.type) {
          case 'height':
            setHeight(e.data.value.height);
            break;
        }
      }

      if (input.onMessage) {
        input.onMessage(e.data.type, e.data.value);
      }
    }

    window.addEventListener('message', onMessage);

    return function unload() {
      window.removeEventListener('message', onMessage);
    };
  }, []);

  const onLoad = useCallback(() => {
    if (ref.current) {
      setIsReady(true);
      ref.current.contentWindow?.postMessage('init', location.origin);
    }
  }, []);

  return (
    <>
      <iframe
        ref={ref}
        src={input.src}
        className="w-full h-full border-none min-h-10"
        onLoad={onLoad}
        style={{height}}
      />
    </>
  );
}

export function RenderIframe(input: UseRenderIframeInput) {
  return useRenderIframe(input);
}
