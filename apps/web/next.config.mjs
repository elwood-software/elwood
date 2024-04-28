/** @type {import('next').NextConfig} */
export default {
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
