/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["@elwood/eslint-config/react.js", "plugin:storybook/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
};
