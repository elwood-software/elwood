import withMarkdoc from '@markdoc/next.js';
import withSearch from './src/markdoc/search.mjs';

const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: isProd ? 'https://docs.elwood.software' : undefined,
  pageExtensions: ['js', 'jsx', 'md', 'ts', 'tsx'],
};

export default withSearch(
  withMarkdoc({schemaPath: './src/markdoc'})(nextConfig),
);
