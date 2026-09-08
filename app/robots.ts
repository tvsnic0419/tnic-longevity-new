import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/biohack-100/read', '/biohack-100/unlock'],
    },
    sitemap: 'https://tnic.help/sitemap.xml',
    host: 'https://tnic.help',
  };
}
