/**
 * Sponsorship inventory — the config that drives on-site sponsor placements.
 *
 * This is deliberately empty by default: `<SponsorSlot />` renders nothing
 * until a paid, clearly-labeled placement is added here, so the site ships no
 * empty ad boxes and no layout shift. Adding a sponsor is a one-line config
 * change — no code edits — which keeps the editorial and commercial layers
 * cleanly separated (see /trust/sponsorship and app/partnerships).
 *
 * Guardrails this inventory must always honor (from the site's stated policy):
 *  - every placement is unmistakably labeled "Sponsored";
 *  - placements never appear inside evidence tiers, stack scoring, buyer-guide
 *    criteria, or citations, and never imply an endorsement;
 *  - a sponsorship never buys editorial treatment or an evidence-tier upgrade.
 *
 * Dependency-free on purpose (like analytics-events) so it is safe to import
 * from server components, client components, and tests alike.
 */

/** Where a placement can appear. Add ids here as inventory is created. */
export type SponsorSlotId = 'brief' | 'tools' | 'library' | 'partnerships';

export type SponsorTheme = 'cyan' | 'emerald' | 'violet' | 'amber' | 'rose';

export interface Sponsor {
  /** Stable id (used as the React key and in analytics). */
  id: string;
  /** Which inventory slot this placement fills. */
  slot: SponsorSlotId;
  /** Sponsor/brand name shown in the placement. */
  name: string;
  /** One-line, sponsor-supplied value proposition. */
  tagline: string;
  /** Call-to-action label, e.g. "Visit Acme Labs". */
  cta: string;
  /** Outbound destination — must be https. */
  href: string;
  /** Optional accent used to tint the placement card. */
  theme?: SponsorTheme;
  /** ISO date (YYYY-MM-DD) the flight ends; past placements stop rendering. */
  runsUntil?: string;
}

/**
 * Active sponsorships. EMPTY until a signed placement exists.
 *
 * Example (leave commented until a real, paid, disclosed placement is live):
 *
 *   {
 *     id: 'acme-2026q4',
 *     slot: 'tools',
 *     name: 'Acme Labs',
 *     tagline: 'At-home NAD+ testing, physician-reviewed results in 5 days.',
 *     cta: 'See Acme testing',
 *     href: 'https://example.com/tnic',
 *     theme: 'emerald',
 *     runsUntil: '2026-12-31',
 *   },
 */
export const SPONSORS: Sponsor[] = [];

/** True when a placement is still within its flight window. */
export function isSponsorActive(sponsor: Sponsor, now: Date = new Date()): boolean {
  if (!sponsor.runsUntil) return true;
  const end = new Date(`${sponsor.runsUntil}T23:59:59Z`);
  if (Number.isNaN(end.getTime())) return false;
  return end.getTime() >= now.getTime();
}

/**
 * The active sponsor for a slot, or `undefined` when the slot is unsold.
 * If more than one active placement targets a slot, the first wins.
 */
export function getActiveSponsor(
  slot: SponsorSlotId,
  now: Date = new Date(),
): Sponsor | undefined {
  return SPONSORS.find((s) => s.slot === slot && isSponsorActive(s, now));
}
