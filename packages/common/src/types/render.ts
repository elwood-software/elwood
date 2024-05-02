import type {LazyExoticComponent, ComponentType} from 'react';

export type Renderer = {
  contentType: string[];
  iframe?: boolean;
  component: LazyExoticComponent<ComponentType>;
};
