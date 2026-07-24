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
    // AVIF ahead of WebP: at the byte budget a 2x/3x srcset entry costs, AVIF
    // holds detail and gradients that WebP smears — which is exactly what reads
    // as "soft" on a high-density display. Next content-negotiates and falls
    // back to WebP, then the original, so older clients are unaffected.
    formats: ['image/avif', 'image/webp'],
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

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      // In production Next.js already serves content-hashed /_next/static
      // assets with this exact header. Re-declaring it unconditionally also
      // applied it in `next dev`, where chunk URLs are NOT content-hashed —
      // browsers then kept executing year-old cached JS after every code
      // change (the dev server logs a warning about precisely this).
      ...(process.env.NODE_ENV === 'production'
        ? [
            {
              source: '/_next/static/(.*)',
              headers: [
                {
                  key: 'Cache-Control',
                  value: 'public, max-age=31536000, immutable',
                },
              ],
            },
          ]
        : []),
    ];
  },
};

export default nextConfig;