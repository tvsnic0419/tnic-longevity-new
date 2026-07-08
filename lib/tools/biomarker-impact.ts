import { biomarkers, compounds, hallmarks } from '../data';
import { hallmarkLibrary } from '../hallmarks-library';
import { biomarkerHallmarkMap } from '../labs';
import type { EvidenceTier } from '../types';

export type InterventionCategory = 'compound' | 'lifestyle';

export interface InterventionImpact {
  id: string;
  name: string;
  category: InterventionCategory;
  compoundId?: string;
  impactScore: number;
  impactLabel: 'primary' | 'secondary' | 'supportive';
  evidence: EvidenceTier;
  mechanism: string;
  expectedDirection: 'increase' | 'decrease';
  timeframe: string;
  hallmarkIds: string[];
}

export interface BiomarkerImpactResult {
  markerId: string;
  markerName: string;
  unit: string;
  optimal: string;
  desc: string;
  interventions: InterventionImpact[];
  lifestyleModifiers: InterventionImpact[];
  topPick: InterventionImpact | null;
  interpretationGuide: string;
}

const lifestyleImpacts: Record<string, InterventionImpact[]> = {
  gsh: [
    {
      id: 'sleep-gsh',
      name: 'Sleep optimization (7–9h)',
      category: 'lifestyle',
      impactScore: 72,
      impactLabel: 'secondary',
      evidence: 'A',
      mechanism: 'DNA repair and GSH recycling peak during slow-wave sleep',
      expectedDirection: 'increase',
      timeframe: '4–8 weeks',
      hallmarkIds: ['genomic', 'proteostasis'],
    },
    {
      id: 'exercise-gsh',
      name: 'Zone 2 aerobic training',
      category: 'lifestyle',
      impactScore: 65,
      impactLabel: 'supportive',
      evidence: 'A',
      mechanism: 'Mitochondrial biogenesis reduces chronic oxidative burden',
      expectedDirection: 'increase',
      timeframe: '8–12 weeks',
      hallmarkIds: ['mito'],
    },
  ],
  nad: [
    {
      id: 'exercise-nad',
      name: 'Resistance + HIIT training',
      category: 'lifestyle',
      impactScore: 70,
      impactLabel: 'secondary',
      evidence: 'A',
      mechanism: 'Exercise upregulates NAMPT and mitochondrial NAD+ turnover',
      expectedDirection: 'increase',
      timeframe: '6–12 weeks',
      hallmarkIds: ['mito', 'nutrient'],
    },
    {
      id: 'sleep-nad',
      name: 'Consistent sleep schedule',
      category: 'lifestyle',
      impactScore: 55,
      impactLabel: 'supportive',
      evidence: 'B',
      mechanism: 'Circadian NAD+ rhythm disruption accelerates decline',
      expectedDirection: 'increase',
      timeframe: '4 weeks',
      hallmarkIds: ['mito'],
    },
  ],
  hscrp: [
    {
      id: 'stress-hscrp',
      name: 'HRV / stress reduction',
      category: 'lifestyle',
      impactScore: 78,
      impactLabel: 'primary',
      evidence: 'A',
      mechanism: 'Chronic cortisol drives NF-κB and hs-CRP elevation',
      expectedDirection: 'decrease',
      timeframe: '4–8 weeks',
      hallmarkIds: ['inflammation', 'telomeres'],
    },
    {
      id: 'exercise-hscrp',
      name: 'Regular moderate exercise',
      category: 'lifestyle',
      impactScore: 75,
      impactLabel: 'primary',
      evidence: 'A',
      mechanism: 'Anti-inflammatory myokines, visceral fat reduction',
      expectedDirection: 'decrease',
      timeframe: '8–12 weeks',
      hallmarkIds: ['inflammation'],
    },
  ],
  oxldl: [
    {
      id: 'nutrition-oxldl',
      name: 'Polyphenol-rich diet',
      category: 'lifestyle',
      impactScore: 68,
      impactLabel: 'secondary',
      evidence: 'B',
      mechanism: 'Dietary antioxidants reduce LDL oxidation',
      expectedDirection: 'decrease',
      timeframe: '12 weeks',
      hallmarkIds: ['inflammation', 'mito'],
    },
  ],
  akg: [
    {
      id: 'exercise-akg',
      name: 'Resistance training',
      category: 'lifestyle',
      impactScore: 60,
      impactLabel: 'supportive',
      evidence: 'B',
      mechanism: 'TCA cycle flux supports endogenous AKG production',
      expectedDirection: 'increase',
      timeframe: '8 weeks',
      hallmarkIds: ['mito', 'epigenetic'],
    },
  ],
  '8ohdg': [
    {
      id: 'sleep-8ohdg',
      name: 'Sleep + stress management',
      category: 'lifestyle',
      impactScore: 80,
      impactLabel: 'primary',
      evidence: 'A',
      mechanism: 'DNA repair peaks in SWS; stress increases oxidative DNA hits',
      expectedDirection: 'decrease',
      timeframe: '8–12 weeks',
      hallmarkIds: ['genomic'],
    },
  ],
};

