import { BIOHACK_CARDS_PART1 } from './cards-part1';
import { BIOHACK_CARDS_PART2 } from './cards-part2';
import type { BiohackCard, BiohackStack, BiohackTier, BiohackTierId } from './protocol-types';

export type { BiohackCard, BiohackStack, BiohackTier, BiohackTierId } from './protocol-types';

export const BIOHACK_PRICE_USD = Number(process.env.NEXT_PUBLIC_BIOHACK_PRICE_USD ?? '49');

export const BIOHACK_TIERS: BiohackTier[] = [
  { id: 1, label: 'TIER 1 — NEURAL ARMOR', domain: 'Neural Armor', cards: '1–5', job: 'Glutathione, mitochondria, dopamine recovery', color: '#8b6ad6' },
  { id: 2, label: 'TIER 2 — OXIDATIVE FIRE SUPPRESSION', domain: 'Oxidative Fire', cards: '6–10', job: 'Water/fat antioxidants + NRF2 induction', color: '#e07a3d' },
  { id: 3, label: 'TIER 3 — CARDIOVASCULAR FORTRESS', domain: 'Cardiovascular', cards: '11–16', job: 'Rhythm, viscosity, lipids, AMPK', color: '#e0566a' },
  { id: 4, label: 'TIER 4 — LUNG SHIELD', domain: 'Lung Shield', cards: '17–20', job: 'Mucus clearance + LOX/COX cover', color: '#2ec4b6' },
  { id: 5, label: 'TIER 5 — LIVER & DETOX COMMAND', domain: 'Liver & Detox', cards: '21–24', job: 'Hepatocytes, ER stress, NF-κB, GPx', color: '#5cb85c' },
  { id: 6, label: 'TIER 6 — LONGEVITY CORE · LIVE TO 100', domain: 'Longevity Core', cards: '25–30', job: 'NAD+/sirtuins, senolytics, biogenesis', color: '#6a8cff' },
  { id: 7, label: 'TIER 7 — BRAIN REBUILD & NEUROGENESIS', domain: 'Brain Rebuild', cards: '31–34', job: 'NGF, membranes, cognition, serotonin', color: '#4aa3ff' },
  { id: 8, label: 'TIER 8 — IMMUNE & DNA DEFENSE', domain: 'Immune & DNA', cards: '35–37', job: 'D3/K2, zinc-p53, EGCG anti-cancer', color: '#d4b06a' },
  { id: 9, label: 'TIER 9 — FOUNDATION STACK', domain: 'Foundation', cards: '38–40', job: 'Methyl-B, HPA axis, sleep + CD38', color: '#8aa0a8' },
];

export const BIOHACK_CARDS: BiohackCard[] = [...BIOHACK_CARDS_PART1, ...BIOHACK_CARDS_PART2];

export const BIOHACK_STACKS: BiohackStack[] = [
  { name: 'Glutathione Triad', compounds: 'NAC + R-ALA + Liposomal Glutathione', why: 'Triple-layer glutathione coverage — build it, recycle it, supplement it directly.' },
  { name: 'Mitochondrial Power', compounds: 'CoQ10 + PQQ + ALCAR + Creatine', why: 'Repair, regenerate, and fuel mitochondria simultaneously.' },
  { name: 'Longevity Core', compounds: 'NMN + Resveratrol + Apigenin + Berberine', why: 'Max NAD+ / sirtuin / AMPK activation — the hallmarks of longevity-pathway signaling.' },
  { name: 'Lung Defense', compounds: 'NAC + Serrapeptase + Bromelain + Boswellia + Quercetin', why: 'Mucus clearance + enzyme activity + LOX/COX suppression + antioxidant cover.' },
  { name: 'Neural Rebuild', compounds: 'Lion’s Mane + Lithium Orotate + Bacopa + Omega-3 DHA', why: 'Stimulate NGF, repair membranes, grow dendrites, cut neuroinflammation.' },
  { name: 'Senolytic Pulse', compounds: 'Fisetin 1500 mg + Quercetin 1000 mg (2 days monthly)', why: 'Clear accumulated zombie cells. Run once a month for cellular rejuvenation.' },
  { name: 'Cardiac Shield', compounds: 'CoQ10 + Taurine + Magnesium + Nattokinase + Omega-3', why: 'Rhythm, viscosity, energy, and inflammation — all cardiovascular vectors covered.' },
];

export const BIOHACK_CLOCK = [
  { window: 'Wake / empty stomach', load: 'Enzymes + GSH', cards: 'NAC · Liposomal GSH · Serrapeptase · Bromelain · Nattokinase · TUDCA' },
  { window: 'Breakfast (with fat)', load: 'Mito + fat-solubles', cards: 'R-ALA · ALCAR · CoQ10 · PQQ · C · E · Astaxanthin · D3/K2 · Omega-3 · B-complex · NMN · Resveratrol · Lion’s Mane' },
  { window: 'Midday meal', load: 'Second pulse', cards: 'NAC · Vitamin C · Berberine · Curcumin · Boswellia · Quercetin · Lion’s Mane · Zinc · Selenium · EGCG' },
  { window: 'Largest meal', load: 'Fat-soluble cluster', cards: 'CoQ10 · E · Astaxanthin · D3/K2 · Curcumin · Boswellia · Bacopa · Resveratrol · Fisetin (pulse days)' },
  { window: 'Evening / wind-down', load: 'Rhythm + HPA', cards: 'Magnesium · Taurine · Ashwagandha · Lithium orotate · PS · Spermidine · Creatine' },
  { window: '30–60 min before bed', load: 'Sleep + NAD hold', cards: 'Melatonin XR + Apigenin' },
  { window: 'Off-period only', load: 'Recovery precursors', cards: 'Mucuna 15% L-DOPA · 5-HTP — never concurrent with meth' },
];

export const BIOHACK_DAMAGE = {
  meth: [
    'Dopamine & serotonin neurons',
    'Mitochondria (massive ROS burst)',
    'B vitamins, Magnesium, Zinc',
    'NAD+ and glutathione reserves',
    'Cardiovascular integrity',
    'Liver enzymes & sleep architecture',
  ],
  smoke: [
    'Lung tissue & cilia',
    'Vitamin C (35+ mg/day extra needed)',
    'CoQ10, Vitamin E',
    'Selenium & antioxidant enzymes',
    'DNA methylation patterns',
    'Arterial endothelium',
  ],
};

export const BIOHACK_NOTES = [
  'Start in waves, not all 40 at once. Week 1: Foundation (38–40) + Glutathione Triad + Magnesium/Taurine. Week 2: Mitochondrial Power + Vitamin C/E. Week 3: Lung and Liver tiers. Week 4: Longevity Core and Neural Rebuild.',
  'Empty-stomach enzymes (Serrapeptase, Bromelain, Nattokinase, liposomal GSH) live in a morning window 30 minutes before food.',
  'Fat-soluble cluster (E, Astaxanthin, CoQ10, D3/K2, Curcumin, Boswellia, Bacopa, Resveratrol, Fisetin) rides the largest meal.',
  'Evening cluster is Magnesium, Ashwagandha, Lithium orotate, Spermidine, Melatonin + Apigenin.',
  'Run the clock, not the whole bottle list at once. Wave the tiers in over four weeks so the stack can actually be absorbed.',
];

export function cardsByTier(tier: BiohackTierId) {
  return BIOHACK_CARDS.filter((c) => c.tier === tier);
}

export function previewCards() {
  return BIOHACK_CARDS.filter((c) => c.num <= 2);
}
