import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { compounds, researchFeed, safetyNotes } from './data';
import { libraryModules } from './library-modules';
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