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
      animation: {
        grid: 'grid 15s linear infinite',
      },
      keyframes: {
        grid: {
          '0%': {transform: 'translateY(-50%)'},
          '100%': {transform: 'translateY(0)'},
        },
      },
    },
  },
  plugins: [...plugins],
};
