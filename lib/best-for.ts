/**
 * "Best supplements for [goal]" — the goal-oriented view of the library.
 *
 * These pages target the category's highest-intent search queries ("best
 * supplements for energy / sleep / longevity …") but stay strictly
 * evidence-first: for each goal we RANK the graded compounds by strength of
 * human evidence and mechanistic fit, derived from the same registry the rest
 * of the site renders from. Nothing is hand-picked to look good — a compound
 * appears because it acts on the mechanisms of the goal and carries the tier it
 * carries. It is the goal-facing complement to the hallmark (mechanism) and
 * compound (ingredient) views.
 */

import { compounds } from './data';
import { hallmarkLibrary } from './hallmarks-library';
import type { Compound, EvidenceTier } from './types';

export interface BestForGoal {
  slug: string;
  /** Page H1 / query intent, e.g. "Best Supplements for Energy & Fatigue". */
  title: string;
  /** <title> tag. */
  seoTitle: string;
  metaDescription: string;
  /** One-paragraph honest lede shown under the H1. */
  intro: string;
  /** Hallmarks this goal maps onto (mechanistic basis). */
  hallmarkIds: string[];
  /** Compounds with the most direct mechanistic tie to the goal. */
  boost: string[];
  faqs: { question: string; answer: string }[];
}

