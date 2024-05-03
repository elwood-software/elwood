import {Suspense, useEffect} from 'react';
import type {Renderer, JsonObject} from '@elwood/common';
import {useMeasure} from 'react-use';

import {cn} from '@elwood/ui';

export type RenderProps = {
  iframe?: boolean;
  path: string;
  contentType: string;
  renderer: Renderer;
  rendererParams: JsonObject;
  className?: string;
};

export function Render(props: RenderProps) {
  const Component = props.renderer.component;
  const [ref, {width, height}] = useMeasure<HTMLDivElement>();
  const className = cn(props.className, {
    'py-4 px-6': !props.renderer.fill,
  });

  function postMessage(type: string, value: JsonObject) {
    window.parent.postMessage({type, value}, location.origin);
  }

  useEffect(() => {
    if (props.iframe) {
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
    }
  }, []);

  useEffect(() => {
    if (props.iframe) {
      postMessage('height', {height});
    }
  }, [height]);

  function onReady() {
    postMessage('ready', {height});
  }

  return (
    <Suspense>
      <div ref={ref} className={className}>
        <Component
          width={width}
          height={height}
          onReady={onReady}
          postMessage={postMessage}
          path={props.path}
          contentType={props.contentType}
          params={props.rendererParams}
        />
      </div>
    </Suspense>
  );
}
