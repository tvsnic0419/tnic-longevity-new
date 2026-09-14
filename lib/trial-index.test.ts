import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { trialIndex, trialIndexStats, compoundsWithoutTrialTable } from './trial-index.server';
import { classifyDesign, classifyEvidenceBase, parseTrialRows } from './trial-index';
import { compoundModules } from './library-modules';

/**
 * Guardrail for the trial index.
 *
 * The index asserts something strong — that 363 specific study rows, with their
 * designs, sample sizes, durations and outcomes, are what the library's own
 * deep-dives say. The test that matters is therefore not "does it parse" but
 * "is every cell it publishes actually present, verbatim, in the file it names."
 * That is what `traces verbatim` below checks, for every string of every row.
 *
 * If that test fails, the index is claiming the library says something it does
 * not. Fix the parser — never the assertion.
 */

const COMPOUNDS_DIR = resolve(process.cwd(), 'content/compounds');

/**
 * Floor, not a target. The index is derived, so this only moves when the
 * underlying deep-dives gain or lose evidence tables — and it ratchets UP as
 * coverage improves, the same convention as EXPECTED_COMPOUND_COUNT and
 * AUTHORED_EDGE_FLOOR. A drop below it means rows silently stopped parsing.
 */
const TRIAL_ROW_FLOOR = 350;
const COMPOUND_COVERAGE_FLOOR = 85;

const rows = trialIndex();
const stats = trialIndexStats();

describe('trial index — integrity', () => {
  it('extracts a substantial, non-regressing set of rows', () => {
    expect(rows.length).toBeGreaterThanOrEqual(TRIAL_ROW_FLOOR);
    expect(stats.compoundsCovered).toBeGreaterThanOrEqual(COMPOUND_COVERAGE_FLOOR);
    expect(stats.compoundsTotal).toBe(compoundModules.length);
  });

  it('traces verbatim to the compound deep-dive it names', () => {
    // The whole credibility claim of this dataset, checked row by row.
    const sources = new Map<string, string>();
    const offenders: string[] = [];

    for (const row of rows) {
      const mod = compoundModules.find((m) => m.slug === row.compoundSlug);
      expect(mod, `row ${row.id} names a compound that does not exist`).toBeTruthy();

      const key = mod!.mdxSlug;
      if (!sources.has(key)) {
        sources.set(key, readFileSync(resolve(COMPOUNDS_DIR, `${key}.mdx`), 'utf8'));
      }
      const src = sources.get(key)!;

      for (const [field, value] of Object.entries({
        citation: row.citation,
        design: row.design,
        population: row.population,
        participants: row.participants,
        duration: row.duration,
        dose: row.dose,
        outcome: row.outcome,
        tierLabel: row.tierLabel,
      })) {
        if (value == null) continue;
        if (!src.includes(value)) offenders.push(`${row.id}.${field}: ${JSON.stringify(value)}`);
      }
    }

    expect(offenders, `values not found verbatim in their source file:\n${offenders.join('\n')}`).toEqual([]);
  });

  it('never publishes a malformed PMID', () => {
    for (const row of rows) {
      if (row.pmid === null) continue;
      expect(row.pmid, `${row.id} has a non-PMID value`).toMatch(/^\d{7,8}$/);
    }
    // Most rows cite one; a floor keeps a parser regression from silently
    // dropping the links that make the index checkable.
    expect(stats.withPmid).toBeGreaterThanOrEqual(280);
  });

  it('only reports a letter tier the source row actually leads with', () => {
    for (const row of rows) {
      if (row.tier === null) continue;
      expect(row.tierLabel, `${row.id} has a tier with no label`).toBeTruthy();
      expect(row.tierLabel!.startsWith(row.tier)).toBe(true);
    }
  });

  it('gives every year a plausible value or none at all', () => {
    const nextYear = new Date().getFullYear() + 1;
    for (const row of rows) {
      if (row.year === null) continue;
      expect(row.year, `${row.id} year out of range`).toBeGreaterThanOrEqual(1950);
      expect(row.year).toBeLessThanOrEqual(nextYear);
    }
  });

  it('accounts for every compound exactly once — covered or listed as uncovered', () => {
    const uncovered = compoundsWithoutTrialTable();
    expect(stats.compoundsCovered + uncovered.length).toBe(compoundModules.length);
    // Uncovered modules are reported, not quietly dropped.
    for (const u of uncovered) {
      expect(rows.some((r) => r.compoundSlug === u.slug)).toBe(false);
    }
  });
});

