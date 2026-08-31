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
      // The public master-guide pathname is a stable, heavily linked canonical
      // URL. Serve the unchanged implementation from a dedicated internal
      // target so Next resolves it reliably while readers and crawlers retain
      // the original public address and canonical metadata.
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
      // The 3-question starter quiz was retired in favor of the NICO Starter
      // Questionnaire — keep old inbound links working.
      { source: '/quiz', destination: '/nico', permanent: true },
      { source: '/quiz/:path*', destination: '/nico', permanent: true },
      // The Urolithin A deep-dive shipped under a misspelled slug
      // (`urolithina`). Preserve any external links / index entries by
      // permanently redirecting the old paths to the corrected slug.
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
      // Phase 6 taxonomy correction: the hallmark registry originally shipped
      // two entries whose titles were swapped relative to their content. The
      // autophagy-machinery hallmark (ULK1/LC3/mitophagy — canonical "disabled
      // macroautophagy", López-Otín 2023) sat at /hallmarks/disabled-autophagy,
      // while the mTOR/AMPK nutrient-sensing hallmark sat at
      // /hallmarks/disabled-macroautophagy. Content now lives at the correct
      // slugs: disabled-macroautophagy (H5) and deregulated-nutrient-sensing
      // (H12). Permanently redirect the retired autophagy slug so inbound
      // links and index entries land on the macroautophagy content they mean.
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
    // No Cache-Control entry for /_next/static here on purpose. Next.js serves
    // those content-hashed assets with `public, max-age=31536000, immutable`
    // itself and documents that the header cannot be overridden from config,
    // so declaring it was a no-op in production — and in `next dev`, where
    // chunk URLs are NOT content-hashed, it made browsers keep executing
    // stale cached JS after every code change.
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },

};

export default nextConfig;