import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  banner: {
    js: "'use client'",
  },
  external: ["react"],
  splitting: true,
  sourcemap: true,
  clean: true,
});
