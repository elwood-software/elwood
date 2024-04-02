import type {Json} from '@elwood/common';
import {type UseGetNodeTreeInput} from './use-get-node-tree';
import {type UseGetNodeInput} from './use-get-node';

export type KeyFn = (input: Json) => string[];

const keys: Record<'tree' | 'get', KeyFn> = {
  tree(input: UseGetNodeTreeInput) {
    return ['nodes--tree', input.path.join('/')];
  },
  get(input: UseGetNodeInput) {
    return ['nodes--get', input.path.join('/')];
  },
};

export default keys;