const compoundImpactWeights: Record<string, number> = {
  glynac: 95,
  nmn: 92,
  sulforaphane: 88,
  cakg: 85,
  rala: 78,
  resveratrol: 75,
};

function buildCompoundImpact(markerId: string, compoundId: string): InterventionImpact | null {
  const b = biomarkers.find((x) => x.id === markerId);
  const c = compounds.find((x) => x.id === compoundId);
  if (!b || !c || !b.compounds.includes(compoundId)) return null;

  const base = compoundImpactWeights[compoundId] ?? 60;
  const isPrimary = b.compounds[0] === compoundId;
  const impactScore = isPrimary ? base : Math.round(base * 0.75);

  const lowerBetter = ['hscrp', 'oxldl', '8ohdg'].includes(markerId);

  return {
    id: `compound-${compoundId}-${markerId}`,
    name: c.name,
    category: 'compound',
    compoundId,
    impactScore,
    impactLabel: isPrimary ? 'primary' : impactScore >= 70 ? 'secondary' : 'supportive',
    evidence: c.evidence,
    mechanism: c.mechanism,
    expectedDirection: lowerBetter ? 'decrease' : 'increase',
    timeframe: c.evidence === 'A' ? '12–24 weeks' : '8–16 weeks',
    hallmarkIds: c.hallmarks.filter((h) => biomarkerHallmarkMap[markerId]?.includes(h)),
  };
}

function interpretationFor(markerId: string): string {
  const guides: Record<string, string> = {
    gsh: 'Low GSH suggests antioxidant reserve depletion. Prioritize GlyNAC (Tier A human data) + NRF2 induction. Retest at 12 and 24 weeks.',
    nad: 'Low NAD+ index limits sirtuin and PARP function. NMN is primary intervention; pair PM resveratrol for SIRT1 activation. Recheck at 4 weeks.',
    hscrp: 'Elevated hs-CRP signals inflammaging. Address lifestyle (stress, sleep) alongside sulforaphane and GlyNAC. Single illness spike ≠ chronic trend.',
    oxldl: 'High oxLDL reflects vascular oxidative stress. NRF2 triad (GlyNAC + sulforaphane + R-ALA) is the primary compound approach.',
    akg: 'Low AKG correlates with epigenetic age acceleration. Ca-AKG supplementation has mouse lifespan data; human trials emerging.',
    '8ohdg': 'Elevated 8-OHdG indicates oxidative DNA damage. Combine sleep optimization with GlyNAC and NRF2 stack.',
  };
  return guides[markerId] ?? 'Compare trend over 2+ readings before adjusting protocol.';
}

export function calculateBiomarkerImpact(markerId: string): BiomarkerImpactResult | null {
  const b = biomarkers.find((x) => x.id === markerId);
  if (!b) return null;

  const compoundInterventions = b.compounds
    .map((cid) => buildCompoundImpact(markerId, cid))
    .filter((x): x is InterventionImpact => x !== null)
    .sort((a, b) => b.impactScore - a.impactScore);

  const lifestyleModifiers = (lifestyleImpacts[markerId] ?? []).sort(
    (a, b) => b.impactScore - a.impactScore,
  );

  const all = [...compoundInterventions, ...lifestyleModifiers];
  const topPick = all[0] ?? null;

  return {
    markerId,
    markerName: b.name,
    unit: b.unit,
    optimal: b.optimal,
    desc: b.desc,
    interventions: compoundInterventions,
    lifestyleModifiers,
    topPick,
    interpretationGuide: interpretationFor(markerId),
  };
}

export function calculateAllBiomarkerImpacts(): BiomarkerImpactResult[] {
  return biomarkers.map((b) => calculateBiomarkerImpact(b.id)!).filter(Boolean);
}

export function getHallmarkLabelsForMarker(markerId: string): string[] {
  const ids = biomarkerHallmarkMap[markerId] ?? [];
  return ids.map((id) => {
    const h = hallmarks.find((x) => x.id === id);
    const lib = hallmarkLibrary.find((x) => x.id === id);
    return lib?.title ?? h?.title ?? id;
  });
}