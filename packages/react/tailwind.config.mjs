import { join } from "node:path";
import { fileURLToPath } from "url";
import { dirname } from "path";

import uiTailwindConfig from "../ui/tailwind.config.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('tailwindcss').Config} */
export default {
  ...uiTailwindConfig,
  content: [...uiTailwindConfig.content, join(__dirname, "src/**/*.{ts,tsx}")],
};
