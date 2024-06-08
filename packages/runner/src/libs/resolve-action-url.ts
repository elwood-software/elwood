import {basename, dirname} from 'node:path';
import {fromFileUrl} from '@std/path';

import {RunnerDefinition} from '../types.ts';

export type ResolveActionUrlOptions = {
  stdPrefix: string;
};

// deno-lint-ignore require-await -- this is a placeholder for future expansion where we might need to fetch remote action maps
export async function resolveActionUrl(
  action: RunnerDefinition.Step['action'],
  options: ResolveActionUrlOptions,
): Promise<URL> {
  if (action.includes('://')) {
    return new URL(action);
  }

  const base = basename(action);
  const ext = action.endsWith('.ts') ? '' : '.ts';

  return new URL(`${options.stdPrefix}/${dirname(action)}/${base}${ext}`);
}

export function resolveActionUrlForDenoCommand(url: URL): string {
  switch (url.protocol) {
    case 'file:':
      return fromFileUrl(url);
    case 'http:':
    case 'https:':
      return url.href;
    default:
      throw new Error(`Unsupported protocol: ${url.protocol}`);
  }
}
