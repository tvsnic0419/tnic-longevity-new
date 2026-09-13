export type BiohackTierId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface BiohackCard {
  tier: BiohackTierId;
  num: number;
  name: string;
  dose: string;
  targets: string;
  body: string;
  synergy: string;
  when: string;
}

export interface BiohackTier {
  id: BiohackTierId;
  label: string;
  domain: string;
  cards: string;
  job: string;
  color: string;
}

export interface BiohackStack {
  name: string;
  compounds: string;
  why: string;
}
