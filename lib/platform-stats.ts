import { citationRegistry } from './trust';
import { COMPOUND_COUNT } from './library-modules';
import { hallmarkLibrary } from './hallmarks-library';
import { pathways } from './pathways';
import { peptideLibrary } from './peptides-library';
import { evidenceComparisons } from './comparisons';

/**
 * Honest platform stats — every value is derived from the live registries, so
 * the numbers can never drift from what's actually published. Used on the
 * partnerships page as the "platform by the numbers" credibility panel. This
 * module is server-only (imported by app/partnerships) — do not re-export it
 * through a module that reaches a client bundle.
 */
export const platformStats = [
  { value: String(COMPOUND_COUNT), label: 'Compounds', sublabel: 'Evidence-graded A–C' },
  { value: String(hallmarkLibrary.length), label: 'Hallmarks', sublabel: 'Full coverage' },
  { value: String(pathways.length), label: 'Pathways', sublabel: 'Mechanistic actors' },
  { value: String(peptideLibrary.length), label: 'Peptides', sublabel: 'Legality stated' },
  { value: String(evidenceComparisons.length), label: 'Comparisons', sublabel: 'Head-to-head' },
  { value: String(citationRegistry.length), label: 'PMID Citations', sublabel: 'Traceable sources' },
] as const;
