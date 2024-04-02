/* eslint-disable @typescript-eslint/no-unsafe-member-access -- intentional */
/* eslint-disable @typescript-eslint/no-unsafe-assignment -- intentional */
/* eslint-disable @typescript-eslint/no-unsafe-call -- intentional */
/**
 * from https://github.com/apollographql/invariant-packages/blob/main/packages/ts-invariant/src/invariant.ts
 */

import type {Json} from './types';

const genericMessage = 'Invariant Violation';
const {
  setPrototypeOf = function (obj: Json, proto: Json) {
    // eslint-disable-next-line no-proto -- intentional
    obj.__proto__ = proto;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- intentional
    return obj;
  },
} = Object as Json;

export class InvariantError extends Error {
  framesToPop = 1;
  name = genericMessage;
  constructor(message: string | number = genericMessage) {
    super(
      typeof message === 'number'
        ? `${genericMessage}: ${message} (see https://github.com/apollographql/invariant-packages)`
        : message,
    );
    setPrototypeOf(this, InvariantError.prototype);
  }
}

export function invariant(
  condition: unknown,
  message?: string | number,
): asserts condition {
  if (!condition) {
    throw new InvariantError(message);
  }
}
