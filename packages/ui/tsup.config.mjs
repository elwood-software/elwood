import { defineConfig } from "tsup";
import tailwind from "tailwindcss";
import autoprefixer from "autoprefixer";

export default defineConfig({
  entry: ["./src/index.ts", "./src/index.css"],
  format: ["esm", "cjs"],
  dts: true,
  banner: {
    js: "'use client'",
  },
  external: ["react"],
  splitting: true,
  sourcemap: true,
  clean: true,
  plugins: [tailwind(), autoprefixer()],
});
