export function noOp<T = void | Promise<void>>(): T {
  return undefined as T;
}
