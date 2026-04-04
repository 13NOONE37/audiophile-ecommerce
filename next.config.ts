import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    // globalNotFound: true,
  },
  /* config options here */
};

export default nextConfig;
