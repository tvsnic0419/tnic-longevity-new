import { compounds, safetyNotes } from './data';
import { scoreStack } from './stack-engine';
import type { EvidenceTier } from './types';

export type InteractionType = 'synergy' | 'caution' | 'contraindication';

export interface StackInteraction {
  compoundIds: [string, string];
  type: InteractionType;
  title: string;
  detail: string;
  severity: 'low' | 'medium' | 'high';
}

export interface SynergyLink {
  from: string;
  to: string;
  label: string;
}

export interface StackAnalysis {
  score: number;
  synergies: SynergyLink[];
  interactions: StackInteraction[];
  cautions: string[];
  avoidIf: string[];
  consultIf: string[];
  hallmarkCoverage: string[];
  hallmarkCount: number;
  evidenceTier: EvidenceTier;
  avgBioavailability: number;
  compoundCount: number;
  monthlyCost: { low: number; high: number };
}

/** Base compound strength scores (1–10) for live synergy algorithm */
export const compoundBaseScores: Record<string, number> = {
  glynac: 9,
  sulforaphane: 9,
  nmn: 8,
  cakg: 8,
  rala: 7,
  resveratrol: 7,
  taurine: 7,
  spermidine: 7,
  pterostilbene: 7,
  berberine: 8,
  'urolithin-a': 8,
  fisetin: 7,
  coq10: 7,
  omega3: 8,
};

/** Pairwise synergy scores (1–10). Higher = stronger complementary effect. */
export const synergyPairMatrix: Record<string, Record<string, number>> = {
  glynac: { sulforaphane: 9, rala: 8, nmn: 7 },
  sulforaphane: { glynac: 9, rala: 8 },
  rala: { glynac: 8, sulforaphane: 8, nmn: 7, resveratrol: 4, berberine: 7 },
  nmn: { glynac: 7, cakg: 8, resveratrol: 9, rala: 7, spermidine: 8, taurine: 7 },
  cakg: { nmn: 8, resveratrol: 7 },
  resveratrol: { nmn: 9, cakg: 7, rala: 4, pterostilbene: 8, spermidine: 7 },
  berberine: { omega3: 8, rala: 7, coq10: 7 },
  omega3: { berberine: 8, coq10: 7, fisetin: 7 },
  'urolithin-a': { fisetin: 8, nmn: 7, spermidine: 7 },
  fisetin: { 'urolithin-a': 8, omega3: 7, spermidine: 7 },
  spermidine: { nmn: 8, 'urolithin-a': 7, fisetin: 7, resveratrol: 7 },
  pterostilbene: { resveratrol: 8, nmn: 7 },
  coq10: { berberine: 7, omega3: 7 },
  taurine: { nmn: 7, glynac: 7 },
};

export const hallmarkDisplayNames: Record<string, string> = {
  mito: 'Mitochondrial',
  proteostasis: 'Proteostasis',
  inflammation: 'Inflammation',
  genomic: 'Genomic stability',
  epigenetic: 'Epigenetic',
  senescence: 'Senescence',
  stem: 'Stem cell',
  autophagy: 'Autophagy',
  nutrient: 'Nutrient sensing',
  communication: 'Intercellular comm.',
  telomeres: 'Telomere attrition',
};

export interface LiveStackAnalysis {
  totalScore: number;
  synergies: string[];
  warnings: string[];
  coverage: number;
  hallmarkLabels: string[];
}

const DEFAULT_PAIR_SCORE = 5;

function getPairSynergyScore(aId: string, bId: string): number {
  const fromMatrix = synergyPairMatrix[aId]?.[bId] ?? synergyPairMatrix[bId]?.[aId];
  if (fromMatrix !== undefined) return fromMatrix;

  const interaction = stackInteractions.find(
    (i) =>
      (i.compoundIds[0] === aId && i.compoundIds[1] === bId) ||
      (i.compoundIds[0] === bId && i.compoundIds[1] === aId),
  );
  if (interaction) {
    if (interaction.type === 'synergy') return interaction.severity === 'low' ? 8 : 7;
    if (interaction.type === 'caution') return interaction.severity === 'high' ? 2 : 4;
    return 1;
  }

  const a = compounds.find((c) => c.id === aId);
  const b = compounds.find((c) => c.id === bId);
  if (a?.synergies.includes(bId) || b?.synergies.includes(aId)) return 7;

  return DEFAULT_PAIR_SCORE;
}

