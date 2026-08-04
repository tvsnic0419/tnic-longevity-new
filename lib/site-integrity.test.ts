import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { communityPulse, compounds, consumerFAQ, glossary, researchFeed, safetyNotes } from './data';
import { libraryModules } from './library-modules';
import { hallmarkLibrary } from './hallmarks-library';
import { ELITE_8_COMPOUNDS } from './elite-8-data';
import { citationRegistry } from './trust';
import { buildSitemapEntries } from './sitemap-urls';
import { PRIORITY_INDEX_PATHS } from './index-priority';
import { CANONICAL_SITE_URL } from './site';

describe('site data integrity', () => {
  it('every stack compound has a safety profile', () => {
    for (const compound of compounds) {
      expect(
        safetyNotes.some((n) => n.compoundId === compound.id),
        `missing safety profile for ${compound.id}`,
      ).toBe(true);
    }
  });

  it('Tier B library compounds have MDX modules', () => {
    const tierB = ['taurine', 'spermidine', 'pterostilbene'];
    for (const id of tierB) {
      expect(libraryModules.some((m) => m.slug === id && m.category === 'compounds')).toBe(true);
    }
  });

  it('research feed PMIDs are registered in citationRegistry', () => {
    const registryPmids = new Set(citationRegistry.map((c) => c.pmid));
    for (const item of researchFeed) {
      expect(
        registryPmids.has(item.pmid),
        `researchFeed ${item.id} PMID ${item.pmid} missing from citationRegistry`,
      ).toBe(true);
    }
  });

  it('sitemap includes all priority index paths', () => {
    const urls = new Set(buildSitemapEntries().map((e) => new URL(e.url).pathname));
    for (const path of PRIORITY_INDEX_PATHS) {
      expect(urls.has(path), `sitemap missing ${path}`).toBe(true);
    }
  });

  it('every statically-routable app page is present in the sitemap', () => {
    // Walks app/ for directories with a page.tsx, skipping api routes and any
    // dynamic ([slug]) or route-group ((group)) segment — those are either
    // user-generated (excluded on purpose, e.g. /scorecard/[code]) or already
    // enumerated into the sitemap from their own data source (hallmarks,
    // library modules, comparisons, quiz presets, tool tabs). This exists
    // because a page can be real, linked, and crawlable while still being
    // absent from the sitemap purely by omission — that gap has happened
    // more than once (e.g. /about, /hallmarks/[slug], /library/systems).
    function collectStaticPageRoutes(dir: string, base = ''): string[] {
      const entries = readdirSync(dir, { withFileTypes: true });
      const routes = entries.some((e) => e.isFile() && e.name === 'page.tsx') ? [base || '/'] : [];
      for (const entry of entries) {
        if (!entry.isDirectory() || entry.name === 'api') continue;
        if (entry.name.startsWith('[') || entry.name.startsWith('(')) continue;
        routes.push(...collectStaticPageRoutes(resolve(dir, entry.name), `${base}/${entry.name}`));
      }
      return routes;
    }

    // Intentionally sitemap-excluded: the bespoke /hallmarks/<slug> pages are
    // duplicates of the canonical /library/<slug> hallmark deep-dives. They
    // carry <link rel="canonical"> → /library/<slug> and are deliberately left
    // out of the sitemap so ranking signals consolidate on one URL. (The
    // /hallmarks index itself stays in the sitemap.)
    const CANONICALIZED_DUPLICATES = new Set(
      hallmarkLibrary.map((h) => `/hallmarks/${h.slug}`),
    );

    // Intentionally sitemap-excluded: routes that export `robots: { index:
    // false }`. /results renders a questionnaire outcome computed from its
    // query string, so its URL space is combinatorial — listing it would spend
    // crawl budget on parameterised duplicates of one template. It stays
    // `follow`, so its outbound links still pass equity.
    const NOINDEX_ROUTES = new Set(['/results']);

    const staticRoutes = collectStaticPageRoutes(resolve(process.cwd(), 'app'));
    const sitemapPaths = new Set(buildSitemapEntries().map((e) => new URL(e.url).pathname));
    for (const route of staticRoutes) {
      if (CANONICALIZED_DUPLICATES.has(route) || NOINDEX_ROUTES.has(route)) continue;
      expect(sitemapPaths.has(route), `app route ${route} has a page.tsx but is missing from the sitemap`).toBe(true);
    }
  });

  it('Elite 8 OTC compounds link to library routes when available', () => {
    const otcWithLibrary = ELITE_8_COMPOUNDS.filter((c) => !c.isRx && c.libraryHref);
    expect(otcWithLibrary.length).toBeGreaterThanOrEqual(5);
    for (const c of otcWithLibrary) {
      expect(c.libraryHref).toMatch(/^\/library\/compounds\//);
    }
  });

  it('canonical site URL is HTTPS apex only', () => {
    expect(CANONICAL_SITE_URL).toBe('https://tnic.help');
    expect(CANONICAL_SITE_URL.startsWith('https://')).toBe(true);
    expect(CANONICAL_SITE_URL).not.toContain('www.');
  });

  it('sitemap entries use HTTPS apex URLs only', () => {
    for (const entry of buildSitemapEntries()) {
      expect(entry.url.startsWith('https://')).toBe(true);
      expect(entry.url).not.toContain('www.');
      expect(entry.url.startsWith(CANONICAL_SITE_URL)).toBe(true);
    }
  });

  it('vercel.json enforces HSTS preload and www→apex redirect', () => {
    const vercel = JSON.parse(
      readFileSync(resolve(process.cwd(), 'vercel.json'), 'utf8'),
    ) as {
      redirects: { destination: string }[];
      headers: { headers: { key: string; value: string }[] }[];
    };

    const hsts = vercel.headers
      .flatMap((block) => block.headers)
      .find((h) => h.key === 'Strict-Transport-Security');

    expect(hsts?.value).toContain('preload');
    expect(hsts?.value).toContain('includeSubDomains');
    expect(vercel.redirects.some((r) => r.destination.startsWith('https://tnic.help'))).toBe(true);
  });
});

describe('platform counts', () => {
  it('communityPulse derives its metrics from the live registries', () => {
    const byLabel = Object.fromEntries(communityPulse.map((m) => [m.label, m.metric]));
    expect(byLabel['FAQ Answers']).toBe(String(consumerFAQ.length));
    expect(byLabel['Glossary Terms']).toBe(String(glossary.length));
    expect(byLabel['Clinical Studies']).toBe(String(researchFeed.length));
  });
});
