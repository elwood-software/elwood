const root = require('../../prettier.config')

/** @type {import('prettier').Options} */
module.exports = {
  ...root,
  plugins: ['prettier-plugin-tailwindcss'],
}
