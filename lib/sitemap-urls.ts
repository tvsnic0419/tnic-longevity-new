import type { MetadataRoute } from 'next';
import { hallmarkLibrary } from '@/lib/hallmarks-library';
import { getAllModuleParams } from '@/lib/library-modules';
import { peptideLibrary } from '@/lib/peptides-library';
import { getAllPathwaySlugs } from '@/lib/pathways';
import { getAllComparisonSlugs } from '@/lib/comparisons';
import { getAllBestForSlugs } from '@/lib/best-for';
import { SITE } from '@/lib/site';

// Keep the sitemap's default freshness aligned with the current editorial release.
// Authenticated or utility-only surfaces are excluded below so crawl equity stays
// concentrated on public, search-intent pages.
export const DEFAULT_SITEMAP_LAST_MODIFIED = new Date('2026-09-13T00:00:00.000Z');

export function buildSitemapEntries(lastModified = DEFAULT_SITEMAP_LAST_MODIFIED): MetadataRoute.Sitemap {
  const base = SITE.url;

  const coreRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/library`, lastModified, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${base}/peptides`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/pathways`, lastModified, changeFrequency: 'weekly', priority: 0.88 },
    { url: `${base}/sirtuin-atlas`, lastModified, changeFrequency: 'weekly', priority: 0.86 },
    { url: `${base}/library/delivery-systems`, lastModified, changeFrequency: 'monthly', priority: 0.84 },
    { url: `${base}/library/systems`, lastModified, changeFrequency: 'monthly', priority: 0.84 },
    { url: `${base}/library/top-picks`, lastModified, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${base}/library/compare`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    // Only the base tool URL is listed. Its ?a=&b= variants are ~3,200 valid
    // addresses that all canonicalize back here, so they are deliberately not
    // enumerated — listing them would be doorway-page spam, not coverage.
    { url: `${base}/library/compare/head-to-head`, lastModified, changeFrequency: 'monthly', priority: 0.84 },
    // The whole graded library as one table. High priority: it is the index
    // over every compound deep-dive, so it is the page a crawler should reach
    // earliest to find the other hundred.
    { url: `${base}/library/evidence`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    // Every study the library cites, as one dataset. Sits just under the
    // evidence table: same index role, one level deeper — that table indexes the
    // compounds, this one indexes the literature behind them.
    { url: `${base}/library/trials`, lastModified, changeFrequency: 'weekly', priority: 0.88 },
    { url: `${base}/insights`, lastModified, changeFrequency: 'weekly', priority: 0.86 },
    { url: `${base}/learn`, lastModified, changeFrequency: 'weekly', priority: 0.88 },
    { url: `${base}/faq`, lastModified, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${base}/stacks`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/stacks/lab`, lastModified, changeFrequency: 'weekly', priority: 0.82 },
    { url: `${base}/protocols`, lastModified, changeFrequency: 'weekly', priority: 0.88 },
    { url: `${base}/biohack-100`, lastModified, changeFrequency: 'monthly', priority: 0.86 },
    { url: `${base}/labs`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    // /tools only. The seven `/tools?tab=…` variants used to be listed here as
    // separate entries; they are the same page with a client-side tab
    // preselected, they all carry /tools' <title> and description, and they all
    // declare rel=canonical → /tools. A sitemap entry that the page itself
    // canonicalises away is a contradiction — the sitemap asks for indexing and
    // the page declines it — and eight URLs sharing one title is how a site
    // teaches a crawler that its titles mean nothing.
    { url: `${base}/tools`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/elite-8`, lastModified, changeFrequency: 'monthly', priority: 0.88 },
    { url: `${base}/compound-engine`, lastModified, changeFrequency: 'monthly', priority: 0.82 },
    { url: `${base}/tools/pathway-architect`, lastModified, changeFrequency: 'monthly', priority: 0.82 },
    { url: `${base}/nico`, lastModified, changeFrequency: 'weekly', priority: 0.94 },
    { url: `${base}/best`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/shop`, lastModified, changeFrequency: 'weekly', priority: 0.88 },
    { url: `${base}/products`, lastModified, changeFrequency: 'weekly', priority: 0.87 },
    { url: `${base}/supplement-guides`, lastModified, changeFrequency: 'weekly', priority: 0.96 },
    { url: `${base}/longevity-supplements-guide`, lastModified, changeFrequency: 'weekly', priority: 0.98 },
    { url: `${base}/nad-supplement-guide`, lastModified, changeFrequency: 'weekly', priority: 0.94 },
    { url: `${base}/glynac-supplement-guide`, lastModified, changeFrequency: 'weekly', priority: 0.92 },
    { url: `${base}/berberine-supplement-guide`, lastModified, changeFrequency: 'weekly', priority: 0.86 },
    { url: `${base}/taurine-supplement-guide`, lastModified, changeFrequency: 'weekly', priority: 0.86 },
    { url: `${base}/sulforaphane-supplement-guide`, lastModified, changeFrequency: 'weekly', priority: 0.86 },
    { url: `${base}/spermidine-supplement-guide`, lastModified, changeFrequency: 'weekly', priority: 0.86 },
    // Harm-reduction protocols. High priority because the search intent they
    // serve is currently answered mostly by uncited forum threads, and the
    // smoker page carries a beta-carotene warning worth surfacing.
    { url: `${base}/smoker-defense-stack`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/stimulant-defense-stack`, lastModified, changeFrequency: 'weekly', priority: 0.88 },
    { url: `${base}/brief`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
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

  // The bespoke /hallmarks/<slug> pages are duplicates of the canonical
  // /library/<slug> hallmark deep-dives (which is what seoRoutes.hallmark
  // declares canonical and every internal link points to). They carry a
  // canonical → /library/<slug> and are intentionally omitted from the sitemap
  // so ranking signals consolidate on the one canonical URL.

  const pathwayRoutes = getAllPathwaySlugs().map((slug) => ({
    url: `${base}/pathways/${slug}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
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

  const bestForRoutes = getAllBestForSlugs().map((slug) => ({
    url: `${base}/best/${slug}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.86,
  }));

  return [
    ...coreRoutes,
    ...bestForRoutes,
    ...hallmarkRoutes,
    ...compareRoutes,
    ...moduleRoutes,
    ...peptideRoutes,
    ...pathwayRoutes,
  ];
}
