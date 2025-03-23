import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/lib/utils.ts"],
  format: ["cjs", "esm"],
  splitting: true,
  sourcemap: true,
  clean: true,
  treeshake: false,
  dts: true,
});
