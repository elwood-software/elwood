import type {LazyExoticComponent, ComponentType} from 'react';
import type {JsonObject, Json} from './scalar';

export type RendererProps<Params extends Json = Json> = {
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
  fill?: boolean;
  fallback?: boolean;
  component: LazyExoticComponent<ComponentType<RendererProps>>;
};

export type RendererHeader = {
  slug: string;
  title: string;
  level: number;
};
