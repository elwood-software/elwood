export function isServer(): boolean {
  return typeof window === 'undefined';
}

export function isClient(): boolean {
  return !isServer();
}
