import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';

const scriptSrcPolicy = isDev
  ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com"
  : "script-src 'self' 'unsafe-inline' https://js.stripe.com";

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    // globalNotFound: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              scriptSrcPolicy,
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "connect-src 'self' https://api.stripe.com",
              'frame-src https://js.stripe.com https://hooks.stripe.com',
              "font-src 'self'",
            ].join('; '),
          },
        ],
      },
      {
        source: '/checkout/order-confirmation/:token',
        headers: [
          { key: 'Referrer-Policy', value: 'no-referrer' },
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, private',
          },
          { key: 'Pragma', value: 'no-cache' },
        ],
      },
    ];
  },
};

export default nextConfig;