export const bestForGoals: BestForGoal[] = [
  {
    slug: 'energy',
    title: 'Best Supplements for Energy & Fatigue',
    seoTitle: 'Best Supplements for Energy & Fatigue — Evidence-Ranked (2026)',
    metaDescription:
      'Evidence-graded supplements for energy and fatigue, ranked by strength of human evidence. NAD+ precursors, mitochondrial cofactors, and TCA fuel — with studied doses and PubMed citations.',
    intro:
      'Persistent fatigue is often a mitochondrial and nutrient-sensing story: declining NAD+, less efficient electron transport, and a stalled TCA cycle. These compounds act on those mechanisms and are ranked by the strength of the human evidence behind them — not by how good they sound.',
    hallmarkIds: ['mito', 'nutrient', 'proteostasis'],
    boost: ['nmn', 'cakg', 'coq10', 'creatine', 'rala', 'pqq', 'taurine'],
    faqs: [
      {
        question: 'What is the best-evidenced supplement for energy?',
        answer:
          'NMN has the strongest human trial footprint for restoring NAD+, the coenzyme mitochondria depend on — but energy is multi-causal, so rule out iron, thyroid, B12, and sleep debt with your physician first. TNiC grades every compound A/B/C by the strength of human evidence.',
      },
      {
        question: 'Do energy supplements work if I sleep badly?',
        answer:
          'Fix sleep first — no compound outperforms adequate sleep for daytime energy. Magnesium, glycine, and melatonin address sleep quality directly; energy compounds like NMN and CoQ10 work on the mitochondrial layer once the sleep foundation is in place.',
      },
    ],
  },
  {
    slug: 'longevity',
    title: 'Best Longevity & Anti-Aging Supplements',
    seoTitle: 'Best Longevity & Anti-Aging Supplements — Evidence-Ranked (2026)',
    metaDescription:
      'The best-evidenced longevity supplements, ranked A/B/C by human trial strength and mapped to the 12 hallmarks of aging. NMN, GlyNAC, Ca-AKG, sulforaphane, and more — with doses and PMIDs.',
    intro:
      'No supplement is proven to extend human lifespan. What the evidence supports is acting on the hallmarks of aging — genomic integrity, NAD+ metabolism, epigenetic drift, autophagy, and senescence. These compounds have the broadest, best-graded human evidence across those mechanisms.',
    hallmarkIds: ['mito', 'genomic', 'epigenetic', 'autophagy', 'senescence'],
    boost: ['glynac', 'nmn', 'cakg', 'sulforaphane', 'spermidine', 'fisetin'],
    faqs: [
      {
        question: 'Which longevity supplement has the strongest human evidence?',
        answer:
          'GlyNAC and NMN carry the strongest human RCT data (Tier A) for reversing measurable aging markers. No compound is proven to extend human lifespan — TNiC grades the marketing claim separately from the biomarker data.',
      },
      {
        question: 'How many longevity supplements should I take?',
        answer:
          'Coverage beats quantity. A small stack that spans several hallmarks (e.g. NAD+ + NRF2 + AKG) is better-evidenced than a long list of overlapping single-mechanism compounds. The NICO Starter Questionnaire builds a stack matched to your goals.',
      },
    ],
  },
  {
    slug: 'sleep',
    title: 'Best Supplements for Sleep',
    seoTitle: 'Best Supplements for Sleep — Evidence-Ranked (2026)',
    metaDescription:
      'Evidence-graded supplements for sleep quality and onset, ranked by human trial strength. Magnesium, glycine, and melatonin — with studied doses, timing, and PubMed citations.',
    intro:
      'Sleep is upstream of nearly every aging mechanism — DNA repair, glymphatic clearance, and inflammatory tone all depend on it. These compounds have human evidence for sleep onset or quality; they complement, but never replace, sleep hygiene.',
    hallmarkIds: ['inflammation', 'mito', 'communication'],
    boost: ['magnesium', 'glycine', 'melatonin', 'taurine'],
    faqs: [
      {
        question: 'What is the best supplement for sleep?',
        answer:
          'Melatonin has the most human trial data for cutting sleep latency, with the benefit plateauing around 4mg. Magnesium and glycine support sleep depth. None substitute for consistent wake time, morning light, and a cool, dark room.',
      },
      {
        question: 'Is melatonin safe to take every night?',
        answer:
          'Short-term human trials show melatonin is well tolerated, but there is no long-term human safety or longevity data. Use the lowest effective dose (0.5–4mg) and discuss ongoing use with your physician.',
      },
    ],
  },
  {
    slug: 'inflammation',
    title: 'Best Supplements for Inflammation',
    seoTitle: 'Best Supplements for Inflammation (Inflammaging) — Evidence-Ranked (2026)',
    metaDescription:
      'Evidence-graded supplements for chronic inflammation and inflammaging, ranked by human trial strength. Omega-3, sulforaphane, GlyNAC, curcumin — with doses, mechanisms, and PubMed citations.',
    intro:
      '"Inflammaging" — chronic low-grade inflammation — predicts cardiovascular and metabolic disease and accelerates every other hallmark. These compounds have human evidence for lowering inflammatory markers (hs-CRP, IL-6) through NRF2, SPM resolution, and NF-κB pathways.',
    hallmarkIds: ['inflammation', 'senescence', 'communication'],
    boost: ['omega3', 'sulforaphane', 'glynac', 'curcumin', 'resveratrol'],
    faqs: [
      {
        question: 'What supplement lowers hs-CRP the most?',
        answer:
          'Omega-3 (EPA+DHA) has the largest cardiovascular evidence base and reliably lowers hs-CRP and IL-6, with the REDUCE-IT trial showing a 25% reduction in major cardiovascular events at 4g/day EPA. Sulforaphane and GlyNAC also reduce inflammatory markers in human trials.',
      },
    ],
  },
  {
    slug: 'cognitive',
    title: 'Best Supplements for Focus & Cognition',
    seoTitle: 'Best Supplements for Focus, Memory & Brain Fog — Evidence-Ranked (2026)',
    metaDescription:
      'Evidence-graded supplements for cognition, focus, and brain fog, ranked by human trial strength. NMN, omega-3, magnesium L-threonate, curcumin — mechanisms, doses, and PubMed citations.',
    intro:
      'Cognitive aging tracks proteostasis, mitochondrial function, and neuroinflammation more than any single "nootropic" pathway. These compounds act on those mechanisms and carry human evidence — brain fog also warrants ruling out sleep, thyroid, and B12 with your physician.',
    hallmarkIds: ['proteostasis', 'mito', 'inflammation'],
    boost: ['nmn', 'omega3', 'magnesium', 'curcumin', 'glycine', 'coq10'],
    faqs: [
      {
        question: 'What is the best supplement for brain fog?',
        answer:
          'Omega-3 (DHA) has the deepest human evidence for cognitive support, and magnesium L-threonate is studied specifically for brain magnesium and cognition. Brain fog is often downstream of sleep, inflammation, or a nutrient gap — address those first.',
      },
    ],
  },
  {
    slug: 'muscle-recovery',
    title: 'Best Supplements for Muscle & Recovery',
    seoTitle: 'Best Supplements for Muscle, Strength & Recovery (Aging) — Evidence-Ranked (2026)',
    metaDescription:
      'Evidence-graded supplements for muscle, strength, and recovery in aging, ranked by human trial strength. Creatine, GlyNAC, omega-3, taurine — with doses and PubMed citations.',
    intro:
      'Preserving muscle is one of the highest-leverage longevity moves — strength predicts healthspan. These compounds have human evidence for lean mass, strength, or recovery when paired with resistance training (which does the heavy lifting).',
    hallmarkIds: ['proteostasis', 'mito', 'stem'],
    boost: ['creatine', 'glynac', 'omega3', 'taurine', 'rala'],
    faqs: [
      {
        question: 'What is the best supplement for building muscle after 50?',
        answer:
          'Creatine monohydrate has Tier A evidence in older adults — added to resistance training it produced significantly greater lean mass and strength versus training alone. It does nothing without a training stimulus.',
      },
    ],
  },
  {
    slug: 'biological-age',
    title: 'Best Supplements to Lower Biological Age',
    seoTitle: 'Best Supplements to Lower Biological Age (Epigenetic) — Evidence-Ranked (2026)',
    metaDescription:
      'Evidence-graded supplements studied against epigenetic clocks and biological age, ranked by human trial strength. Ca-AKG, NMN, resveratrol, sulforaphane — with doses and PubMed citations.',
    intro:
      'Epigenetic clocks (Horvath, GrimAge, DunedinPACE) track biological age better than any single biomarker. A few compounds have early human data against these clocks — the evidence is younger than the marketing, so tiers and study sizes are stated plainly.',
    hallmarkIds: ['epigenetic', 'nutrient', 'genomic', 'stem'],
    boost: ['cakg', 'nmn', 'resveratrol', 'sulforaphane'],
    faqs: [
      {
        question: 'Can a supplement lower my biological age?',
        answer:
          'Ca-AKG showed a mean biological-age reduction on the DunedinPACE clock in a 2024 RCT, but epigenetic-clock studies are small and early. Treat clock movement as a promising signal, not proof — and track it with the same lab over time.',
      },
    ],
  },
  {
    slug: 'metabolic',
    title: 'Best Supplements for Blood Sugar & Metabolic Health',
    seoTitle: 'Best Supplements for Blood Sugar & Metabolic Health — Evidence-Ranked (2026)',
    metaDescription:
      'Evidence-graded supplements for blood sugar, insulin sensitivity, and metabolic health, ranked by human trial strength. Berberine, omega-3, R-ALA, CoQ10 — with doses and PubMed citations.',
    intro:
      'Nutrient-sensing (mTOR/AMPK) and insulin sensitivity sit upstream of metabolic aging. These compounds have human evidence for glucose, lipids, or insulin markers — several are potent enough to warrant physician oversight if you take glucose-lowering medication.',
    hallmarkIds: ['nutrient', 'mito', 'inflammation'],
    boost: ['berberine', 'omega3', 'rala', 'coq10', 'magnesium'],
    faqs: [
      {
        question: 'What is the best supplement for blood sugar?',
        answer:
          'Berberine has head-to-head RCT data showing glucose and HbA1c reductions comparable to metformin. It is potent — if you take diabetes medication, combining them can drop blood sugar too far, so coordinate with your prescriber.',
      },
    ],
  },
  {
    slug: 'immune',
    title: 'Best Supplements for Immune Health',
    seoTitle: 'Best Supplements for Immune Health & Immunosenescence — Evidence-Ranked (2026)',
    metaDescription:
      'Evidence-graded supplements for immune health and immune aging, ranked by human trial strength. Zinc, vitamin D3, omega-3, selenium — with doses, cautions, and PubMed citations.',
    intro:
      'The aging immune system drifts toward chronic inflammation and weaker responses. These compounds correct common deficiencies and modulate immune tone — with the important caveat that supplementing beyond sufficiency rarely adds benefit and can add risk.',
    hallmarkIds: ['inflammation', 'communication', 'genomic'],
    boost: ['zinc', 'vitamin-d3', 'glynac', 'omega3', 'selenium'],
    faqs: [
      {
        question: 'What is the best supplement for immune support?',
        answer:
          'Correcting a zinc or vitamin D deficiency has the clearest immune benefit — both have human RCT data in deficient or older populations. Supplementing when you are already replete adds little and, for zinc above 40mg/day, can deplete copper.',
      },
    ],
  },
];

