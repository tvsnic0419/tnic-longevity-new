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
    ids: ['urolithin-a', 'fisetin', 'omega3', 'nmn', 'resveratrol'],
  },
  metabolic: {
    label: 'Cardio-Metabolic',
    desc: 'AMPK, lipids & glucose',
    ids: ['berberine', 'omega3', 'coq10', 'rala'],
  },
  full: {
    // "Full-Spectrum" describes this preset's own curated coverage, not the
    // whole library (which has grown well past this set) — label/desc derive
    // from the ids below so they can never silently drift from it.
    get label() {
      return `Full-Spectrum ${this.ids.length}`;
    },
    get desc() {
      return `${this.ids.length} curated evidence-graded compounds`;
    },
    ids: ['glynac', 'sulforaphane', 'nmn', 'cakg', 'rala', 'resveratrol', 'taurine', 'spermidine', 'pterostilbene', 'berberine', 'urolithin-a', 'fisetin', 'coq10', 'omega3'],
  },
} as const;

export type PresetKey = keyof typeof stackPresets;