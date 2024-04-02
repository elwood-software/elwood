import type {Json} from '@elwood/common';
import {toArray} from '@elwood/common';
import type {UseSearchMembersInput} from './use-search-members';

export type KeyFn = (input: Json) => string[];

const keys: Record<'search', KeyFn> = {
  search(input: UseSearchMembersInput) {
    return [
      'members--search',
      toArray(input.path).join('/'),
      input.query,
      input.role ?? '-',
    ];
  },
};

export default keys;
