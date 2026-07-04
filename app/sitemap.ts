import type { MetadataRoute } from 'next';
import { buildSitemapEntries } from '@/lib/sitemap-urls';

/** Dynamic sitemap — single source of truth via buildSitemapEntries() */
export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemapEntries(new Date());
}