describe('trial index — classification is conservative', () => {
  it('does not call a non-human design human', () => {
    for (const row of rows) {
      if (row.evidenceBase !== 'human') continue;
      const text = [row.design, row.population].filter(Boolean).join(' ');
      expect(
        /\b(mouse|mice|murine|rats?|in vitro|preclinical)\b/i.test(text),
        `${row.id} classified human but reads preclinical: ${text}`,
      ).toBe(false);
    }
  });

  it('classifies a design naming both people and animals as mixed, not human', () => {
    expect(classifyEvidenceBase('Multi-species + human association', null)).toBe('mixed');
    expect(classifyEvidenceBase('Human fibroblast culture', null)).toBe('mixed');
  });

  it('falls back rather than guessing', () => {
    expect(classifyDesign(null)).toBe('unclassified');
    expect(classifyDesign('NR')).toBe('unclassified');
    expect(classifyDesign('Various')).toBe('unclassified');
    expect(classifyEvidenceBase(null, null)).toBe('unclear');
    expect(classifyEvidenceBase('Dose-response', null)).toBe('unclear');
  });

  it('reads a randomised crossover as randomised, not merely crossover', () => {
    expect(classifyDesign('RCT, crossover')).toBe('rct');
    expect(classifyDesign('Crossover')).toBe('crossover');
  });

  it('reads a mechanistic review as a review', () => {
    expect(classifyDesign('Mechanistic review')).toBe('review');
    expect(classifyDesign('Mechanistic')).toBe('mechanistic');
  });

  it('does not mistake "metabolic" for a meta-analysis', () => {
    expect(classifyDesign('RCT, metabolic syndrome')).toBe('rct');
    expect(classifyDesign('Meta of 9 RCTs')).toBe('meta-analysis');
  });
});

describe('trial index — parser', () => {
  const ctx = { slug: 'x', title: 'X', tier: 'B' as const, href: '/x' };

  it('ignores a mechanism table that is not an evidence table', () => {
    const body = [
      '| Enzyme | NAD+ role | Hallmark link |',
      '| --- | --- | --- |',
      '| SIRT3 | Deacetylates | Mitochondrial dysfunction |',
    ].join('\n');
    expect(parseTrialRows(body, ctx)).toEqual([]);
  });

  it('leaves a column the table does not have as null', () => {
    const body = [
      '| Study | Design | Key outcomes | Tier |',
      '| --- | --- | --- | --- |',
      '| Yin 2008 | RCT vs metformin | ↓20% fasting glucose | A |',
    ].join('\n');
    const [row] = parseTrialRows(body, ctx);
    expect(row.participants).toBeNull();
    expect(row.duration).toBeNull();
    expect(row.dose).toBeNull();
    expect(row.outcome).toBe('↓20% fasting glucose');
  });

  it('keeps a qualified tier verbatim while reporting its letter', () => {
    const body = [
      '| Study | Design | Key outcomes | Tier |',
      '| --- | --- | --- | --- |',
      '| Kumar 2023 (PMID 35975308) | RCT, older adults | ↑ glutathione | A (for the combination) |',
    ].join('\n');
    const [row] = parseTrialRows(body, ctx);
    expect(row.tier).toBe('A');
    expect(row.tierLabel).toBe('A (for the combination)');
    expect(row.pmid).toBe('35975308');
    expect(row.year).toBe(2023);
  });

  it('reports no letter tier where the cell is not a letter grade', () => {
    const body = [
      '| Study | Design | Key outcomes | Tier |',
      '| --- | --- | --- | --- |',
      '| Some 2021 | Animal | something | Preclinical → B |',
    ].join('\n');
    const [row] = parseTrialRows(body, ctx);
    expect(row.tier).toBeNull();
    expect(row.tierLabel).toBe('Preclinical → B');
  });

  it('does not read a sample size as a PMID', () => {
    const body = [
      '| Study | Design | N | Duration | Key outcomes | Tier |',
      '| --- | --- | --- | --- | --- | --- |',
      '| Miller 2019 | Mouse lifespan | 1000000 | Lifelong | +4% median lifespan | C |',
    ].join('\n');
    const [row] = parseTrialRows(body, ctx);
    expect(row.pmid).toBeNull();
    expect(row.participants).toBe('1000000');
  });
});
