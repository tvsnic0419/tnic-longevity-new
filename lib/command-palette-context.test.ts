import { describe, expect, it } from 'vitest';
import { getPaletteResults } from './command-palette-context';
import { paletteIndex } from './command-palette-index';
import { pathways } from './pathways';

describe('command-palette-context', () => {
  it('returns contextual groups when query is empty', () => {
    const result = getPaletteResults({
      pathname: '/stacks',
      query: '',
      stackIds: ['glynac', 'nmn'],
      recentModules: [],
    });
    expect(result.groups.some((g) => g.label === 'Suggested here')).toBe(true);
    expect(result.groups.some((g) => g.label === 'Your stack')).toBe(true);
    expect(result.flat.some((i) => i.id === 'stack-simulate')).toBe(true);
    expect(result.hubHint?.what).toContain('stack');
  });

  it('includes recent modules in suggestions', () => {
    const result = getPaletteResults({
      pathname: '/dashboard',
      query: '',
      stackIds: [],
      recentModules: [
        {
          slug: 'nmn',
          title: 'NMN',
          href: '/library/compounds/nmn',
          category: 'compounds',
          visitedAt: '2026-06-19',
        },
      ],
    });
    expect(result.flat.some((i) => i.id === 'recent-nmn')).toBe(true);
  });

  it('searches when query is provided', () => {
    const result = getPaletteResults({
      pathname: '/',
      query: 'glynac',
      stackIds: [],
      recentModules: [],
    });
    expect(result.flat.length).toBeGreaterThan(0);
    expect(result.flat.some((i) => i.title.toLowerCase().includes('glynac') || i.keywords.includes('glynac'))).toBe(
      true,
    );
  });
  it('finds a pathway by its registry alias, not a hand-written synonym', () => {
    const result = getPaletteResults({
      pathname: '/',
      query: 'NRF2',
      stackIds: [],
      recentModules: [],
    });

    const pathway = result.flat.find(
      (item) => item.kind === 'pathway' && item.href === '/pathways/nrf2',
    );
    expect(pathway).toBeDefined();
    expect(pathway?.title).toContain('NRF2');
  });

  it('indexes every published pathway, so none is unsearchable', () => {
    const indexed = new Set(
      paletteIndex.filter((i) => i.kind === 'pathway').map((i) => i.href),
    );
    for (const p of pathways) {
      expect(indexed.has(`/pathways/${p.slug}`)).toBe(true);
    }
  });
});
