import type { EvidenceTier } from './types';

/**
 * Compact mirror of the stack-buildable compounds in lib/data.ts — id and
 * evidence tier only. Always-mounted surfaces (Footer tier counts, ?stack=
 * URL validation in lib/stack-url.ts, PlatformContext hydration) need just
 * these two fields, and importing the full 27-entry data layer for them was
 * shipping ~150 kB of mechanism text and study metadata on every page.
 *
 * Guardrail: lib/compound-core.test.ts asserts a 1:1 id + tier match with
 * lib/data.ts `compounds`. If you add/remove/regrade a compound there, update
 * this list in the same commit — the failing test is the reminder.
 */
export interface CompoundCoreEntry {
  id: string;
  evidence: EvidenceTier;
}

export const compoundCore: CompoundCoreEntry[] = [
  { id: 'glynac', evidence: 'A' },
  { id: 'sulforaphane', evidence: 'A' },
  { id: 'rala', evidence: 'B' },
  { id: 'cakg', evidence: 'A' },
  { id: 'nmn', evidence: 'A' },
  { id: 'resveratrol', evidence: 'B' },
  { id: 'taurine', evidence: 'B' },
  { id: 'spermidine', evidence: 'B' },
  { id: 'pterostilbene', evidence: 'B' },
  { id: 'berberine', evidence: 'A' },
  { id: 'urolithin-a', evidence: 'A' },
  { id: 'fisetin', evidence: 'B' },
  { id: 'coq10', evidence: 'B' },
  { id: 'omega3', evidence: 'A' },
  { id: 'creatine', evidence: 'A' },
  { id: 'curcumin', evidence: 'B' },
  { id: 'glucosamine', evidence: 'B' },
  { id: 'glycine', evidence: 'B' },
  { id: 'magnesium', evidence: 'B' },
  { id: 'melatonin', evidence: 'B' },
  { id: 'nac', evidence: 'B' },
  { id: 'pqq', evidence: 'C' },
  { id: 'quercetin', evidence: 'B' },
  { id: 'selenium', evidence: 'B' },
  { id: 'vitamin-d3', evidence: 'B' },
  { id: 'vitamin-k2', evidence: 'B' },
  { id: 'zinc', evidence: 'B' },
  { id: 'grapeseed', evidence: 'B' },
  { id: 'l-citrulline', evidence: 'B' },
  { id: 'egcg', evidence: 'B' },
  { id: 'astaxanthin', evidence: 'B' },
  { id: 'apigenin', evidence: 'C' },
  { id: 'luteolin', evidence: 'C' },
  { id: 'ergothioneine', evidence: 'C' },
  { id: 'l-carnosine', evidence: 'C' },
  { id: 'tmg', evidence: 'B' },
  { id: 'tocotrienols', evidence: 'B' },
  { id: 'butyrate', evidence: 'C' },
  { id: 'ashwagandha', evidence: 'B' },
  { id: 'rhodiola', evidence: 'C' },
  { id: 'nicotinamide', evidence: 'B' },
  { id: 'hesperidin', evidence: 'B' },
  { id: 'boswellia', evidence: 'B' },
  { id: 'gynostemma', evidence: 'C' },
  { id: 'hyaluronic-acid', evidence: 'C' },
  { id: 'inulin', evidence: 'B' },
  { id: 'alpha-gpc', evidence: 'B' },
  { id: 'phosphatidylserine', evidence: 'B' },
  { id: 'ginkgo-biloba', evidence: 'B' },
  { id: 'panax-ginseng', evidence: 'B' },
  { id: 'mucuna-pruriens', evidence: 'B' },
  { id: 'theobromine', evidence: 'C' },
  { id: 'capsaicin', evidence: 'B' },
  { id: 'pumpkin-seed-oil', evidence: 'B' },
  { id: 'superoxide-dismutase', evidence: 'C' },
  { id: 'piperine', evidence: 'B' },
  { id: 'mct-oil', evidence: 'B' },
  { id: 'bacopa-monnieri', evidence: 'B' },
  { id: 'cordyceps', evidence: 'C' },
  { id: 'reishi', evidence: 'C' },
  { id: 'turkey-tail', evidence: 'B' },
  { id: 'astragalus', evidence: 'C' },
  { id: 'milk-thistle', evidence: 'B' },
  { id: 'msm', evidence: 'B' },
  { id: 'chondroitin', evidence: 'B' },
  { id: 'uc-ii', evidence: 'B' },
  { id: 'bromelain', evidence: 'B' },
  { id: 'methylfolate', evidence: 'B' },
  { id: 'methylcobalamin', evidence: 'B' },
  { id: 'p5p', evidence: 'B' },
  { id: 'benfotiamine', evidence: 'B' },
  { id: 'niacin', evidence: 'B' },
  { id: 'vitamin-c', evidence: 'B' },
  { id: 'mixed-tocopherols', evidence: 'C' },
  { id: 'iodine', evidence: 'A' },
  { id: 'hmb', evidence: 'B' },
  { id: 'trigonelline', evidence: 'B' },
  { id: 'krill-oil', evidence: 'B' },
  { id: 'pea', evidence: 'B' },
  { id: 'l-arginine', evidence: 'B' },
  { id: 'acetyl-l-carnitine', evidence: 'B' },
];

const compoundIdSet = new Set(compoundCore.map((c) => c.id));

/** True when `id` names a stack-buildable compound (a lib/data.ts entry). */
export function isStackCompoundId(id: string): boolean {
  return compoundIdSet.has(id);
}

/** Number of stack-buildable compounds in a given evidence tier. */
export function compoundTierCount(tier: EvidenceTier): number {
  return compoundCore.filter((c) => c.evidence === tier).length;
}
