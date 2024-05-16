const { theme, plugins } = require('@elwood/ui/tailwind.config.js');
const { resolve, dirname } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    resolve(
      dirname(require.resolve('@elwood/ui')),
      './**/*.{js,ts,jsx,tsx,mdx}',
    ),
    resolve(
      dirname(require.resolve('@elwood/react')),
      './**/*.{js,ts,jsx,tsx,mdx}',
    ),
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme,
  plugins: [...plugins],
};
