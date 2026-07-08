import { citationRegistry } from './trust';

/** Honest platform stats — counts match visible registry content */
export const platformStats = [
  { value: String(citationRegistry.length), label: 'PMID Citations', sublabel: 'Traceable sources' },
  { value: '12', label: 'Hallmarks', sublabel: 'Full coverage' },
  { value: '6', label: 'OS Tools', sublabel: 'Local-first' },
  { value: '26', label: 'Library Modules', sublabel: 'Evidence-graded' },
] as const;