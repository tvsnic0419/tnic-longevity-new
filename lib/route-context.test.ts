import { describe, expect, it } from 'vitest';
import {
  buildRouteBreadcrumbs,
  getRouteContext,
  resolveHubKey,
} from './route-context';

describe('route-context', () => {
  it('resolves hub keys by longest prefix', () => {
    expect(resolveHubKey('/dashboard')).toBe('dashboard');
    expect(resolveHubKey('/library/compare/nmn-vs-nr')).toBe('compare');
    expect(resolveHubKey('/library/compounds/nmn')).toBe('library');
    expect(resolveHubKey('/faq')).toBe('faq');
    expect(resolveHubKey('/elite-8')).toBe('tools');
  });

  it('builds hallmark and module breadcrumbs', () => {
    const hall = buildRouteBreadcrumbs('/library/genomic-instability');
    expect(hall.map((c) => c.label)).toEqual(['TNiC', 'Library', 'Genomic Instability']);

    const mod = buildRouteBreadcrumbs('/library/compounds/nmn');
    expect(mod[mod.length - 1].label).toContain('NMN');
    expect(mod[2].label).toContain('Compound');
  });

  it('builds compare breadcrumbs', () => {
    const crumbs = buildRouteBreadcrumbs('/library/compare/nmn-vs-nr');
    expect(crumbs.map((c) => c.label)).toEqual([
      'TNiC',
      'Library',
      'Comparisons',
      'NMN vs NR',
    ]);
  });

  it('returns hub next-step for OS routes', () => {
    const ctx = getRouteContext('/stacks');
    expect(ctx.hub?.next.length).toBeGreaterThan(20);
    expect(ctx.breadcrumbs.some((c) => c.label === 'Stacks')).toBe(true);
  });

  it('returns empty breadcrumbs on homepage', () => {
    expect(buildRouteBreadcrumbs('/')).toEqual([]);
    expect(resolveHubKey('/')).toBeNull();
  });
});