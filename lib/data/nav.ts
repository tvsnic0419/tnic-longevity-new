/* Split out of the former monolithic lib/data.ts. Keeping these datasets in
   focused modules stops a client component that needs one export from pulling
   the entire content library into its bundle. */
import { COMPOUND_COUNT } from '../library-modules';


export const navLinks = [
  { href: '/products', label: 'Products', mod: 'MOD-PRD-16' },
  { href: '/library', label: 'Library', mod: 'MOD-LIB-13' },
  { href: '/library/compounds', label: 'Compounds', mod: 'MOD-CMP-17' },
  { href: '/peptides', label: 'Peptides', mod: 'MOD-PEP-15' },
  { href: '/learn', label: 'Learn', mod: 'MOD-LRN-09' },
  { href: '/stacks', label: 'Stacks', mod: 'MOD-ARC-04' },
  { href: '/labs', label: 'Labs', mod: 'MOD-LAB-11' },
  { href: '/tools', label: 'Tools', mod: 'MOD-TOL-14' },
  { href: '/architect', label: 'Constellation', mod: 'MOD-ARC-18' },
];

export const communityPulse = [
  { metric: String(COMPOUND_COUNT), label: 'Evidence-Graded Compounds' },
  { metric: '12', label: 'Hallmarks Explained' },
  { metric: '33', label: 'FAQ Answers' },
  { metric: '20', label: 'Glossary Terms' },
  { metric: '28', label: 'Clinical Studies' },
];