/** Dynamic pairwise synergy scoring — powers Stack Builder live analysis panel */
export function computeLiveStackAnalysis(selectedIds: string[]): LiveStackAnalysis {
  if (selectedIds.length === 0) {
    return { totalScore: 0, synergies: [], warnings: [], coverage: 0, hallmarkLabels: [] };
  }

  const selected = compounds.filter((c) => selectedIds.includes(c.id));
  let totalScore = selected.reduce(
    (sum, c) => sum + (compoundBaseScores[c.id] ?? (c.evidence === 'A' ? 8 : c.evidence === 'B' ? 7 : 6)),
    0,
  );

  const synergies: string[] = [];
  const warnings: string[] = [];

  for (let i = 0; i < selectedIds.length; i++) {
    for (let j = i + 1; j < selectedIds.length; j++) {
      const aId = selectedIds[i];
      const bId = selectedIds[j];
      const a = compounds.find((c) => c.id === aId);
      const b = compounds.find((c) => c.id === bId);
      if (!a || !b) continue;

      const pairScore = getPairSynergyScore(aId, bId);

      if (pairScore >= 8) {
        synergies.push(`${a.name} + ${b.name}: Strong synergy (${pairScore}/10)`);
        totalScore += Math.floor(pairScore * 0.6);
      } else if (pairScore <= 3) {
        const interaction = stackInteractions.find(
          (int) =>
            (int.compoundIds[0] === aId && int.compoundIds[1] === bId) ||
            (int.compoundIds[0] === bId && int.compoundIds[1] === aId),
        );
        warnings.push(
          interaction
            ? `Caution: ${interaction.title} — ${a.name} + ${b.name}`
            : `Caution: Potential interaction between ${a.name} and ${b.name}`,
        );
      }
    }
  }

  const hallmarkSet = new Set(selected.flatMap((c) => c.hallmarks));
  const coverageBonus = Math.floor(hallmarkSet.size * 1.5);
  totalScore += coverageBonus;

  const normalizedScore = Math.min(
    Math.max(Math.round(totalScore / selected.length), 0),
    100,
  );

  const hallmarkLabels = [...hallmarkSet].map((h) => hallmarkDisplayNames[h] ?? h);

  return {
    totalScore: normalizedScore,
    synergies,
    warnings,
    coverage: hallmarkSet.size,
    hallmarkLabels,
  };
}

export const compoundMonthlyCost: Record<string, { low: number; high: number }> = {
  glynac: { low: 35, high: 55 },
  sulforaphane: { low: 25, high: 45 },
  rala: { low: 30, high: 50 },
  cakg: { low: 40, high: 70 },
  nmn: { low: 45, high: 90 },
  resveratrol: { low: 25, high: 55 },
  taurine: { low: 8, high: 18 },
  spermidine: { low: 35, high: 65 },
  pterostilbene: { low: 20, high: 40 },
  berberine: { low: 18, high: 35 },
  'urolithin-a': { low: 60, high: 100 },
  fisetin: { low: 20, high: 45 },
  coq10: { low: 25, high: 55 },
  omega3: { low: 25, high: 50 },
};

