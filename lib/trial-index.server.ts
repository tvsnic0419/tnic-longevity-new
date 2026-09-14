import { loadMdx } from './mdx';
import { compoundModules } from './library-modules';
import { parseTrialRows, computeTrialStats, type TrialRecord, type TrialIndexStats } from './trial-index';
import type { EvidenceTier } from './types';

/**
 * Server half of the trial index: the part that touches the filesystem.
 *
 * Split from `trial-index.ts` because the client table imports that module for
 * its types and labels, and a `fs` import anywhere in that graph fails the
 * Turbopack client build. The parser stays pure and testable next door; this
 * file only locates the MDX and hands it over.
 */

let cached: TrialRecord[] | null = null;

/** Every trial row in the library, compound order, table order within compound. */
export function trialIndex(): TrialRecord[] {
  if (cached) return cached;
  const rows: TrialRecord[] = [];
  for (const mod of compoundModules) {
    const mdx = loadMdx(mod.mdxSlug, 'compounds');
    if (!mdx) continue;
    rows.push(
      ...parseTrialRows(mdx.body, {
        slug: mod.slug,
        title: mod.title,
        tier: mod.evidenceTier,
        href: `/library/compounds/${mod.slug}`,
      }),
    );
  }
  cached = rows;
  return rows;
}

export function trialIndexStats(): TrialIndexStats {
  return computeTrialStats(trialIndex(), compoundModules.length);
}

/** Compound modules whose deep-dive carries no evidence table at all. */
export function compoundsWithoutTrialTable(): { slug: string; title: string; tier: EvidenceTier }[] {
  const covered = new Set(trialIndex().map((r) => r.compoundSlug));
  return compoundModules
    .filter((m) => !covered.has(m.slug))
    .map((m) => ({ slug: m.slug, title: m.title, tier: m.evidenceTier }));
}
