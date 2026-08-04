import type { MetadataRoute } from 'next';
import { hallmarkLibrary } from '@/lib/hallmarks-library';
import { getAllModuleParams } from '@/lib/library-modules';
import { peptideLibrary } from '@/lib/peptides-library';
import { getAllComparisonSlugs } from '@/lib/comparisons';
import { toolsRegistry } from '@/lib/registry';
import { SITE } from '@/lib/site';

export const DEFAULT_SITEMAP_LAST_MODIFIED = new Date('2026-07-05T00:00:00.000Z');

export function buildSitemapEntries(lastModified = DEFAULT_SITEMAP_LAST_MODIFIED): MetadataRoute.Sitemap {
  const base = SITE.url;

  const coreRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/library`, lastModified, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${base}/peptides`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/library/delivery-systems`, lastModified, changeFrequency: 'monthly', priority: 0.84 },
    { url: `${base}/library/systems`, lastModified, changeFrequency: 'monthly', priority: 0.84 },
    { url: `${base}/library/top-picks`, lastModified, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${base}/library/compare`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/learn`, lastModified, changeFrequency: 'weekly', priority: 0.88 },
    { url: `${base}/faq`, lastModified, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${base}/stacks`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/labs`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/tools`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/elite-8`, lastModified, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${base}/compound-engine`, lastModified, changeFrequency: 'monthly', priority: 0.82 },
    { url: `${base}/dashboard`, lastModified, changeFrequency: 'weekly', priority: 0.92 },
    { url: `${base}/nico`, lastModified, changeFrequency: 'weekly', priority: 0.94 },
    { url: `${base}/shop`, lastModified, changeFrequency: 'weekly', priority: 0.88 },
    { url: `${base}/products`, lastModified, changeFrequency: 'weekly', priority: 0.87 },
    { url: `${base}/supplement-guides`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/longevity-supplements-guide`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/nad-supplement-guide`, lastModified, changeFrequency: 'weekly', priority: 0.88 },
    { url: `${base}/glynac-supplement-guide`, lastModified, changeFrequency: 'weekly', priority: 0.88 },
    { url: `${base}/berberine-supplement-guide`, lastModified, changeFrequency: 'weekly', priority: 0.86 },
    { url: `${base}/taurine-supplement-guide`, lastModified, changeFrequency: 'weekly', priority: 0.86 },
    { url: `${base}/sulforaphane-supplement-guide`, lastModified, changeFrequency: 'weekly', priority: 0.86 },
    { url: `${base}/spermidine-supplement-guide`, lastModified, changeFrequency: 'weekly', priority: 0.86 },
    { url: `${base}/brief`, lastModified, changeFrequency: 'weekly', priority: 0.82 },
    { url: `${base}/brief/feed.xml`, lastModified, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/brief/feed.json`, lastModified, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/contact`, lastModified, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${base}/partnerships`, lastModified, changeFrequency: 'monthly', priority: 0.74 },
    { url: `${base}/site-map`, lastModified, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${base}/about`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/bio-age`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/club`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/hallmarks`, lastModified, changeFrequency: 'weekly', priority: 0.88 },
    { url: `${base}/trust`, lastModified, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/trust/methodology`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/trust/disclaimers`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/trust/sponsorship`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/trust/journey`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/trust/updates`, lastModified, changeFrequency: 'weekly', priority: 0.65 },
    { url: `${base}/privacy`, lastModified, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/terms`, lastModified, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/health-data`, lastModified, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/editorial-policy`, lastModified, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/corrections`, lastModified, changeFrequency: 'monthly', priority: 0.5 },
  ];

  const hallmarkRoutes = hallmarkLibrary.map((h) => ({
    url: `${base}/library/${h.slug}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }));

  const hallmarkDeepDiveRoutes = hallmarkLibrary.map((h) => ({
    url: `${base}/hallmarks/${h.slug}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.83,
  }));

  const compareRoutes = getAllComparisonSlugs().map((slug) => ({
    url: `${base}/library/compare/${slug}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.86,
  }));

  const moduleRoutes = getAllModuleParams().map(({ slug: category, moduleSlug }) => ({
    url: `${base}/library/${category}/${moduleSlug}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.88,
  }));

  const peptideRoutes = peptideLibrary.map((p) => ({
    url: `${base}/peptides/${p.slug}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }));

  const toolTabRoutes = toolsRegistry.map((t) => ({
    url: `${base}${t.href}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.82,
  }));

  return [
    ...coreRoutes,
    ...toolTabRoutes,
    ...hallmarkRoutes,
    ...hallmarkDeepDiveRoutes,
    ...compareRoutes,
    ...moduleRoutes,
    ...peptideRoutes,
  ];
}
