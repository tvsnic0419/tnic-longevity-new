import type { ThemeAccent } from './design-system';

/**
 * Editorial "top picks by pathway" curation — pulls from the existing
 * `compounds` catalog in lib/data.ts rather than introducing new compound
 * data. A compound can appear in more than one category (NMN legitimately
 * belongs in both Sirtuin and PARP/DNA-repair, since both draw on the same
 * NAD+ pool) — the `why` field is category-specific so the same compound
 * gets a different rationale in each list it appears in.
 */

export interface TopPickEntry {
  compoundId: string;
  rank: number;
  why: string;
}

export interface TopPickCategory {
  id: string;
  slug: string;
  label: string;
  pathwayTag: string;
  theme: ThemeAccent;
  summary: string;
  picks: TopPickEntry[];
}

export const topPickCategories: TopPickCategory[] = [
  {
    id: 'sirtuin',
    slug: 'sirtuin',
    label: 'Sirtuin Activation',
    pathwayTag: 'SIRT1–7',
    theme: 'violet',
    summary:
      'Sirtuins are NAD+-dependent deacetylases that regulate DNA repair, mitophagy, and inflammatory gene expression — the closest known molecular mimic of caloric restriction. Two different strategies show up here: supplying more NAD+ substrate, or activating SIRT1 directly.',
    picks: [
      {
        compoundId: 'nmn',
        rank: 1,
        why: 'NAD+ is the obligate substrate every one of the seven sirtuins runs on — restoring NAD+ supply is a more complete lever than activating SIRT1 alone, and NMN has the deepest human RCT base of any NAD+ precursor on this list.',
      },
      {
        compoundId: 'resveratrol',
        rank: 2,
        why: 'The original SIRT1 allosteric activator — increases SIRT1 affinity for acetylated substrates 8–13×, deacetylating PGC-1α and FOXO3a to mimic caloric restriction. Bioavailability is the real limiting factor (~1% for standard powder).',
      },
      {
        compoundId: 'pterostilbene',
        rank: 3,
        why: 'Mechanistically identical to resveratrol at the SIRT1 level, but two methoxy groups instead of two hydroxyl groups mean far less intestinal glucuronidation — 4–5× higher plasma concentration per equivalent dose, plus added PPARα activation resveratrol lacks.',
      },
    ],
  },
  {
    id: 'parp',
    slug: 'parp-dna-repair',
    label: 'PARP / DNA-Repair Support',
    pathwayTag: 'PARP1/2',
    theme: 'cyan',
    summary:
      'PARP1/2 repair DNA strand breaks and consume NAD+ to do it — the same NAD+ pool sirtuins draw from, which is exactly why chronically low NAD+ leaves both systems under-resourced at once. The second lever here is upstream: reducing the oxidative DNA damage that PARP has to repair in the first place.',
    picks: [
      {
        compoundId: 'nmn',
        rank: 1,
        why: "Directly supplies the NAD+ that PARP1/2 consume during strand-break repair — the same restored pool that fuels sirtuins. This is substrate supply for the repair machinery itself, not an upstream antioxidant effect.",
      },
      {
        compoundId: 'sulforaphane',
        rank: 2,
        why: "A different lever on the same hallmark: sulforaphane's KEAP1-NRF2 activation upregulates NQO1 and phase-II detox enzymes that shield DNA from oxidative adducts before they happen — lowering the repair burden PARP faces, rather than fueling the repair reaction directly.",
      },
    ],
  },
  {
    id: 'nrf2',
    slug: 'nrf2',
    label: 'NRF2 Activation',
    pathwayTag: 'KEAP1 → NRF2',
    theme: 'emerald',
    summary:
      'NRF2 is the master transcription factor for the cell\'s antioxidant and detoxification response — normally held inactive by KEAP1 until a trigger causes its release. Once free, NRF2 switches on 200+ cytoprotective genes at once, which is why a single well-chosen activator outperforms most single-antioxidant strategies.',
    picks: [
      {
        compoundId: 'sulforaphane',
        rank: 1,
        why: 'The most direct KEAP1-NRF2 activator on the list — covalently modifies KEAP1 cysteine residues, releasing NRF2 to the nucleus and switching on NQO1, GST, GCLC/GCLM, and HO-1. The clearest human RCT evidence of any NRF2 intervention here.',
      },
      {
        compoundId: 'glynac',
        rank: 2,
        why: 'Restores the glutathione pool that directly protects the KEAP1-NRF2 switch itself from irreversible oxidation — supporting the sensor, not just the downstream genes it controls.',
      },
      {
        compoundId: 'rala',
        rank: 3,
        why: "Feeds the same glutathione cycle from a different entry point — R-ALA regenerates GSH via its dihydrolipoic acid reduction, reinforcing the redox environment NRF2 signaling depends on.",
      },
    ],
  },
];

export function getTopPickCategoryBySlug(slug: string): TopPickCategory | undefined {
  return topPickCategories.find((c) => c.slug === slug);
}
