/* Split out of the former monolithic lib/data.ts. Keeping these datasets in
   focused modules stops a client component that needs one export from pulling
   the entire content library into its bundle. */

import { compounds } from './compounds';
import { biomarkers } from './biomarkers';

export const degradationMetrics = (age: number) => {
  const factor = Math.max(0, (age - 25) / 55);
  return {
    glutathione: Math.round(100 - factor * 55),
    nad: Math.round(100 - factor * 62),
    nrf2: Math.round(100 - factor * 48),
    mito: Math.round(100 - factor * 58),
    defense: Math.round(100 - factor * 52),
  };
};

export const calculateDefenseProfile = (
  age: number,
  stress: number,
  sleep: number,
  exercise: number,
) => {
  const ageWeight = Math.min(1, (age - 30) / 50);
  const stressWeight = stress / 100;
  const sleepDeficit = (100 - sleep) / 100;
  const exerciseBonus = exercise / 100;

  const nrf2Priority = Math.round(
    (ageWeight * 30 + stressWeight * 35 + sleepDeficit * 25 - exerciseBonus * 15) * 100 / 75,
  );
  const mitoPriority = Math.round(
    (ageWeight * 35 + sleepDeficit * 30 + (1 - exerciseBonus) * 20 + stressWeight * 15) * 100 / 80,
  );

  const nrf2 = Math.min(100, Math.max(0, nrf2Priority));
  const mito = Math.min(100, Math.max(0, mitoPriority));

  let recommendation: 'nrf2' | 'mito' | 'hybrid';
  if (Math.abs(nrf2 - mito) < 15) recommendation = 'hybrid';
  else if (nrf2 > mito) recommendation = 'nrf2';
  else recommendation = 'mito';

  const defenseScore = Math.round(
    100 - (ageWeight * 40 + stressWeight * 25 + sleepDeficit * 20 - exerciseBonus * 20),
  );

  const biologicalAge = Math.round(
    age + (100 - defenseScore) * 0.18 + stressWeight * 8 + sleepDeficit * 6 - exerciseBonus * 5,
  );

  return {
    nrf2,
    mito,
    recommendation,
    defenseScore: Math.max(15, Math.min(95, defenseScore)),
    biologicalAge: Math.max(age - 12, Math.min(age + 18, biologicalAge)),
    ageDelta: Math.round(age - biologicalAge),
  };
};

export const simulateBiomarkers = (
  age: number,
  stress: number,
  sleep: number,
  exercise: number,
  stackIds: string[] = [],
) => {
  const factor = Math.max(0, (age - 25) / 55);
  const lifestyle = (stress * 0.3 + (100 - sleep) * 0.35 + (100 - exercise) * 0.35) / 100;
  const stackBoost = stackIds.length * 0.04;

  return biomarkers.map((b) => {
    const targeted = b.compounds.some((c) => stackIds.includes(c));
    const boost = targeted ? 0.15 + stackBoost : 0;
    const status = Math.max(0.1, Math.min(1, 1 - factor * 0.6 - lifestyle * 0.3 + boost));
    return { ...b, status: Math.round(status * 100), targeted };
  });
};

export const synergyScore = (selectedIds: string[]): number => {
  if (selectedIds.length === 0) return 0;
  const selected = compounds.filter((c) => selectedIds.includes(c.id));
  let score = selected.length * 12;
  const pairs = new Set<string>();
  selected.forEach((c) => {
    c.synergies.forEach((s) => {
      if (selectedIds.includes(s)) {
        const key = [c.id, s].sort().join('-');
        if (!pairs.has(key)) {
          pairs.add(key);
          score += 18;
        }
      }
    });
  });
  const hallmarkSet = new Set(selected.flatMap((c) => c.hallmarks));
  score += hallmarkSet.size * 4;
  return Math.min(100, score);
};
