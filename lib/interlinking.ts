import { libraryModules, getModulePath } from './library-modules';
import { hallmarkLibrary } from './hallmarks-library';

/**
 * Single source of truth for "which real-world names should auto-link to
 * which page" — shared by MdxRenderer.tsx (HTML-string based, for MDX
 * content) and LinkedText.tsx (React-node based, for hand-written page
 * copy like the standalone supplement-guide pages). Two renderers used to
 * mean two chances to drift out of sync; this is the one place the term
 * tables and matching rules live.
 */

export interface LinkableTerm {
  name: string;
  href: string;
}

/** Compound module title minus its parenthetical/suffix, e.g. "NMN (Nicotinamide
 * Mononucleotide)" -> "NMN", "Berberine HCl" -> "Berberine" — the short form
 * prose actually uses when naming the substance mid-sentence. */
export function canonicalCompoundName(title: string): string {
  return title.replace(/\s*\(.*\)\s*$/, '').replace(/\s+HCl$/i, '').trim();
}

/** Longest-name-first so e.g. "Urolithin A" is tried before a shorter overlap. */
export const COMPOUND_TERMS_BY_LENGTH: LinkableTerm[] = libraryModules
  .filter((m) => m.category === 'compounds')
  .map((m) => ({ name: canonicalCompoundName(m.title), href: getModulePath(m) }))
  .filter((c) => c.name.length >= 3)
  .sort((a, b) => b.name.length - a.name.length);

/** Longest-title-first, same overlap-safety rule as compound terms. */
export const HALLMARK_TERMS_BY_LENGTH: LinkableTerm[] = hallmarkLibrary
  .map((h) => ({ name: h.title, href: `/library/${h.slug}` }))
  .sort((a, b) => b.name.length - a.name.length);

export function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Word-boundary regex for a linkable term. Hallmark titles are matched
 * case-insensitively (Title Case names are overwhelmingly referenced
 * lowercase mid-sentence — "chronic inflammation," not "Chronic
 * Inflammation"); compound names are matched case-sensitively since they're
 * almost always written in their canonical casing ("NMN", "GlyNAC").
 */
export function termPattern(name: string, caseInsensitive: boolean): RegExp {
  return new RegExp(`(?<![a-zA-Z0-9-])(${escapeRegExp(name)})(?![a-zA-Z0-9-])`, caseInsensitive ? 'i' : undefined);
}
