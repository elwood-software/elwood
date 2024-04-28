import {useCallback, useEffect, useRef, useState} from 'react';

export function useRenderIframe(): JSX.Element {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(1);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (typeof e.data === 'object') {
        switch (e.data.type) {
          case 'height':
            setHeight(e.data.value.height);
            break;
        }
      }
    }

    window.addEventListener('message', onMessage);

    return function unload() {
      window.removeEventListener('message', onMessage);
    };
  }, []);

  const onLoad = useCallback(() => {
    if (ref.current) {
      ref.current.contentWindow?.postMessage('init', location.origin);
    }
  }, []);

  return (
    <iframe
      ref={ref}
      src="/render/pdf"
      className="w-full h-full border-none"
      onLoad={onLoad}
      style={{height}}
    />
  );
}

export function RenderIframe() {
  return useRenderIframe();
}
