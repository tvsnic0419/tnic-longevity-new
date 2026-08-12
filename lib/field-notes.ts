import { compounds } from './data';
import type { EvidenceTier } from './types';

/**
 * "Good to know" — a curated set of high-signal longevity facts, each one drawn
 * from a claim that already lives (cited, with PMIDs) on the linked compound's
 * page. This file invents no evidence: every note points to a real compound in
 * lib/data.ts, and the fact restates that compound's own sourced description.
 * The build guard below fails if a note ever references a compound that isn't in
 * the library, so a note can never outlive its source.
 */

export interface FieldNote {
  /** The punchy figure or claim — the "whoa". */
  stat: string;
  /** One-line headline. */
  title: string;
  /** Why it matters — the mechanism or consequence, in plain language. */
  body: string;
  /** The lever: a compound id in lib/data.ts. The card links to its page. */
  compoundId: string;
  /** Short provenance shown on the card (the study/source named on the page). */
  source: string;
}

/** Ordered for reading — lead with the strongest human evidence. */
const NOTES: FieldNote[] = [
  {
    stat: '~50%',
    title: 'NAD⁺ roughly halves between 40 and 60',
    body: 'NAD⁺ powers sirtuins and PARP-driven DNA repair, and its pool falls about half by your sixties. NMN is a direct precursor that bypasses the rate-limiting step to refill it.',
    compoundId: 'nmn',
    source: 'NMN evidence module · human PK + biomarkers',
  },
  {
    stat: '45–50%',
    title: 'GlyNAC cut oxidative stress by nearly half',
    body: 'Two Baylor RCTs found 16–24 weeks of glycine + NAC restored glutathione to young-adult levels and lowered oxidative-stress markers 45–50% across multiple hallmarks in older adults.',
    compoundId: 'glynac',
    source: 'J Gerontol A, 2023 · PMID 35975308',
  },
  {
    stat: '−80%',
    title: 'Taurine falls ~80% across a lifespan',
    body: 'A 2023 Science paper tied age-related taurine decline to faster aging in animals — and restoring it extended healthy lifespan. In humans it is still emerging, not proven.',
    compoundId: 'taurine',
    source: 'Singh et al., Science 2023',
  },
  {
    stat: '25%',
    title: 'High-dose EPA cut major cardiac events a quarter',
    body: 'In REDUCE-IT (NEJM 2018, n=8,179), 4 g/day of EPA reduced major cardiovascular events 25% in high-risk patients — omega-3s that resolve inflammation rather than just blunt it.',
    compoundId: 'omega3',
    source: 'REDUCE-IT, NEJM 2018',
  },
  {
    stat: '2× NQO1',
    title: 'Sulforaphane doubled a master detox gene',
    body: 'Sulforaphane frees NRF2 from KEAP1, switching on 200+ cytoprotective genes. A 2024 CKD trial saw NQO1 expression double after six weeks — measurable proof the switch flipped.',
    compoundId: 'sulforaphane',
    source: 'Free Radic Biol Med, 2024 · PMID 38772511',
  },
  {
    stat: 'Phase 2',
    title: 'Urolithin A improved muscle strength in a real trial',
    body: 'Urolithin A triggers mitophagy — the cell clearing out damaged mitochondria. A 2022 Phase 2 RCT showed improved muscle strength and less fatigue in adults 65+ at 1,000 mg/day.',
    compoundId: 'urolithin-a',
    source: 'Cell Reports Medicine, 2022',
  },
  {
    stat: '=Metformin',
    title: 'Berberine matched metformin on glucose',
    body: 'In a 13-week head-to-head RCT, berberine (500 mg three times daily) matched metformin for glucose control — and added lipid benefits the drug lacks. No prescription required.',
    compoundId: 'berberine',
    source: 'Yin et al., 2008 · head-to-head RCT',
  },
  {
    stat: '−50% by 70',
    title: 'CoQ10 halves by 70 — and statins deplete it',
    body: 'CoQ10 carries electrons through the mitochondrial chain and drops ~50% by age 70. Statins block the same enzyme that makes it, which is why ubiquinol matters most for statin users.',
    compoundId: 'coq10',
    source: 'Meta-analysis · 17 RCTs, inflammation markers',
  },
];

export interface ResolvedFieldNote extends FieldNote {
  compoundName: string;
  tier: EvidenceTier;
  href: string;
}

/** Notes joined to their live compound record (name, tier, link). */
export const FIELD_NOTES: ResolvedFieldNote[] = NOTES.map((n) => {
  const compound = compounds.find((c) => c.id === n.compoundId);
  if (!compound) {
    throw new Error(`field-notes: "${n.compoundId}" is not a compound in lib/data.ts`);
  }
  return {
    ...n,
    compoundName: compound.name,
    tier: compound.evidence,
    href: `/library/compounds/${compound.id}`,
  };
});
