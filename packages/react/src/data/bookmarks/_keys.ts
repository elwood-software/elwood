import type {Json} from '@elwood/common';
import type {UseBookmarkInput} from './use-bookmark';

export type KeyFn = (input: Json) => string[];

const keys: Record<'get', KeyFn> = {
  get(input: UseBookmarkInput) {
    return ['bookmarks--get', input.assetType, input.assetId];
  },
};

export default keys;
