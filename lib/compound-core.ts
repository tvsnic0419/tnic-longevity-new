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
