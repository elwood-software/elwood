import type {LazyExoticComponent, ComponentType} from 'react';
import {JsonObject} from './scalar';

export type RendererProps<Params = JsonObject> = {
  path: string;
  contentType: string;
  params: Params;
  postMessage(type: string, value: JsonObject): void;
  onReady(): void;
  width: number;
  height: number;
};

export type Renderer = {
  contentType: string[];
  iframe?: boolean;
  component: LazyExoticComponent<ComponentType<RendererProps>>;
};
