export interface LabPartnerPanel {
  id: string;
  name: string;
  status: 'waitlist' | 'beta' | 'live';
  markers: string[];
  description: string;
  eta: string;
}

export const labPartnerPanels: LabPartnerPanel[] = [
  {
    id: 'longevity-baseline',
    name: 'Longevity Baseline Panel',
    status: 'beta',
    markers: ['GSH', 'hs-CRP', 'NAD+ metabolites', 'oxLDL', 'AKG'],
    description:
      'Tier 1 panel — OAuth order (demo or Longevity Direct) or Partner Beta CSV/JSON import.',
    eta: 'OAuth + import',
  },
  {
    id: 'inflammation-surge',
    name: 'Inflammaging Check',
    status: 'beta',
    markers: ['hs-CRP', 'IL-6 (optional)', 'GGT'],
    description: 'Focused panel for NRF2 stack responders — partner codes HS-CRP, GSH supported.',
    eta: 'Import live',
  },
  {
    id: 'mito-nad',
    name: 'Mitochondrial + NAD Panel',
    status: 'beta',
    markers: ['NAD+ index', 'Fasting glucose', 'Resting HR guidance'],
    description: 'Order via demo OAuth — NAD_INDEX auto-imports on demo order complete.',
    eta: 'OAuth demo',
  },
];

export const LAB_PARTNER_WAITLIST_KEY = 'tnic:lab-partner-waitlist';