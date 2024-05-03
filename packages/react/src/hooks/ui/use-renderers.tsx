import {useProviderContext} from '../use-provider-context';
import {Renderer} from '@elwood/common';

export interface UseRenderedBlobResultData {
  path: string;
  html: string | undefined;
  style: string | undefined;
  content_type: string;
}

export interface UseRenderedBlobInput {
  prefix: string[];
}

export type FindRenderer = (contentType: string) => Renderer | undefined;

export function useRenderers(): [FindRenderer, Renderer[]] {
  const {renderers = []} = useProviderContext();
  const fallback = renderers.find(r => r.fallback);

  return [
    (contentType: string) => {
      return (
        renderers.find(r => r.contentType.includes(contentType)) ?? fallback
      );
    },
    renderers,
  ];
}