export const stackInteractions: StackInteraction[] = [
  {
    compoundIds: ['glynac', 'sulforaphane'],
    type: 'synergy',
    title: 'Glutathione + NRF2 amplification',
    detail: 'GlyNAC restores GSH substrate while sulforaphane activates NRF2-driven phase II enzymes — dual-layer antioxidant defense.',
    severity: 'low',
  },
  {
    compoundIds: ['glynac', 'rala'],
    type: 'synergy',
    title: 'Redox cycling support',
    detail: 'R-ALA regenerates oxidized glutathione and vitamins C/E, extending GlyNAC-mediated antioxidant capacity.',
    severity: 'low',
  },
  {
    compoundIds: ['nmn', 'resveratrol'],
    type: 'synergy',
    title: 'SIRT1 activation pair',
    detail: 'NMN restores NAD+ cofactor required for SIRT1; resveratrol allosterically activates SIRT1 — classic longevity synergy.',
    severity: 'low',
  },
  {
    compoundIds: ['nmn', 'cakg'],
    type: 'synergy',
    title: 'Mitochondrial + epigenetic axis',
    detail: 'NAD+ fuels sirtuin epigenetic control while Ca-AKG supports TCA cycle and TET dioxygenase activity.',
    severity: 'low',
  },
  {
    compoundIds: ['cakg', 'resveratrol'],
    type: 'synergy',
    title: 'AMPK–TCA metabolic coupling',
    detail: 'Resveratrol AMPK activation complements AKG-driven metabolic reprogramming observed in lifespan studies.',
    severity: 'low',
  },
  {
    compoundIds: ['sulforaphane', 'rala'],
    type: 'synergy',
    title: 'NRF2 + mitochondrial redox',
    detail: 'Sulforaphane upregulates detox genes; R-ALA supports mitochondrial enzyme redox state.',
    severity: 'low',
  },
  {
    compoundIds: ['coq10', 'nmn'],
    type: 'synergy',
    title: 'Electron transport + NAD⁺ input',
    detail: 'NMN restores the NAD+ that donates electrons at Complex I; CoQ10 shuttles those electrons onward to Complex III. They support the same oxidative-phosphorylation chain at complementary steps.',
    severity: 'low',
  },
  {
    compoundIds: ['taurine', 'nmn'],
    type: 'synergy',
    title: 'Two age-declining currencies restored',
    detail: 'Taurine supports mitochondrial osmotic and antioxidant balance while NMN replenishes NAD+ for sirtuin-driven DNA repair — two currencies that both fall with age, topped up together.',
    severity: 'low',
  },
  {
    compoundIds: ['fisetin', 'nmn'],
    type: 'synergy',
    title: 'Senolysis lowers the NAD⁺ drain',
    detail: 'Senescent cells are major NAD+ consumers via CD38; fisetin clears them, so NMN then replenishes NAD+ into a lower-demand system — senolysis and NAD+ repletion reinforce each other.',
    severity: 'low',
  },
  {
    compoundIds: ['omega3', 'resveratrol'],
    type: 'synergy',
    title: 'Resolve + suppress inflammation',
    detail: 'Omega-3 supplies the EPA/DHA substrate for pro-resolving mediators (resolvins) while resveratrol suppresses NF-κB via SIRT1 — inflammation is resolved and dampened from two directions.',
    severity: 'low',
  },
  {
    compoundIds: ['berberine', 'nmn'],
    type: 'synergy',
    title: 'AMPK ↔ NAD⁺/SIRT1 energy loop',
    detail: 'Berberine activates AMPK while NMN restores NAD+/SIRT1 — a reciprocally reinforcing energy-sensing loop (AMPK raises NAD+; SIRT1 sustains AMPK) that drives mitochondrial biogenesis and mitophagy.',
    severity: 'low',
  },
  {
    compoundIds: ['pqq', 'nmn'],
    type: 'synergy',
    title: 'Build mitochondria + fuel them',
    detail: 'PQQ drives mitochondrial biogenesis via PGC-1α; NMN supplies the NAD+ those new mitochondria need to run — added capacity and the fuel to use it.',
    severity: 'low',
  },
  {
    compoundIds: ['pterostilbene', 'nmn'],
    type: 'synergy',
    title: 'SIRT1 activator + its cofactor',
    detail: 'Pterostilbene — a more bioavailable resveratrol analog — activates SIRT1, which can only work with the NAD+ that NMN restores; the pair supplies activator and cofactor for the same sirtuin axis.',
    severity: 'low',
  },
  {
    compoundIds: ['urolithin-a', 'nmn'],
    type: 'synergy',
    title: 'Recycle + refuel mitochondria',
    detail: 'Urolithin A triggers mitophagy to clear damaged mitochondria while NMN restores the NAD+ that powers their replacement and function — the recycle-and-refuel halves of mitochondrial quality control.',
    severity: 'low',
  },
  {
    compoundIds: ['rala', 'resveratrol'],
    type: 'caution',
    title: 'Dual metabolic modulation',
    detail: 'Both R-ALA and resveratrol may lower blood glucose. Diabetics should monitor glucose and consult physician.',
    severity: 'medium',
  },
  {
    compoundIds: ['glynac', 'resveratrol'],
    type: 'caution',
    title: 'Blood pressure & clotting',
    detail: 'GlyNAC may lower BP; resveratrol inhibits platelet aggregation. Caution with antihypertensives or anticoagulants.',
    severity: 'medium',
  },
  {
    compoundIds: ['sulforaphane', 'rala'],
    type: 'caution',
    title: 'Thyroid medication timing',
    detail: 'High-dose sulforaphane may affect iodine uptake; R-ALA can interact with thyroid meds — separate dosing by 4+ hours.',
    severity: 'medium',
  },
  {
    compoundIds: ['nmn', 'rala'],
    type: 'synergy',
    title: 'NAD+–mitochondrial enzyme support',
    detail: 'NMN restores NAD+ for sirtuin/mitochondrial function; R-ALA supports pyruvate dehydrogenase complex.',
    severity: 'low',
  },
  {
    compoundIds: ['berberine', 'omega3'],
    type: 'synergy',
    title: 'Dual-mechanism cardio-metabolic stack',
    detail: 'Berberine PCSK9/LDL-R-driven LDL lowering + omega-3 TG reduction via SPM axis — complementary lipid targets, non-overlapping mechanisms.',
    severity: 'low',
  },
  {
    compoundIds: ['berberine', 'coq10'],
    type: 'synergy',
    title: 'Berberine–CoQ10 ETC support',
    detail: 'Berberine inhibits Complex I; CoQ10 transfers electrons at the same site — important co-stack for long-term mitochondrial health on berberine.',
    severity: 'low',
  },
  {
    compoundIds: ['urolithin-a', 'fisetin'],
    type: 'synergy',
    title: 'Mitophagy + senolytic dual coverage',
    detail: 'Urolithin A triggers mitophagy to clear damaged mitochondria; fisetin selectively clears senescent cells — converging on the Longevity Pro hallmarks.',
    severity: 'low',
  },
  {
    compoundIds: ['spermidine', 'nmn'],
    type: 'synergy',
    title: 'Autophagy + NAD+ restoration',
    detail: 'Spermidine EP300 inhibition activates autophagy gene programs; NMN fuels sirtuin-driven mitophagy — dual-pathway organelle recycling.',
    severity: 'low',
  },
  {
    compoundIds: ['pterostilbene', 'resveratrol'],
    type: 'caution',
    title: 'Redundant SIRT1 activation',
    detail: 'Both activate SIRT1 via the same stilbene mechanism. Stacking at full doses has diminishing returns and may elevate LDL at combined doses >400 mg/day. Keep combined dose ≤250 mg/day or choose one.',
    severity: 'medium',
  },
  {
    compoundIds: ['berberine', 'rala'],
    type: 'synergy',
    title: 'AMPK + mitochondrial redox',
    detail: 'Both improve insulin sensitivity via different mechanisms — berberine activates AMPK; R-ALA improves mitochondrial redox state. Additive glucose control, monitor if diabetic.',
    severity: 'low',
  },
  {
    compoundIds: ['fisetin', 'omega3'],
    type: 'synergy',
    title: 'Senolytic + anti-inflammatory',
    detail: 'Fisetin pulse-dosing clears senescent cells; omega-3 SPM synthesis resolves residual SASP inflammation. Sequential timing maximizes post-senolysis resolution.',
    severity: 'low',
  },
  {
    compoundIds: ['spermidine', 'urolithin-a'],
    type: 'synergy',
    title: 'Polyamine + mitophagy convergence',
    detail: 'Spermidine induces general autophagy via EP300; urolithin A specifically triggers mitophagy via PINK1/Parkin. Complementary routes to organelle quality control.',
    severity: 'low',
  },
];

