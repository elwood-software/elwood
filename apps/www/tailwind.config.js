const {theme, plugins} = require('@elwood/ui/tailwind.config.js');
const {resolve, dirname} = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
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
  theme: {
    ...theme,
    extend: {
      ...theme.extend,
      boxShadow: {
        splash: 'var(--splash-shadow)',
      },
    },
  },
  plugins: [...plugins],
};
