import { describe, expect, it } from 'vitest';
import { citationRegistry } from './trust';
import {
  buildCitationBibTeX,
  buildCitationJson,
  citationToBibTeX,
} from './citation-export';

describe('citation-export', () => {
  it('generates valid BibTeX for a citation with PMID', () => {
    const entry = citationRegistry[0];
    const bib = citationToBibTeX(entry);
    expect(bib).toContain('@article{');
    expect(bib).toContain(`title = {${entry.title}}`);
    expect(bib).toContain(`year = {${entry.year}}`);
    expect(bib).toContain(`PMID: ${entry.pmid}`);
  });

  it('builds full BibTeX bundle with header', () => {
    const bib = buildCitationBibTeX();
    expect(bib).toContain('TNiC Citation Registry');
    expect(bib).toContain('@article{');
    const entryCount = (bib.match(/@\w+\{/g) ?? []).length;
    expect(entryCount).toBe(citationRegistry.length);
  });

  it('builds JSON bundle with metadata', () => {
    const parsed = JSON.parse(buildCitationJson());
    expect(parsed.source).toBe('TNiC Citation Registry');
    expect(parsed.count).toBe(citationRegistry.length);
    expect(parsed.citations).toHaveLength(citationRegistry.length);
    expect(parsed.exportedAt).toBeTruthy();
  });
});