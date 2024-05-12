/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [require('node:path').resolve('@elwood/eslint-config/react.js')],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
};
