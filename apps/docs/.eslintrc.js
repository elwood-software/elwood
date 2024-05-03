/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['@elwood/eslint-config/next.js'],
  parser: '@typescript-eslint/parser',
  ignorePatterns: ['next.config.mjs'],
  parserOptions: {
    project: true,
  },
}
