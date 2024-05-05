/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    '@elwood/eslint-config/react.js',
    '@elwood/eslint-config/storybook.js',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
};
