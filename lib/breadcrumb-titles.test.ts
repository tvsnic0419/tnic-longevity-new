import { describe, expect, it } from 'vitest';
import {
  comparisonTitles,
  hallmarkTitles,
  libraryModuleTitles,
  libraryCategoryLabels,
  toolLabels,
  peptideTitles,
  guideTitles,
} from './breadcrumb-titles';
import { evidenceComparisons } from './comparisons';
import { hallmarkLibrary } from './hallmarks-library';
import { libraryModules, libraryCategoryMeta } from './library-modules';
import { toolsRegistry } from './registry';
import { peptideLibrary } from './peptides-library';
import { SUPPLEMENT_GUIDES } from './guides';

// These assertions keep the lightweight breadcrumb title maps (imported by the
// always-loaded ContextBar via route-context) exactly in sync with the heavy
// content modules they intentionally avoid importing at runtime. If a compound,
// hallmark, comparison, library category, or tool is added / renamed, the
// corresponding entry in breadcrumb-titles.ts must be updated or this fails.

describe('breadcrumb-titles stays in sync with source data', () => {
  it('comparison titles match comparisons.ts', () => {
    const expected = Object.fromEntries(evidenceComparisons.map((c) => [c.slug, c.title]));
    expect(comparisonTitles).toEqual(expected);
  });

  it('hallmark titles match hallmarks-library.ts', () => {
    const expected = Object.fromEntries(hallmarkLibrary.map((h) => [h.slug, h.title]));
    expect(hallmarkTitles).toEqual(expected);
  });

  it('library module titles match library-modules.ts', () => {
    const expected = Object.fromEntries(
      libraryModules.map((m) => [`${m.category}/${m.slug}`, m.title]),
    );
    expect(libraryModuleTitles).toEqual(expected);
  });

  it('library category labels match library-modules.ts', () => {
    const expected = Object.fromEntries(
      Object.entries(libraryCategoryMeta).map(([k, v]) => [k, v.label]),
    );
    expect(libraryCategoryLabels).toEqual(expected);
  });

  it('tool labels match registry.ts', () => {
    const expected = Object.fromEntries(toolsRegistry.map((t) => [t.id, t.label]));
    expect(toolLabels).toEqual(expected);
  });

  it('peptide titles match peptides-library.ts', () => {
    const expected = Object.fromEntries(peptideLibrary.map((p) => [p.slug, p.name]));
    expect(peptideTitles).toEqual(expected);
  });

  it('guide titles match the supplement-guide registry (guides.ts)', () => {
    const expected = Object.fromEntries(SUPPLEMENT_GUIDES.map((g) => [g.href, g.label]));
    expect(guideTitles).toEqual(expected);
  });
});
