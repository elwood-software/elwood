import {defineConfig, type Options} from 'tsup';

export default defineConfig((options: Options) => ({
  format: ['cjs', 'esm'],
  ...options,
}));
