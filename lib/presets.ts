export const stackPresets = {
  starter: {
    label: 'Starter',
    desc: 'Tier-A entry protocol',
    ids: ['glynac', 'sulforaphane', 'nmn'],
  },
  nrf2: {
    label: 'NRF2 Defense',
    desc: 'Antioxidant & glutathione',
    ids: ['glynac', 'sulforaphane', 'rala'],
  },
  mito: {
    label: 'Mitochondrial',
    desc: 'NAD+ & energy renewal',
    ids: ['nmn', 'cakg', 'resveratrol'],
  },
  hybrid: {
    label: 'Full Hybrid',
    desc: 'Dual-pathway coverage',
    ids: ['glynac', 'sulforaphane', 'nmn', 'cakg', 'rala'],
  },
  longevity: {
    label: 'Longevity Pro',
    desc: 'Senolytic & healthspan focus',
    ids: ['urolithina', 'fisetin', 'omega3', 'nmn', 'resveratrol'],
  },
  metabolic: {
    label: 'Cardio-Metabolic',
    desc: 'AMPK, lipids & glucose',
    ids: ['berberine', 'omega3', 'coq10', 'rala'],
  },
  full: {
    label: 'Full-Spectrum 14',
    desc: 'All 14 evidence-graded compounds',
    ids: ['glynac', 'sulforaphane', 'nmn', 'cakg', 'rala', 'resveratrol', 'taurine', 'spermidine', 'pterostilbene', 'berberine', 'urolithina', 'fisetin', 'coq10', 'omega3'],
  },
} as const;

export type PresetKey = keyof typeof stackPresets;