import type { EvidenceTier } from './types';
import type { ThemeAccent } from './design-system';

/**
 * The Protocol Library — curated, evidence-based stacks presented as confident,
 * buildable plans.
 *
 * This is a presentation layer over the existing content, not a second stack
 * engine. `/stacks` owns the interactive Stack Architect; the three original
 * synergy deep-dives live as MDX (`content/synergies/`). This registry gathers
 * those plus new combinations into one browseable library, referencing every
 * compound by its **module slug** — so a protocol can include library-only
 * compounds (cocoa flavanols, beetroot nitrate, …) that aren't stack-engine
 * compounds, and each step links to `/library/compounds/<slug>`.
 *
 * `protocols.test.ts` guards that every step slug resolves to a real compound
 * module and every hallmark id is real, so a protocol can't reference something
 * that doesn't exist.
 */

export interface ProtocolStep {
  /** Compound module slug → /library/compounds/<slug>. */
  slug: string;
  /** The compound's job in this stack (the "why it's here"). */
  role: string;
  /** When to take it — the choreography that makes the stack work. */
  timing: 'AM' | 'PM' | 'AM/PM' | 'With meals' | 'Pre-workout' | 'Pulse';
}

export interface Protocol {
  slug: string;
  name: string;
  /** The compound formula, e.g. "GlyNAC + Sulforaphane + R-ALA". */
  formula: string;
  /** One-line benefit headline — what you get. */
  goal: string;
  /** Benefit-forward rationale — why these, together. */
  pitch: string;
  theme: ThemeAccent;
  evidence: EvidenceTier;
  /** Hallmark ids this stack targets (lib/hallmarks-library.ts). */
  hallmarkIds: string[];
  steps: ProtocolStep[];
  /** If a full synergy deep-dive exists, link to it. */
  moduleHref?: string;
}

