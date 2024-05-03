import type {RendererProps} from '@elwood/common';
import {RenderStorageImage} from '@/hooks/ui/use-storage-image';

export type RenderImageUrl = RendererProps<{}>;

export default function RenderImage(props: RenderImageUrl) {
  return <RenderStorageImage src={props.path} attr={{}} />;
}
