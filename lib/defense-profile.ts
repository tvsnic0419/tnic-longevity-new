// Pure defense-profile math, split out of lib/data.ts so PlatformContext
// (mounted on every page) can compute the profile without pulling the full
// compound data layer into the shared client bundle. lib/data.ts re-exports
// it for existing importers.

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
