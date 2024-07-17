const assetPrefix =
  process.env.ASSET_PREFIX ?? process.env.VERCEL_URL ?? undefined;

/** @type {import('next').NextConfig} */
export default {
  assetPrefix,
  reactStrictMode: true,
  transpilePackages: [
    '@elwood/common',
    '@elwood/react',
    '@elwood/js',
    '@elwood/ui',
  ],
  webpack(config) {
    config.resolve.alias.canvas = false;
    return config;
  },
};
