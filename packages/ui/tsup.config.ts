import {defineConfig, type Options} from 'tsup';

export default defineConfig((options: Options) => ({
  banner: {
    js: "'use client'",
  },
  external: ['react'],
  ...options,
}));