export const protocols: Protocol[] = [
  {
    slug: 'nrf2-defense-triad',
    name: 'NRF2 Defense Triad',
    formula: 'GlyNAC + Sulforaphane + R-ALA',
    goal: 'Three layers of antioxidant defense working as one system',
    pitch:
      "The body's master antioxidant switch (NRF2) needs three things to fire well: raw material, a signal to turn it on, and a way to keep recycling it. GlyNAC supplies the glutathione substrate, sulforaphane flips the NRF2 switch to build the enzymes, and R-ALA regenerates the whole redox cycle. Together they cover a gap any one of them leaves open — the foundational TNiC defense stack.",
    theme: 'emerald',
    evidence: 'A',
    hallmarkIds: ['genomic', 'mito', 'proteostasis', 'inflammation'],
    steps: [
      { slug: 'glynac', role: 'Glutathione substrate — the raw material', timing: 'AM' },
      { slug: 'sulforaphane', role: 'NRF2 signal — turns on 200+ defense genes', timing: 'AM' },
      { slug: 'rala', role: 'Redox recycler — regenerates the cycle', timing: 'AM' },
    ],
    moduleHref: '/library/synergies/glynac-nrf2-triad',
  },
  {
    slug: 'nad-mitochondrial-stack',
    name: 'NAD⁺ Mitochondrial Stack',
    formula: 'NMN + Ca-AKG + Resveratrol',
    goal: 'Rebuild mitochondrial energy, quality control, and biogenesis together',
    pitch:
      'Mitochondrial aging is three problems at once — falling fuel, weak recycling, and slow rebuilding — so fixing one leg leaves the wheel wobbling. NMN restores the NAD⁺ that powers repair, Ca-AKG feeds the TCA cycle and epigenetic cofactors, and resveratrol drives SIRT1 → PGC-1α to actually build new mitochondria. The highest hallmark coverage in the OTC catalog.',
    theme: 'violet',
    evidence: 'A',
    hallmarkIds: ['mito', 'epigenetic', 'stem', 'genomic'],
    steps: [
      { slug: 'nmn', role: 'NAD⁺ fuel — powers sirtuins and DNA repair', timing: 'AM' },
      { slug: 'cakg', role: 'TCA flux + epigenetic cofactor', timing: 'AM' },
      { slug: 'resveratrol', role: 'SIRT1 → PGC-1α biogenesis signal', timing: 'PM' },
    ],
    moduleHref: '/library/synergies/nad-mito-stack',
  },
  {
    slug: 'sirt1-activation-pair',
    name: 'SIRT1 Activation Pair',
    formula: 'NMN + Trans-Resveratrol',
    goal: 'Fuel the longevity enzyme and switch it on — the classic pairing',
    pitch:
      'SIRT1 is a caloric-restriction-mimicking enzyme, but it is useless without its cosubstrate. NMN supplies the NAD⁺ that fuels it while resveratrol activates it directly — cofactor plus activator. The simplest, most-studied entry point into sirtuin-driven mitochondrial and epigenetic support.',
    theme: 'violet',
    evidence: 'B',
    hallmarkIds: ['mito', 'epigenetic', 'senescence', 'nutrient'],
    steps: [
      { slug: 'nmn', role: 'NAD⁺ cosubstrate — the fuel', timing: 'AM' },
      { slug: 'resveratrol', role: 'SIRT1 activator — the ignition', timing: 'PM' },
    ],
    moduleHref: '/library/synergies/nmn-resveratrol-sirt1',
  },
  {
    slug: 'cardiovascular-nitric-oxide',
    name: 'Cardiovascular / Nitric-Oxide Stack',
    formula: 'Cocoa Flavanols + Beetroot Nitrate + Aged Garlic + Omega-3',
    goal: 'Lower blood pressure and keep arteries young from four directions',
    pitch:
      'Vascular aging is where a huge share of healthspan is won or lost, and these four hit it through independent routes: cocoa flavanols and beetroot both raise nitric oxide (from two different pathways), aged garlic lowers blood pressure and slows plaque, and omega-3 resolves the inflammation underneath. Each has real human outcome data — stacked, they cover more of the vascular picture than any single one.',
    theme: 'rose',
    evidence: 'B',
    hallmarkIds: ['communication', 'inflammation', 'mito'],
    steps: [
      { slug: 'cocoa-flavanols', role: 'eNOS-driven nitric oxide + flow', timing: 'AM' },
      { slug: 'beetroot-nitrate', role: 'Back-up NO via the nitrate pathway', timing: 'Pre-workout' },
      { slug: 'aged-garlic', role: 'Blood pressure + plaque progression', timing: 'With meals' },
      { slug: 'omega3', role: 'Resolves vascular inflammation', timing: 'With meals' },
    ],
  },
  {
    slug: 'senolytic-protocol',
    name: 'Senolytic Protocol',
    formula: 'Fisetin + Quercetin (pulse-dosed)',
    goal: 'Clear the "zombie" senescent cells that drive inflammaging',
    pitch:
      'Senescent cells stop dividing but refuse to die, pumping out inflammatory signals that age the tissue around them. Senolytics clear them — and the evidence-based way to use them is a short, high-dose pulse a couple of days a month, not daily. Fisetin has the highest senolytic potency of the dietary flavonoids, and quercetin is the founding partner of the senolytic approach.',
    theme: 'amber',
    evidence: 'C',
    hallmarkIds: ['senescence', 'inflammation'],
    steps: [
      { slug: 'fisetin', role: 'Highest-potency dietary senolytic', timing: 'Pulse' },
      { slug: 'quercetin', role: 'Founding senolytic partner', timing: 'Pulse' },
    ],
  },
  {
    slug: 'cognition-stack',
    name: 'Cognition Stack',
    formula: 'Citicoline + L-Theanine + Lion’s Mane',
    goal: 'Sharper focus now, healthier neurons over time',
    pitch:
      'This stack works on two timescales. Citicoline and L-theanine give an immediate, clean lift in attention — choline for acetylcholine and membranes, theanine for calm, jitter-free focus — while lion’s mane plays the long game, stimulating nerve growth factor to support neuronal health as you age. Fast payoff plus a structural investment.',
    theme: 'cyan',
    evidence: 'B',
    hallmarkIds: ['communication', 'inflammation'],
    steps: [
      { slug: 'citicoline', role: 'Acetylcholine + membrane repair', timing: 'AM' },
      { slug: 'l-theanine', role: 'Calm, focused attention', timing: 'AM/PM' },
      { slug: 'lions-mane', role: 'NGF support — the long game', timing: 'AM' },
    ],
  },
  {
    slug: 'metabolic-ampk-stack',
    name: 'Metabolic / AMPK Stack',
    formula: 'Berberine + Citrus Bergamot',
    goal: 'Glucose control and a better lipid panel, without a prescription',
    pitch:
      'Two of the strongest non-prescription metabolic levers, hitting complementary targets. Berberine activates AMPK with glucose control that went head-to-head with metformin in an RCT; bergamot works the cholesterol side through the same pathway statins target, dropping LDL and triglycerides. Together they cover glucose and lipids — the metabolic core of healthspan.',
    theme: 'emerald',
    evidence: 'B',
    hallmarkIds: ['nutrient', 'inflammation', 'communication'],
    steps: [
      { slug: 'berberine', role: 'AMPK activation — glucose control', timing: 'With meals' },
      { slug: 'bergamot', role: 'LDL + triglyceride reduction', timing: 'With meals' },
    ],
  },
  {
    slug: 'mitochondrial-renewal',
    name: 'Mitochondrial Renewal',
    formula: 'MitoQ + CoQ10 + PQQ',
    goal: 'Protect the mitochondria you have and help build new ones',
    pitch:
      'A protect-plus-build approach to mitochondrial aging. MitoQ delivers antioxidant defense concentrated *inside* the mitochondria (where generic CoQ10 struggles to reach), CoQ10 supports the electron-transport chain across the cell — essential if you take a statin — and PQQ nudges the PGC-1α biogenesis program that grows new mitochondria. Defense at the source, plus renewal.',
    theme: 'cyan',
    evidence: 'B',
    hallmarkIds: ['mito', 'inflammation'],
    steps: [
      { slug: 'mitoq', role: 'Mitochondria-targeted antioxidant', timing: 'AM' },
      { slug: 'coq10', role: 'Electron-transport support', timing: 'With meals' },
      { slug: 'pqq', role: 'PGC-1α biogenesis nudge', timing: 'AM' },
    ],
  },
];

export function getProtocol(slug: string): Protocol | undefined {
  return protocols.find((p) => p.slug === slug);
}
