/* eslint-disable no-undef -- intentional */
const {theme, plugins} = require('@elwood/ui');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme,
  plugins,
};
