import type {Json} from '@elwood/common';
import type {UseFollowInput} from './use-follow';

export type KeyFn = (input: Json) => string[];

const keys: Record<'get', KeyFn> = {
  get(input: UseFollowInput) {
    return ['follow--get', input.type, input.assetType, input.assetId];
  },
};

export default keys;
