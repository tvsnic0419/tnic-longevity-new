import type { HallmarkLibraryEntry } from './types';
import type { ThemeAccent } from './design-system';

export type HallmarkVisualType = HallmarkLibraryEntry['visual'];

export interface HallmarkVisualMeta {
  id: HallmarkVisualType;
  label: string;
  shortLabel: string;
  theme: ThemeAccent;
  /** CSS variable or hex for SVG strokes */
  colorVar: string;
  description: string;
}

/** Central registry — single source for hallmark iconography */
export const hallmarkVisualRegistry: Record<HallmarkVisualType, HallmarkVisualMeta> = {
  dna: {
    id: 'dna',
    label: 'DNA helix damage',
    shortLabel: 'Genomic',
    theme: 'cyan',
    colorVar: 'var(--accent-cyan)',
    description: 'Double-strand breaks and unrepaired lesions',
  },
  telomere: {
    id: 'telomere',
    label: 'Telomere caps',
    shortLabel: 'Telomeres',
    theme: 'violet',
    colorVar: 'var(--accent-violet)',
    description: 'Chromosome end shortening',
  },
  epigenetic: {
    id: 'epigenetic',
    label: 'Methylation marks',
    shortLabel: 'Epigenetic',
    theme: 'emerald',
    colorVar: 'var(--accent-emerald)',
    description: 'Drifting gene expression patterns',
  },
  protein: {
    id: 'protein',
    label: 'Protein aggregates',
    shortLabel: 'Proteostasis',
    theme: 'amber',
    colorVar: 'var(--accent-amber)',
    description: 'Misfolded protein accumulation',
  },
  autophagy: {
    id: 'autophagy',
    label: 'Autophagosome',
    shortLabel: 'Autophagy',
    theme: 'rose',
    colorVar: 'var(--accent-rose)',
    description: 'Declining cellular cleanup',
  },
  mito: {
    id: 'mito',
    label: 'Mitochondria',
    shortLabel: 'Mitochondrial',
    theme: 'cyan',
    colorVar: 'var(--accent-cyan)',
    description: 'Energy production decline',
  },
  senescence: {
    id: 'senescence',
    label: 'Senescent cell',
    shortLabel: 'Senescence',
    theme: 'amber',
    colorVar: 'var(--accent-amber)',
    description: 'Zombie cells and SASP',
  },
  stem: {
    id: 'stem',
    label: 'Stem cell niche',
    shortLabel: 'Stem cells',
    theme: 'emerald',
    colorVar: 'var(--accent-emerald)',
    description: 'Regenerative capacity loss',
  },
  signaling: {
    id: 'signaling',
    label: 'Cell signaling',
    shortLabel: 'Signaling',
    theme: 'violet',
    colorVar: 'var(--accent-violet)',
    description: 'Altered intercellular communication',
  },
  inflammation: {
    id: 'inflammation',
    label: 'Inflammation',
    shortLabel: 'Inflammaging',
    theme: 'rose',
    colorVar: 'var(--accent-rose)',
    description: 'Chronic low-grade inflammation',
  },
  gut: {
    id: 'gut',
    label: 'Microbiome',
    shortLabel: 'Dysbiosis',
    theme: 'emerald',
    colorVar: 'var(--accent-emerald)',
    description: 'Gut ecosystem imbalance',
  },
  nutrient: {
    id: 'nutrient',
    label: 'mTOR / AMPK',
    shortLabel: 'Nutrient sensing',
    theme: 'amber',
    colorVar: 'var(--accent-amber)',
    description: 'Deregulated growth vs repair',
  },
};

export function getHallmarkVisual(type: HallmarkVisualType): HallmarkVisualMeta {
  return hallmarkVisualRegistry[type];
}