function averageEvidenceTier(ids: string[]): EvidenceTier {
  const selected = compounds.filter((c) => ids.includes(c.id));
  if (selected.length === 0) return 'C';
  const scores = selected.map((c) => (c.evidence === 'A' ? 3 : c.evidence === 'B' ? 2 : 1));
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  if (avg >= 2.5) return 'A';
  if (avg >= 1.5) return 'B';
  return 'C';
}

export function analyzeStack(selectedIds: string[]): StackAnalysis {
  const selected = compounds.filter((c) => selectedIds.includes(c.id));
  const hallmarkSet = new Set(selected.flatMap((c) => c.hallmarks));

  const synergies: SynergyLink[] = [];
  const pairs = new Set<string>();

  selected.forEach((c) => {
    c.synergies.forEach((s) => {
      if (selectedIds.includes(s)) {
        const key = [c.id, s].sort().join('-');
        if (!pairs.has(key)) {
          pairs.add(key);
          const target = compounds.find((x) => x.id === s)!;
          synergies.push({
            from: c.id,
            to: s,
            label: `${c.name} ↔ ${target.name}`,
          });
        }
      }
    });
  });

  const interactions = stackInteractions.filter(
    (i) => selectedIds.includes(i.compoundIds[0]) && selectedIds.includes(i.compoundIds[1]),
  );

  const cautions: string[] = [];
  const avoidIf: string[] = [];
  const consultIf: string[] = [];

  selectedIds.forEach((id) => {
    const note = safetyNotes.find((n) => n.compoundId === id);
    if (note) {
      cautions.push(...note.cautions.map((c) => `[${compounds.find((x) => x.id === id)?.name}] ${c}`));
      avoidIf.push(...note.avoidIf.map((a) => `[${compounds.find((x) => x.id === id)?.name}] ${a}`));
      consultIf.push(...note.consultIf.map((c) => `[${compounds.find((x) => x.id === id)?.name}] ${c}`));
    }
  });

  const monthlyCost = selectedIds.reduce(
    (acc, id) => {
      const cost = compoundMonthlyCost[id];
      if (cost) {
        acc.low += cost.low;
        acc.high += cost.high;
      }
      return acc;
    },
    { low: 0, high: 0 },
  );

  const withBioavailability = selected.filter((c) => typeof c.bioavailability === 'number');
  const bioSum = withBioavailability.reduce((s, c) => s + (c.bioavailability ?? 0), 0);

  return {
    score: scoreStack(selectedIds).overall,
    synergies,
    interactions,
    cautions: [...new Set(cautions)],
    avoidIf: [...new Set(avoidIf)],
    consultIf: [...new Set(consultIf)],
    hallmarkCoverage: [...hallmarkSet],
    hallmarkCount: hallmarkSet.size,
    evidenceTier: averageEvidenceTier(selectedIds),
    avgBioavailability: withBioavailability.length ? Math.round(bioSum / withBioavailability.length) : 0,
    compoundCount: selected.length,
    monthlyCost,
  };
}

