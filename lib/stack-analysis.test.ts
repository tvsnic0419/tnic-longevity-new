import { describe, expect, it } from 'vitest';
import { compounds, safetyNotes } from './data';
import { scoreStack } from './stack-engine';
import {
  analyzeStack,
  compoundBaseScores,
  compoundMonthlyCost,
  computeLiveStackAnalysis,
  formatStackExport,
  formatStackJson,
  hallmarkDisplayNames,
} from './stack-analysis';

describe('analyzeStack', () => {
  it('returns a zeroed analysis for an empty selection', () => {
    const a = analyzeStack([]);
    expect(a.score).toBe(0);
    expect(a.synergies).toEqual([]);
    expect(a.interactions).toEqual([]);
    expect(a.cautions).toEqual([]);
    expect(a.avoidIf).toEqual([]);
    expect(a.consultIf).toEqual([]);
    expect(a.hallmarkCoverage).toEqual([]);
    expect(a.hallmarkCount).toBe(0);
    expect(a.compoundCount).toBe(0);
    expect(a.avgBioavailability).toBe(0);
    expect(a.monthlyCost).toEqual({ low: 0, high: 0 });
  });

  it('ignores unknown compound ids', () => {
    const a = analyzeStack(['not-a-real-compound']);
    expect(a.compoundCount).toBe(0);
    expect(a.avgBioavailability).toBe(0);
    expect(a.hallmarkCoverage).toEqual([]);
  });

  it('detects a mutual synergy link declared on both compounds, exactly once', () => {
    const a = analyzeStack(['glynac', 'sulforaphane']);
    expect(a.synergies).toHaveLength(1);
    expect(a.synergies[0]).toMatchObject({ from: 'glynac', to: 'sulforaphane' });
    expect(a.synergies[0].label).toBe('GlyNAC ET ↔ Sulforaphane');
  });

  it('never lists the same synergy pair twice regardless of declaration direction', () => {
    const a = analyzeStack(['glynac', 'sulforaphane', 'rala']);
    const pairKeys = a.synergies.map((s) => [s.from, s.to].sort().join('-'));
    expect(new Set(pairKeys).size).toBe(pairKeys.length);
  });

  it('surfaces a pairwise stackInteraction only when both members are selected', () => {
    const both = analyzeStack(['berberine', 'omega3']);
    expect(both.interactions).toHaveLength(1);
    expect(both.interactions[0].title).toBe('Dual-mechanism cardio-metabolic stack');

    const oneOnly = analyzeStack(['berberine']);
    expect(oneOnly.interactions).toHaveLength(0);
  });

  it('prefixes aggregated cautions/avoidIf/consultIf with the compound name', () => {
    const a = analyzeStack(['berberine']);
    const note = safetyNotes.find((n) => n.compoundId === 'berberine')!;
    expect(a.cautions).toHaveLength(note.cautions.length);
    expect(a.cautions[0]).toBe(`[Berberine HCl] ${note.cautions[0]}`);
    expect(a.avoidIf[0]).toBe(`[Berberine HCl] ${note.avoidIf[0]}`);
    expect(a.consultIf[0]).toBe(`[Berberine HCl] ${note.consultIf[0]}`);
  });

  it('de-duplicates consultIf/cautions/avoidIf strings across compounds', () => {
    const a = analyzeStack(['berberine', 'fisetin']);
    expect(new Set(a.consultIf).size).toBe(a.consultIf.length);
    expect(new Set(a.cautions).size).toBe(a.cautions.length);
    expect(new Set(a.avoidIf).size).toBe(a.avoidIf.length);
  });

  it('unions hallmark coverage across selected compounds without duplicates', () => {
    const a = analyzeStack(['glynac', 'sulforaphane']);
    expect(new Set(a.hallmarkCoverage).size).toBe(a.hallmarkCoverage.length);
    expect(a.hallmarkCount).toBe(a.hallmarkCoverage.length);
    expect([...a.hallmarkCoverage].sort()).toEqual(
      ['mito', 'proteostasis', 'inflammation', 'genomic'].sort(),
    );
  });

  it('averages evidence tier across the selected compounds', () => {
    expect(analyzeStack(['glynac', 'sulforaphane']).evidenceTier).toBe('A');
    expect(analyzeStack(['rala', 'coq10', 'fisetin']).evidenceTier).toBe('B');
  });

  it('rounds average bioavailability across selected compounds', () => {
    const a = analyzeStack(['glynac', 'sulforaphane']);
    const glynac = compounds.find((c) => c.id === 'glynac')!;
    const sulforaphane = compounds.find((c) => c.id === 'sulforaphane')!;
    expect(a.avgBioavailability).toBe(
      Math.round((glynac.bioavailability + sulforaphane.bioavailability) / 2),
    );
  });

  it('sums monthly cost ranges across selected compounds', () => {
    const a = analyzeStack(['glynac', 'sulforaphane']);
    expect(a.monthlyCost).toEqual({
      low: compoundMonthlyCost.glynac.low + compoundMonthlyCost.sulforaphane.low,
      high: compoundMonthlyCost.glynac.high + compoundMonthlyCost.sulforaphane.high,
    });
  });

  it('delegates the headline score to scoreStack().overall for the same ids', () => {
    const ids = ['glynac', 'sulforaphane', 'rala'];
    expect(analyzeStack(ids).score).toBe(scoreStack(ids).overall);
  });
});

