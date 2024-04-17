/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['@elwood/eslint-config/next.js'],
  parser: '@typescript-eslint/parser',
  ignorePatterns: ['next.config.mjs'],
  parserOptions: {
    project: true,
  },
  overrides: [
    {
      extends: ['plugin:@typescript-eslint/disable-type-checked'],
      files: ['./**/*.js'],
    },
  ],
}
