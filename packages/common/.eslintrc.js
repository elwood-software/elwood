/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['@elwood/eslint-config/server.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
  env: {
    jest: true,
  },
};