describe('computeLiveStackAnalysis', () => {
  it('returns an all-zero result for an empty selection', () => {
    expect(computeLiveStackAnalysis([])).toEqual({
      totalScore: 0,
      synergies: [],
      warnings: [],
      coverage: 0,
      hallmarkLabels: [],
    });
  });

  it('flags a strong matrix synergy pair (score >= 8) with the matrix score in the message', () => {
    const a = computeLiveStackAnalysis(['glynac', 'sulforaphane']);
    expect(a.synergies).toHaveLength(1);
    expect(a.synergies[0]).toContain('Strong synergy (9/10)');
    expect(a.warnings).toEqual([]);
  });

  it('computes coverage as the count of distinct hallmarks across selected compounds', () => {
    const a = computeLiveStackAnalysis(['glynac', 'sulforaphane']);
    expect(a.coverage).toBe(4);
    expect([...a.hallmarkLabels].sort()).toEqual(
      ['Mitochondrial', 'Proteostasis', 'Inflammation', 'Genomic stability'].sort(),
    );
  });

  it('falls back to the raw hallmark id when no display name is registered', () => {
    expect(hallmarkDisplayNames.dysbiosis).toBeUndefined();
  });

  it('keeps the normalized total score within 0-100 for the full compound catalog', () => {
    const allIds = Object.keys(compoundBaseScores);
    const a = computeLiveStackAnalysis(allIds);
    expect(a.totalScore).toBeGreaterThanOrEqual(0);
    expect(a.totalScore).toBeLessThanOrEqual(100);
  });

  it('scores a single compound using its own base score plus its hallmark coverage bonus', () => {
    const a = computeLiveStackAnalysis(['glynac']);
    const glynac = compounds.find((c) => c.id === 'glynac')!;
    const coverageBonus = Math.floor(glynac.hallmarks.length * 1.5);
    const expected = Math.min(
      Math.max(Math.round((compoundBaseScores.glynac + coverageBonus) / 1), 0),
      100,
    );
    expect(a.totalScore).toBe(expected);
  });
});

