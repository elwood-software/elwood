import type {Json} from '@elwood/common';
import type {UseFollowInput} from './use-follow';
import type {UseFollowsInput} from './use-follows';

export type KeyFn = (input: Json) => string[];

const keys: Record<'get' | 'search', KeyFn> = {
  get(input: UseFollowInput) {
    return ['follow--get', input.type ?? '-', input.assetType, input.assetId];
  },
  search(input: UseFollowsInput) {
    return [
      'follow--search',
      input.type ?? '-',
      input.assetType ?? '-',
      input.assetId ?? '-',
    ];
  },
};

export default keys;
