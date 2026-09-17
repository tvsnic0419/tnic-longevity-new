import type { NextConfig } from 'next';

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,

  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 90],
    minimumCacheTTL: 86400,
    remotePatterns: [
      { protocol: 'https', hostname: 'www.codeage.com', pathname: '/cdn/shop/**' },
      { protocol: 'https', hostname: 'www.avmacol.com', pathname: '/cdn/shop/**' },
      { protocol: 'https', hostname: 'donotage.org', pathname: '/media/**' },
      { protocol: 'https', hostname: 'geronova.com', pathname: '/wp-content/uploads/**' },
    ],
  },

  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', 'framer-motion'],
  },

  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/longevity-supplements-guide',
          destination: '/guides/master-longevity-supplements',
        },
      ],
    };
  },

  async redirects() {
    return [
      { source: '/quiz', destination: '/nico', permanent: true },
      { source: '/quiz/:path*', destination: '/nico', permanent: true },
      { source: '/bio-bible', destination: '/biohack-100', permanent: true },
      {
        source: '/library/compounds/urolithina',
        destination: '/library/compounds/urolithin-a',
        permanent: true,
      },
      {
        source: '/library/compare/urolithina-vs-coq10',
        destination: '/library/compare/urolithin-a-vs-coq10',
        permanent: true,
      },
      {
        source: '/hallmarks/disabled-autophagy',
        destination: '/hallmarks/disabled-macroautophagy',
        permanent: true,
      },
      {
        source: '/library/disabled-autophagy',
        destination: '/library/disabled-macroautophagy',
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },

};

export default nextConfig;
