/**
 * The 150-Year Club — an aspirational, honest membership identity.
 *
 * Framing discipline (matches TNiC's evidence-first ethos): this is NOT a claim
 * that anyone will live to 150. It is a public commitment to the evidence-based
 * pursuit of maximum healthspan. The "member ID" is a deterministic badge derived
 * from the member's name — not a fabricated sequential count we can't track
 * without a backend.
 */

/** The founding cohort year. Everyone who joins now is Charter Class 2026. */
export const CHARTER_YEAR = 2026;

export interface ClubMember {
  /** Display name, sanitized. */
  name: string;
  /** Optional longevity grade carried over from their scorecard. */
  grade?: string;
}

const NAME_MAX = 24;

export function sanitizeName(raw: string): string {
  return raw
    .replace(/[^\p{L}\p{N}\s'.-]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, NAME_MAX);
}

function toBase64Url(s: string): string {
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(s: string): string {
  const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4));
  return atob(s.replace(/-/g, '+').replace(/_/g, '/') + pad);
}

export function encodeMember(member: ClubMember): string {
  const payload = { n: sanitizeName(member.name), g: member.grade ?? '' };
  return toBase64Url(encodeURIComponent(JSON.stringify(payload)));
}

export function decodeMember(code: string): ClubMember | null {
  try {
    const json = decodeURIComponent(fromBase64Url(code));
    const parsed = JSON.parse(json) as { n?: string; g?: string };
    const name = sanitizeName(parsed.n ?? '');
    if (!name) return null;
    return { name, grade: parsed.g || undefined };
  } catch {
    return null;
  }
}

/** Deterministic charter member badge, e.g. "TNIC-150-4KX9". Stable per name. */
export function memberId(name: string): string {
  const clean = sanitizeName(name).toUpperCase();
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = (hash * 31 + clean.charCodeAt(i)) >>> 0;
  }
  const code = hash.toString(36).toUpperCase().padStart(4, '0').slice(-4);
  return `TNIC-150-${code}`;
}

/** The public pledge — what membership actually commits you to. */
export const CLUB_PLEDGE: string[] = [
  'Follow the evidence, not the marketing — Tier A/B compounds only, dose-matched to human trials.',
  'Track real biomarkers, not vibes — measure, adjust, and stay honest about what works.',
  'Build breadth across the 12 hallmarks of aging, not a single-pathway pile of pills.',
  'Share what I learn in the open, so the next person starts further ahead.',
];

export const CLUB_MANIFESTO = {
  eyebrow: 'The 150-Year Club',
  headline: "We're not promising 150 years.",
  subhead:
    "We're committing to the evidence-based pursuit of maximum healthspan — measured, transparent, and done in the open. The number is a north star, not a guarantee.",
};
