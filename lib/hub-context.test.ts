import { describe, expect, it } from 'vitest';
import {
  getCompareContext,
  getHallmarkContext,
  getHubContext,
  getModuleContext,
  getToolContext,
  getTrustPageContext,
  getTrustTabContext,
  hubContexts,
} from './hub-context';
import { libraryModules } from './library-modules';
import { evidenceComparisons } from './comparisons';
import { hallmarkLibrary } from './hallmarks-library';

describe('hub-context', () => {
  it('defines context for all OS hubs', () => {
    const keys = Object.keys(hubContexts);
    expect(keys.length).toBeGreaterThanOrEqual(10);
    for (const key of keys) {
      const ctx = getHubContext(key as keyof typeof hubContexts);
      expect(ctx.what.length).toBeGreaterThan(30);
      expect(ctx.why.length).toBeGreaterThan(30);
      expect(ctx.next.length).toBeGreaterThan(20);
      expect(ctx.theme).toBeTruthy();
    }
  });

  it('returns tool-specific context', () => {
    const ctx = getToolContext('simulator');
    expect(ctx.what).toContain('synergy');
  });

  it('returns module context for every library module', () => {
    for (const mod of libraryModules) {
      const ctx = getModuleContext(mod);
      expect(ctx.what).toBeTruthy();
      expect(ctx.why).toBeTruthy();
      expect(ctx.next).toBeTruthy();
    }
  });

  it('returns trust tab and page context', () => {
    const tabCtx = getTrustTabContext('evidence');
    expect(tabCtx.what).toContain('Tier');
    const pageCtx = getTrustPageContext('methodology');
    expect(pageCtx.what).toContain('methodology');
  });

  it('defines context for trust, faq, contact, and delivery pages', () => {
    expect(getHubContext('trust').theme).toBe('emerald');
    expect(getHubContext('faq').what).toContain('curated answers');
    expect(getHubContext('contact').what).toContain('contact');
    expect(getHubContext('deliverySystems').what).toContain('lipid');
  });

  it('returns hallmark and compare context', () => {
    const h = hallmarkLibrary[0];
    const hallCtx = getHallmarkContext(h);
    expect(hallCtx.why).toContain(h.whyItMatters.slice(0, 20));
    expect(hallCtx.what).toContain(h.title);

    const comp = evidenceComparisons[0];
    const compCtx = getCompareContext(comp);
    expect(compCtx.what).toContain(comp.labelA);
  });
});