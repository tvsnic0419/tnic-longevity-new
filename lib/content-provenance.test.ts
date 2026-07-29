import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  buildContentProvenance,
  countCitations,
  formatUpdatedDate,
  CONTENT_MAINTAINER,
  METHODOLOGY_HREF,
} from './content-provenance';
import { parseMdx } from './mdx';

describe('content provenance — honest defaults', () => {
  it('uses the editorial maintainer and methodology link by default', () => {
    const p = buildContentProvenance({});
    expect(p.maintainer).toBe(CONTENT_MAINTAINER);
    expect(p.methodologyHref).toBe(METHODOLOGY_HREF);
  });

  it('never fabricates a named medical reviewer or credential', () => {
    // Integrity guardrail: the default attribution must not imply a named clinician.
    expect(CONTENT_MAINTAINER).not.toMatch(/\bMD\b|\bDr\.?\b|\bPhD\b/i);
  });

  it('drops zero/negative citation counts, keeps positive ones', () => {
    expect(buildContentProvenance({ citationCount: 0 }).citationCount).toBeUndefined();
    expect(buildContentProvenance({ citationCount: -3 }).citationCount).toBeUndefined();
    expect(buildContentProvenance({ citationCount: 18 }).citationCount).toBe(18);
  });

  it('carries the evidence tier through', () => {
    expect(buildContentProvenance({ evidenceTier: 'B' }).evidenceTier).toBe('B');
  });
});

describe('countCitations — mirrors the MdxRenderer PMID pattern', () => {
  it('counts unique 7–8 digit PMIDs only', () => {
    expect(countCitations('see PMID 12345678 and PMID: 12345678 again, plus PMID 87654321')).toBe(2);
    expect(countCitations('PMID 12345 is too short')).toBe(0);
    expect(countCitations(null)).toBe(0);
    expect(countCitations(undefined)).toBe(0);
  });
});

describe('formatUpdatedDate', () => {
  it('formats a valid ISO date in UTC', () => {
    const out = formatUpdatedDate('2026-06-16');
    expect(out).toBeTruthy();
    expect(out).toContain('2026');
  });

  it('returns undefined for missing or malformed input', () => {
    expect(formatUpdatedDate(undefined)).toBeUndefined();
    expect(formatUpdatedDate('not-a-date')).toBeUndefined();
  });
});

describe('freshness coverage — every content page can render a "last updated" date', () => {
  const dirs = ['compounds', 'synergies', 'lifestyle', 'guides'];
  for (const dir of dirs) {
    const base = resolve(process.cwd(), 'content', dir);
    const files = readdirSync(base).filter((f) => f.endsWith('.mdx'));
    it.each(files)(`${dir}/%s has a renderable last_updated`, (file) => {
      const { frontmatter } = parseMdx(readFileSync(resolve(base, file), 'utf8'));
      expect(
        formatUpdatedDate(frontmatter.last_updated),
        `${dir}/${file} is missing a valid last_updated`,
      ).toBeTruthy();
    });
  }
});
