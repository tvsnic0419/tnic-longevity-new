import type { LucideIcon } from 'lucide-react';
import { Layers } from 'lucide-react';
import type { HallmarkLibraryEntry } from '@/lib/types';
import type { HUES } from '@/components/viz/tokens';
import { CinematicHubHero } from '@/components/viz/CinematicHubHero';
import { PageHeader } from '@/components/ui/PageHeader';
import { HallmarkHeroVisual } from '@/components/hallmarks/HallmarkHeroVisual';
import type { ThemeAccent } from '@/lib/design-system';

/**
 * Canonical hero for every hallmark deep-dive page. Pairs the site's shared
 * `CinematicHubHero` (decorative cover — hue-keyed molecular field, editorial
 * kicker/title/lead, live stat rail, CTAs) with a `PageHeader` that carries the
 * semantic <h1>, then places the hallmark's constellation visual (top-ranked
 * interventions + coverage ring) beside it — the "why it matters" arrival
 * before the reader drops into mechanism / biomarkers / interventions below.
 *
 * Every hallmark page used to hand-roll ~40 lines of hero markup instead — a
 * radial-gradient section, a hard-coded "Hallmark #N of 12" badge (some of
 * which had drifted out of sync with the library), and its own <Nav />/<Footer />
 * that duplicated `app/hallmarks/layout.tsx`'s SubPageLayout chrome (a real
 * a11y bug: two <main id="main-content"> in one page). This component collapses
 * all of that into one derivation from the library entry.
 */

type Hue = keyof typeof HUES;

interface HallmarkPageHeroProps {
  hallmark: HallmarkLibraryEntry;
  /** Hero accent, keyed to the hub's site-wide palette. */
  hue: Hue;
  /** PageHeader theme — same set of accents as CinematicHubHero, kept in sync. */
  theme: ThemeAccent;
  /**
   * Optional hero eyebrow icon (defaults to Layers). Reuses the LucideIcon
   * type PageHeader itself uses.
   */
  icon?: LucideIcon;
  /**
   * Optional hand-written hero lead paragraph. When omitted the hero uses the
   * library's `summary` — passing an override lets a page keep long-established
   * hand-crafted copy the summary field wasn't tuned for.
   */
  lead?: string;
  /**
   * Optional deep-dive eyebrow shown above the semantic h1. Defaults to the
   * library's `tagline` so both eyebrow and hero kicker read as one thought.
   */
  deepDiveEyebrow?: string;
}

export function HallmarkPageHero({
  hallmark: h,
  hue,
  theme,
  icon = Layers,
  lead,
  deepDiveEyebrow,
}: HallmarkPageHeroProps) {
  const tierACount = h.interventions.filter((iv) => iv.evidence === 'A').length;
  const compoundCount = h.interventions.filter((iv) => iv.category === 'compound').length;

  const stats = [
    { value: `#${h.number} / 12`, label: 'Hallmark of aging' },
    { value: String(h.interventions.length), label: 'Interventions' },
    { value: `${tierACount} Tier A`, label: 'Human evidence' },
    { value: `${h.coverage}%`, label: 'TNiC coverage' },
  ];

  return (
    <>
      <CinematicHubHero
        hue={hue}
        kicker={`Hallmark #${h.number} of 12`}
        // Editorial cover title — the library's tagline is short, one-thought,
        // already crafted for headline use. Wrap the final phrase in <em> so
        // the hue-tinted italic lines up with every other CinematicHubHero.
        title={renderTagline(h.tagline)}
        lead={lead ?? h.summary}
        stats={stats}
        primary={{ href: '/stacks', label: 'Build a targeted stack' }}
        secondary={{ href: '/hallmarks', label: 'All 12 hallmarks' }}
      />
      <section className="container-page pt-8 pb-4 md:pt-12 md:pb-6">
        <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <PageHeader
              as="h1"
              icon={icon}
              eyebrow={deepDiveEyebrow ?? h.tagline}
              title={h.title}
              description={h.whyItMatters}
              theme={theme}
              align="left"
              meta={`${compoundCount} compound interventions · ${h.biomarkers.length} trackable biomarkers`}
            />
          </div>
          <div className="lg:col-span-5">
            <HallmarkHeroVisual hallmark={h} />
          </div>
        </div>
      </section>
    </>
  );
}

/**
 * Split a tagline into leading + accent segment for CinematicHubHero's title
 * pattern (<>plain <em>accent</em></>). Prefers the segment after the last
 * em-dash / colon / "—" so a "Cellular recycling slows — junk accumulates"
 * tagline renders as "Cellular recycling slows — <em>junk accumulates</em>".
 * When no natural split exists, italicizes the trailing 2–3 words so every
 * hero still carries the accent flourish.
 */
function renderTagline(tagline: string): React.ReactNode {
  const dashSplit = tagline.split(/\s+[—–-]\s+/);
  if (dashSplit.length > 1) {
    const head = dashSplit.slice(0, -1).join(' — ');
    const tail = dashSplit[dashSplit.length - 1];
    return (
      <>
        {head} — <em>{tail}</em>
      </>
    );
  }
  const colonSplit = tagline.split(/:\s+/);
  if (colonSplit.length > 1) {
    return (
      <>
        {colonSplit[0]}: <em>{colonSplit.slice(1).join(': ')}</em>
      </>
    );
  }
  const words = tagline.split(/\s+/);
  if (words.length <= 3) return <em>{tagline}</em>;
  const accentCount = Math.min(3, Math.max(1, Math.round(words.length / 3)));
  const head = words.slice(0, words.length - accentCount).join(' ');
  const tail = words.slice(words.length - accentCount).join(' ');
  return (
    <>
      {head} <em>{tail}</em>
    </>
  );
}
