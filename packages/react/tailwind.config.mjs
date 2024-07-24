/* eslint-disable no-undef -- intentional */
const {theme, plugins} = require('@elwood/ui');

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme,
  plugins,
};
