import type {Json} from '@elwood/common';
import {toArray} from '@elwood/common';
import type {UseActivityInput} from './use-activity';

export type KeyFn = (input: Json) => string[];

const keys: Record<'get', KeyFn> = {
  get(input: UseActivityInput) {
    return ['activity--get'];
  },
};

export default keys;
