import { NextConfig } from 'next';

const config: NextConfig = {
  output: 'export',
  env: {
    NYT_API_KEY: process.env.NYT_API_KEY,
  },
  async rewrites() {
    return [
      {
        source: '/api/news/:path*',
        destination: 'https://api.nytimes.com/svc/archive/v1/:path*',
      },
    ];
  },
};

export default config;