export function formatStackExport(
  selectedIds: string[],
  analysis: StackAnalysis,
  shareUrl: string,
): string {
  const selected = compounds.filter((c) => selectedIds.includes(c.id));
  const am = selected.filter((c) => c.timing === 'AM' || c.timing === 'AM/PM');
  const pm = selected.filter((c) => c.timing === 'PM');

  const lines = [
    '═══════════════════════════════════════',
    '  TNiC ELITE STACK PROTOCOL EXPORT',
    '  tnic.help/stacks — Educational only',
    '═══════════════════════════════════════',
    '',
    `Synergy Score: ${analysis.score}/100`,
    `Evidence Tier: ${analysis.evidenceTier}`,
    `Hallmark Coverage: ${analysis.hallmarkCount}/12`,
    `Est. Monthly Cost: $${analysis.monthlyCost.low}–$${analysis.monthlyCost.high}`,
    `Share URL: ${shareUrl}`,
    '',
    '── AM PROTOCOL ──',
    ...am.map((c) => `  • ${c.name} — ${c.dose}`),
    '',
    '── PM PROTOCOL ──',
    ...(pm.length ? pm.map((c) => `  • ${c.name} — ${c.dose}`) : ['  (none)']),
    '',
    '── SYNERGIES ──',
    ...(analysis.synergies.length
      ? analysis.synergies.map((s) => `  ✓ ${s.label}`)
      : ['  (none detected)']),
    '',
    '── INTERACTIONS & CAUTIONS ──',
    ...(analysis.interactions.filter((i) => i.type !== 'synergy').length
      ? analysis.interactions
          .filter((i) => i.type !== 'synergy')
          .map((i) => `  ⚠ ${i.title}: ${i.detail}`)
      : ['  (no pair-level cautions)']),
    ...(analysis.consultIf.length
      ? ['', '── CONSULT PHYSICIAN IF ──', ...analysis.consultIf.map((c) => `  • ${c}`)]
      : []),
    '',
    'Not medical advice. Consult your physician before starting any protocol.',
    `Exported: ${new Date().toISOString()}`,
  ];

  return lines.join('\n');
}

export function formatStackJson(
  selectedIds: string[],
  analysis: StackAnalysis,
  stackName?: string,
): string {
  const selected = compounds.filter((c) => selectedIds.includes(c.id));
  return JSON.stringify(
    {
      name: stackName ?? 'Custom Stack',
      exportedAt: new Date().toISOString(),
      source: 'tnic.help/stacks',
      compounds: selected.map((c) => ({
        id: c.id,
        name: c.name,
        dose: c.dose,
        timing: c.timing,
        evidence: c.evidence,
      })),
      analysis: {
        synergyScore: analysis.score,
        evidenceTier: analysis.evidenceTier,
        hallmarkCoverage: analysis.hallmarkCoverage,
        monthlyCostUsd: analysis.monthlyCost,
        synergies: analysis.synergies,
        interactions: analysis.interactions,
      },
      disclaimer: 'Educational only — not medical advice.',
    },
    null,
    2,
  );
}