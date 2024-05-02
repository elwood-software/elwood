import {Suspense} from 'react';
import type {Renderer, JsonObject} from '@elwood/common';

export type RenderProps = {
  renderer: Renderer;
  rendererParams: JsonObject;
};

export function Render(props: RenderProps) {
  const Component = props.renderer.component;

  return (
    <Suspense>
      <Component {...props.rendererParams} />
    </Suspense>
  );
}
