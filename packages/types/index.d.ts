// eslint-disable-next-line @typescript-eslint/no-explicit-any -- json scalar
export type JsonScalar = any;
export type JsonObject = Record<string, JsonScalar>;

export type ValuesOf<T> = T[keyof T];
