import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { compounds, researchFeed, safetyNotes } from './data';
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

    // Intentionally unlisted: /sheepeople is a deliberately "secret" back page.
    // It carries robots noindex/nofollow and is kept out of the sitemap and nav
    // on purpose — reachable only by its URL and one discreet footer link — so
    // it must be excluded from the "every page must be sitemapped" guarantee.
    const UNLISTED_BY_DESIGN = new Set(['/sheepeople']);

    const staticRoutes = collectStaticPageRoutes(resolve(process.cwd(), 'app'));
    const sitemapPaths = new Set(buildSitemapEntries().map((e) => new URL(e.url).pathname));
    for (const route of staticRoutes) {
      if (CANONICALIZED_DUPLICATES.has(route) || UNLISTED_BY_DESIGN.has(route)) continue;
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

  it('every top-level route renders the shared site chrome (Nav + Footer)', () => {
    // The root layout renders only {children} — Nav/ContextBar/Footer come from
    // SubPageLayout (used directly, or via a nested app/<hub>/layout.tsx) or from
    // a page importing Nav itself. A top-level page that does none of these
    // renders with NO site navigation — a dead end. This happened to /about,
    // /privacy, /supplement-guides, /partnerships and others; this guard fails
    // if any single-segment route regresses to chrome-less.
    const appDir = resolve(process.cwd(), 'app');
    const chromeless: string[] = [];
    for (const entry of readdirSync(appDir, { withFileTypes: true })) {
      if (!entry.isDirectory() || entry.name.startsWith('(') || entry.name === 'api') continue;
      const dir = resolve(appDir, entry.name);
      const files = readdirSync(dir);
      if (!files.includes('page.tsx')) continue;
      // Chrome via an own nested layout wrapping SubPageLayout.
      if (files.includes('layout.tsx')) continue;
      const src = readFileSync(resolve(dir, 'page.tsx'), 'utf8');
      // Chrome via SubPageLayout, a direct Nav import, or the TrustPageTemplate
      // (which renders SubPageLayout when used standalone on a top-level route).
      if (/SubPageLayout|from '@\/components\/Nav'|TrustPageTemplate/.test(src)) continue;
      chromeless.push(`/${entry.name}`);
    }
    expect(chromeless, `top-level routes missing site chrome: ${chromeless.join(', ')}`).toEqual([]);
  });

  it('the shareable scorecard states the live compound count, not a stale literal', () => {
    // The /scorecard/[code] card is a viral share surface: a hardcoded library
    // size (it once read "14 compounds") silently rots as the library grows and
    // undersells the platform to every visitor who lands on a shared card. It
    // must derive from COMPOUND_COUNT like the hero, library, stacks, labs and
    // trust hubs already do — so the number can never drift below reality again.
    const src = readFileSync(
      resolve(process.cwd(), 'app/scorecard/[code]/page.tsx'),
      'utf8',
    );
    expect(src).toContain('COMPOUND_COUNT');
    expect(src).not.toMatch(/\b\d+ compounds, 12 hallmarks/);
  });

  it('the hallmarks hub derives its stat rail, not stale literals', () => {
    // The /hallmarks hero once hand-rolled a stat band claiming "150+" PMIDs and
    // "9" Tier A/B compounds — numbers that drift the moment the library grows.
    // The rail must derive from the live registries (hallmarkLibrary length,
    // citationRegistry length, and a Tier A/B compound count computed from the
    // hallmark interventions) so it can never understate what's published.
    const src = readFileSync(
      resolve(process.cwd(), 'app/hallmarks/page.tsx'),
      'utf8',
    );
    expect(src).toContain('citationRegistry.length');
    expect(src).toContain('hallmarkLibrary.length');
    // The old hardcoded band rendered "150+" and a bare "9" as font-black stats.
    expect(src).not.toMatch(/>150\+</);
    expect(src).not.toMatch(/text-4xl font-black/);
  });

  it('the supplement-guides hub preserves its decision and safety reading layer', () => {
    // This high-intent index previously jumped from its hero straight to cards.
    // Keep the source-backed reading framework, visible safety checkpoint, and
    // FAQPage metadata in place so it remains decision support, not a thin list
    // of affiliate-adjacent links.
    const src = readFileSync(
      resolve(process.cwd(), 'app/supplement-guides/page.tsx'),
      'utf8',
    );

    expect(src).toContain('Move from a question to a well-framed decision.');
    expect(src).toContain('Evidence, identity, and personal safety are three different checks.');
    expect(src).toContain('GUIDE_SELECTION_FAQS');
    expect(src).toContain('buildFaqPageSchema');
    expect(src).toContain('https://ods.od.nih.gov/factsheets/WYNTK-Consumer/');
    expect(src).toContain('https://www.fda.gov/consumers/consumer-updates/mixing-medications-and-dietary-supplements-can-endanger-your-health');
    expect(src).toContain('https://ods.od.nih.gov/Research/Dietary_Supplement_Label_Database.aspx');
  });

  it('the stack-to-shop journey preserves its readiness, preset, and buyer-review layers', () => {
    // This is the highest-intent conversion path: an active stack should make
    // its buyer-grade next step obvious, while product verification remains
    // transparent and locally private. Pin the source landmarks so a later
    // visual refactor cannot quietly collapse it back to an unmeasured link row.
    const stackHub = readFileSync(resolve(process.cwd(), 'components/stacks/StacksLibrary.tsx'), 'utf8');
    const stackBuilder = readFileSync(resolve(process.cwd(), 'components/stacks/DynamicStackBuilder.tsx'), 'utf8');
    const shop = readFileSync(resolve(process.cwd(), 'components/shop/ProtocolShopPanel.tsx'), 'utf8');

    expect(stackHub).toContain('parseStackParam');
    expect(stackHub).toContain('if (!isAlreadyLoaded) setSelected(incomingStack)');
    expect(stackBuilder).toContain('Stack readiness');
    expect(stackBuilder).toContain('Verify your active stack');
    expect(stackBuilder).toContain('ANALYTICS_EVENTS.stackShopOpened');
    expect(shop).toContain('Choose a stack by the question you want to inspect.');
    expect(shop).toContain('Keep the checklist with the stack you are evaluating.');
    expect(shop).toContain('window.localStorage.setItem(checklistKey, JSON.stringify(next))');
    expect(shop).toContain('ANALYTICS_EVENTS.shopPresetLoaded');
    expect(shop).toContain('ANALYTICS_EVENTS.shopChecklistProgress');
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