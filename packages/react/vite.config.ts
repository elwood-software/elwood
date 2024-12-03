import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import tailwindConfig from "./tailwind.config.mjs";

export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwindcss(tailwindConfig), autoprefixer],
    },
  },
  plugins: [tsconfigPaths()],
});
