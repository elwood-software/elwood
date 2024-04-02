import type {Json} from './types';

export function toArray<A extends Collection<unknown> | null | undefined>(
  ary: A,
): TypeOfCollection<A>[] {
  if (!Array.isArray(ary)) {
    return [];
  }

  return ary as TypeOfCollection<A>[];
}

// copyright https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/underscore/index.d.ts
interface List<T> {
  [index: number]: T;
  length: number;
}

type Dictionary<T> = Record<string, T>;

type Collection<T> = List<T> | Dictionary<T>;

type TypeOfList<V> = V extends never
  ? Json
  : V extends List<infer T>
    ? T
    : never;

type TypeOfDictionary<V, TDefault = never> = V extends never
  ? Json
  : V extends Dictionary<infer T>
    ? T
    : TDefault;

type TypeOfCollection<V, TObjectDefault = never> =
  V extends List<Json> ? TypeOfList<V> : TypeOfDictionary<V, TObjectDefault>;
