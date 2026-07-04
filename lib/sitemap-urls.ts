import type { MetadataRoute } from 'next';
import { hallmarkLibrary } from '@/lib/hallmarks-library';
import { getAllModuleParams } from '@/lib/library-modules';
import { getAllComparisonSlugs } from '@/lib/comparisons';
import { PRESET_KEYS } from '@/lib/quiz-share';
import { toolsRegistry } from '@/lib/registry';
import { SITE } from '@/lib/site';

export function buildSitemapEntries(lastModified = new Date()): MetadataRoute.Sitemap {
  const base = SITE.url;

  const coreRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/library`, lastModified, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${base}/library/delivery-systems`, lastModified, changeFrequency: 'monthly', priority: 0.84 },
    { url: `${base}/library/compare`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/learn`, lastModified, changeFrequency: 'weekly', priority: 0.88 },
    { url: `${base}/faq`, lastModified, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${base}/stacks`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/labs`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/tools`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/elite-8`, lastModified, changeFrequency: 'monthly', priority: 0.90 },
    { url: `${base}/dashboard`, lastModified, changeFrequency: 'weekly', priority: 0.92 },
    { url: `${base}/quiz`, lastModified, changeFrequency: 'weekly', priority: 0.94 },
    { url: `${base}/shop`, lastModified, changeFrequency: 'weekly', priority: 0.88 },
    { url: `${base}/products`, lastModified, changeFrequency: 'weekly', priority: 0.87 },
    { url: `${base}/brief`, lastModified, changeFrequency: 'weekly', priority: 0.82 },
    { url: `${base}/brief/feed.xml`, lastModified, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/brief/feed.json`, lastModified, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/contact`, lastModified, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${base}/site-map`, lastModified, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${base}/trust`, lastModified, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/trust/methodology`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/trust/disclaimers`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/trust/journey`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/trust/updates`, lastModified, changeFrequency: 'weekly', priority: 0.65 },
  ];

  const hallmarkRoutes = hallmarkLibrary.map((h) => ({
    url: `${base}/library/${h.slug}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }));

  const TOP_COMPARISONS = new Set([
    'nmn-vs-nr',
    'berberine-vs-metformin',
    'fisetin-vs-quercetin',
    'taurine-vs-nmn',
    'urolithina-vs-coq10',
    'sulforaphane-vs-curcumin',
    'rapamycin-vs-metformin',
    'coq10-vs-ubiquinol',
    'omega3-vs-krill-oil',
  ]);

  const compareRoutes = getAllComparisonSlugs().map((slug) => ({
    url: `${base}/library/compare/${slug}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: TOP_COMPARISONS.has(slug) ? 0.92 : 0.86,
  }));

  const TOP_COMPOUNDS = new Set(['nmn', 'glynac', 'sulforaphane', 'taurine', 'berberine', 'spermidine', 'cakg', 'urolithina', 'pterostilbene', 'rapamycin', 'coq10', 'omega3', 'fisetin', 'rala']);

  const moduleRoutes = getAllModuleParams().map(({ slug: category, moduleSlug }) => ({
    url: `${base}/library/${category}/${moduleSlug}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: category === 'compounds' && TOP_COMPOUNDS.has(moduleSlug) ? 0.93 : 0.88,
  }));

  const longevityGuideRoute = [
    { url: `${base}/supplement-guides`, lastModified, changeFrequency: 'weekly' as const, priority: 0.91 },
    { url: `${base}/longevity-supplements-guide`, lastModified, changeFrequency: 'monthly' as const, priority: 0.92 },
    { url: `${base}/nad-supplement-guide`, lastModified, changeFrequency: 'monthly' as const, priority: 0.92 },
    { url: `${base}/glynac-supplement-guide`, lastModified, changeFrequency: 'monthly' as const, priority: 0.91 },
    { url: `${base}/berberine-supplement-guide`, lastModified, changeFrequency: 'monthly' as const, priority: 0.91 },
    { url: `${base}/taurine-supplement-guide`, lastModified, changeFrequency: 'monthly' as const, priority: 0.91 },
    { url: `${base}/sulforaphane-supplement-guide`, lastModified, changeFrequency: 'monthly' as const, priority: 0.90 },
    { url: `${base}/spermidine-supplement-guide`, lastModified, changeFrequency: 'monthly' as const, priority: 0.90 },
  ];

  const quizShareRoutes = PRESET_KEYS.map((preset) => ({
    url: `${base}/quiz/share/${preset}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const toolTabRoutes = toolsRegistry.map((t) => ({
    url: `${base}${t.href}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.82,
  }));

  return [...coreRoutes, ...longevityGuideRoute, ...quizShareRoutes, ...toolTabRoutes, ...hallmarkRoutes, ...compareRoutes, ...moduleRoutes];
}