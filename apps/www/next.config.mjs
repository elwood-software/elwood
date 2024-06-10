/** @type {import('next').NextConfig} */
export default {
  reactStrictMode: true,
  transpilePackages: ['@elwood/common', '@elwood/js', '@elwood/ui'],
  webpack(config) {
    config.resolve.alias.canvas = false;
    return config;
  },

  async rewrites() {
    return [
      {
        has: [
          {
            type: 'host',
            value: 'elwood.run',
          },
        ],
        source: '/:path*',
        destination: '/run/:path*',
      },
      {
        has: [
          {
            type: 'host',
            value: 'elwood.run',
          },
        ],
        source: '/',
        destination: '/run',
      },
      {
        has: [
          {
            type: 'host',
            value: 'elwood.run',
          },
        ],
        source: '/schema.json',
        destination:
          'https://raw.githubusercontent.com/elwood-software/run/main/schema.json',
      },
      {
        source: '/db/latest.json',
        destination:
          'https://github.com/elwood-software/db/raw/main/versions/latest.json',
      },
      {
        source: '/db/v:version',
        destination:
          'https://github.com/elwood-software/db/raw/main/versions/:version',
      },
      {
        source: '/docs',
        destination: 'https://elwood-docs.vercel.app/docs',
      },
      {
        source: '/docs/:path*',
        destination: 'https://elwood-docs.vercel.app/docs/:path*',
      },
    ];
  },
};