describe('formatStackExport', () => {
  it('splits compounds into AM and PM protocol sections by timing', () => {
    const ids = ['glynac', 'resveratrol'];
    const analysis = analyzeStack(ids);
    const text = formatStackExport(ids, analysis, 'https://tnic.help/stacks?stack=x');
    expect(text).toContain('GlyNAC ET — 600mg glycine + 600mg NAC');
    expect(text).toContain('Trans-Resveratrol — 150–500mg trans-resveratrol');
    const amIndex = text.indexOf('AM PROTOCOL');
    const pmIndex = text.indexOf('PM PROTOCOL');
    const glynacIndex = text.indexOf('GlyNAC ET');
    const resveratrolIndex = text.indexOf('Trans-Resveratrol');
    expect(amIndex).toBeGreaterThan(-1);
    expect(pmIndex).toBeGreaterThan(amIndex);
    expect(glynacIndex).toBeGreaterThan(amIndex);
    expect(glynacIndex).toBeLessThan(pmIndex);
    expect(resveratrolIndex).toBeGreaterThan(pmIndex);
  });

  it('shows a "(none)" placeholder when no compound is scheduled for PM', () => {
    const ids = ['glynac'];
    const analysis = analyzeStack(ids);
    const text = formatStackExport(ids, analysis, 'https://tnic.help/stacks?stack=x');
    expect(text).toContain('(none)');
  });

  it('lists synergies, score, and evidence tier when synergies are present', () => {
    const ids = ['glynac', 'sulforaphane'];
    const analysis = analyzeStack(ids);
    const text = formatStackExport(ids, analysis, 'https://tnic.help/stacks?stack=x');
    expect(text).toContain('GlyNAC ET ↔ Sulforaphane');
    expect(text).toContain(`Synergy Score: ${analysis.score}/100`);
    expect(text).toContain(`Evidence Tier: ${analysis.evidenceTier}`);
    expect(text).toContain(`Est. Monthly Cost: $${analysis.monthlyCost.low}–$${analysis.monthlyCost.high}`);
  });

  it('shows "(none detected)" and "(no pair-level cautions)" for an isolated compound', () => {
    const ids = ['taurine'];
    const analysis = analyzeStack(ids);
    const text = formatStackExport(ids, analysis, 'https://tnic.help/stacks?stack=x');
    expect(text).toContain('(none detected)');
    expect(text).toContain('(no pair-level cautions)');
  });

  it('includes a CONSULT PHYSICIAN IF block only when consultIf entries exist', () => {
    const withNotes = formatStackExport(
      ['berberine'],
      analyzeStack(['berberine']),
      'https://tnic.help/stacks?stack=x',
    );
    expect(withNotes).toContain('CONSULT PHYSICIAN IF');

    const empty = formatStackExport([], analyzeStack([]), 'https://tnic.help/stacks?stack=x');
    expect(empty).not.toContain('CONSULT PHYSICIAN IF');
  });

  it('omits the medications section entirely when no medication classes are selected', () => {
    const text = formatStackExport(['omega3'], analyzeStack(['omega3']), 'https://tnic.help/stacks?stack=x');
    expect(text).not.toContain('MEDICATIONS ON FILE');
  });

  it('lists a flagged match with its verbatim source note when a medication class hits the stack', () => {
    const text = formatStackExport(
      ['omega3'],
      analyzeStack(['omega3']),
      'https://tnic.help/stacks?stack=x',
      ['anticoagulants'],
    );
    expect(text).toContain('MEDICATIONS ON FILE');
    expect(text).toContain('Blood thinners / antiplatelets');
    expect(text).toContain('FLAGGED AGAINST THIS STACK');
    expect(text).toContain('Blood thinners (warfarin, aspirin, clopidogrel)');
  });

  it('shows the no-flags placeholder when a selected medication class has no match in the stack', () => {
    const text = formatStackExport(
      ['omega3'],
      analyzeStack(['omega3']),
      'https://tnic.help/stacks?stack=x',
      ['thyroid'],
    );
    expect(text).toContain('MEDICATIONS ON FILE');
    expect(text).toContain('(no published flags for these medication classes against this stack)');
  });
});

describe('formatStackJson', () => {
  it('produces valid JSON carrying compound and analysis details', () => {
    const ids = ['glynac', 'sulforaphane'];
    const analysis = analyzeStack(ids);
    const json = JSON.parse(formatStackJson(ids, analysis, 'My Stack'));
    expect(json.name).toBe('My Stack');
    expect(json.compounds).toHaveLength(2);
    expect(json.compounds[0]).toMatchObject({ id: 'glynac', name: 'GlyNAC ET', evidence: 'A' });
    expect(json.analysis.synergyScore).toBe(analysis.score);
    expect([...json.analysis.hallmarkCoverage].sort()).toEqual([...analysis.hallmarkCoverage].sort());
    expect(json.disclaimer).toMatch(/Educational only/);
  });

  it('defaults the stack name to "Custom Stack" when none is provided', () => {
    const json = JSON.parse(formatStackJson([], analyzeStack([]), undefined));
    expect(json.name).toBe('Custom Stack');
    expect(json.compounds).toEqual([]);
  });

  it('includes medications block only when medication class ids are provided', () => {
    const noMeds = JSON.parse(formatStackJson(['omega3'], analyzeStack(['omega3']), 'Stack'));
    expect(noMeds.medications).toEqual({ selfReportedClassIds: [], flaggedAgainstStack: [] });

    const withMeds = JSON.parse(
      formatStackJson(['omega3'], analyzeStack(['omega3']), 'Stack', ['anticoagulants']),
    );
    expect(withMeds.medications.selfReportedClassIds).toEqual(['anticoagulants']);
    expect(withMeds.medications.flaggedAgainstStack).toHaveLength(1);
    expect(withMeds.medications.flaggedAgainstStack[0]).toMatchObject({ compoundId: 'omega3' });
  });
});
