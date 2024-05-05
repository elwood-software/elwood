/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['plugin:storybook/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
};