const EVIDENCE_WEIGHT: Record<EvidenceTier, number> = { A: 3, B: 2, C: 1, D: 0.5 };

export interface RankedPick {
  compound: Compound;
  /** One-line, mechanism-level reason this compound is on the list. */
  why: string;
  /** Unique PMIDs cited for the compound. */
  pmids: string[];
}

export function getBestForGoal(slug: string): BestForGoal | undefined {
  return bestForGoals.find((g) => g.slug === slug);
}

export function getAllBestForSlugs(): string[] {
  return bestForGoals.map((g) => g.slug);
}

export function hallmarkTitlesFor(ids: string[]): { id: string; slug: string; title: string }[] {
  return ids
    .map((id) => hallmarkLibrary.find((h) => h.id === id))
    .filter((h): h is NonNullable<typeof h> => Boolean(h))
    .map((h) => ({ id: h.id, slug: h.slug, title: h.title }));
}

/**
 * Rank the graded compounds for a goal: evidence tier + mechanistic (hallmark)
 * overlap + a direct-tie boost, tempered by bioavailability. Deterministic.
 */
export function rankCompoundsForGoal(goal: BestForGoal, limit = 8): RankedPick[] {
  const scored = compounds
    .map((c) => {
      const hallmarkHits = c.hallmarks.filter((h) => goal.hallmarkIds.includes(h)).length;
      const boosted = goal.boost.includes(c.id);
      if (hallmarkHits === 0 && !boosted) return null;
      const bio = 0.6 + 0.4 * ((c.bioavailability ?? 60) / 100);
      const score =
        EVIDENCE_WEIGHT[c.evidence] * bio + hallmarkHits * 1.2 + (boosted ? 3 : 0);
      return { c, score };
    })
    .filter((x): x is { c: Compound; score: number } => x !== null)
    .sort((a, b) => b.score - a.score || a.c.name.localeCompare(b.c.name))
    .slice(0, limit);

  return scored.map(({ c }) => ({
    compound: c,
    why: `${c.pathway} — Tier ${c.evidence}.`,
    pmids: [...new Set((c.studies ?? []).map((s) => s.pmid).filter(Boolean))],
  }));
}
