import { describe, expect, it } from 'vitest';
import { researchFeed } from './data';
import {
  filterResearchFeed,
  getResearchIntelContext,
  researchCompoundFilters,
  researchHallmarkFilters,
} from './research-intel';

describe('research-intel', () => {
  it('exposes compound and hallmark filter chips from feed', () => {
    expect(researchCompoundFilters.length).toBeGreaterThan(1);
    expect(researchHallmarkFilters.length).toBeGreaterThan(1);
    expect(researchCompoundFilters.some((f) => f.id === 'glynac')).toBe(true);
  });

  it('filters feed by impact and compound', () => {
    const clinical = filterResearchFeed(researchFeed, {
      tag: 'All',
      impact: 'clinical',
      compound: 'all',
      hallmark: 'all',
    });
    expect(clinical.every((r) => r.impact === 'clinical')).toBe(true);

    const glynac = filterResearchFeed(researchFeed, {
      tag: 'All',
      impact: 'all',
      compound: 'glynac',
      hallmark: 'all',
    });
    expect(glynac.length).toBeGreaterThan(0);
    expect(glynac.every((r) => r.relatedHrefs.some((l) => l.href.includes('/compounds/glynac')))).toBe(true);
  });

  it('returns dynamic context per filter state', () => {
    const defaultCtx = getResearchIntelContext({
      tag: 'All',
      impact: 'all',
      compound: 'all',
      hallmark: 'all',
    });
    expect(defaultCtx.what).toContain('feed');

    const clinicalCtx = getResearchIntelContext({
      tag: 'All',
      impact: 'clinical',
      compound: 'all',
      hallmark: 'all',
    });
    expect(clinicalCtx.what).toContain('Human trial');
  });
});