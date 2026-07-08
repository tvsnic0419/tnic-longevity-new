/**
 * Shareable Longevity Scorecard — encode/decode a compact result payload
 * into a URL-safe code. Used by /scorecard/[code] (landing page + OG image)
 * and the ShareScorecard widget. Runs in edge, node, and browser.
 */

export interface ScorecardPayload {
  /** Chronological age (0 = not provided) */
  age: number;
  /** Modeled biological age (0 = defense scan not run) */
  bioAge: number;
  /** Synergy score 0–100 */
  synergy: number;
  /** Hallmark coverage 0–100 */
  coverage: number;
  /** Compounds in active stack */
  stackSize: number;
}

const clamp = (n: unknown, min: number, max: number): number => {
  const v = typeof n === 'number' && Number.isFinite(n) ? Math.round(n) : 0;
  return Math.min(max, Math.max(min, v));
};

function sanitize(p: Partial<ScorecardPayload>): ScorecardPayload {
  return {
    age: clamp(p.age, 0, 120),
    bioAge: clamp(p.bioAge, 0, 120),
    synergy: clamp(p.synergy, 0, 100),
    coverage: clamp(p.coverage, 0, 100),
    stackSize: clamp(p.stackSize, 0, 30),
  };
}

/** Compact positional format: v1.age.bioAge.synergy.coverage.stackSize */
export function encodeScorecard(p: Partial<ScorecardPayload>): string {
  const s = sanitize(p);
  return ['v1', s.age, s.bioAge, s.synergy, s.coverage, s.stackSize].join('.');
}

export function decodeScorecard(code: string): ScorecardPayload | null {
  const parts = code.split('.');
  if (parts.length !== 6 || parts[0] !== 'v1') return null;
  const nums = parts.slice(1).map(Number);
  if (nums.some((n) => !Number.isFinite(n))) return null;
  const [age, bioAge, synergy, coverage, stackSize] = nums;
  return sanitize({ age, bioAge, synergy, coverage, stackSize });
}

export type LongevityGrade = 'S' | 'A' | 'B' | 'C' | 'D';

/** Composite grade — equal parts synergy and hallmark coverage */
export function scorecardGrade(p: ScorecardPayload): LongevityGrade {
  const composite = p.synergy * 0.5 + p.coverage * 0.5;
  if (composite >= 85) return 'S';
  if (composite >= 70) return 'A';
  if (composite >= 50) return 'B';
  if (composite >= 30) return 'C';
  return 'D';
}

export const gradeColors: Record<LongevityGrade, string> = {
  S: '#34d399',
  A: '#22d3ee',
  B: '#a78bfa',
  C: '#fbbf24',
  D: '#fb7185',
};

export const gradeLabels: Record<LongevityGrade, string> = {
  S: 'Elite protocol',
  A: 'Strong protocol',
  B: 'Solid foundation',
  C: 'Early stage',
  D: 'Just getting started',
};

/** Age delta headline: negative bio age is the brag */
export function ageDeltaHeadline(p: ScorecardPayload): string | null {
  if (!p.age || !p.bioAge) return null;
  const delta = p.age - p.bioAge;
  if (delta > 0) return `${delta} years younger than my birth certificate`;
  if (delta < 0) return `${Math.abs(delta)} years of work to do`;
  return 'Right on track with my chronological age';
}

export function buildShareText(p: ScorecardPayload): string {
  const grade = scorecardGrade(p);
  const delta = p.age && p.bioAge ? p.age - p.bioAge : null;
  const lead =
    delta && delta > 0
      ? `My biological age is ${p.bioAge} — I'm ${p.age}. `
      : '';
  return `${lead}Longevity grade: ${grade} · ${p.coverage}% of the 12 hallmarks of aging covered. What's yours?`;
}
