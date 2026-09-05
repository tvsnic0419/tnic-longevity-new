'use client';

import Link from 'next/link';

import { ExternalAction } from '@/components/ui/ExternalAction';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { cn } from '@/lib/utils';
import { trackEvent } from '@/lib/analytics';
import { ANALYTICS_EVENTS } from '@/lib/analytics-events';
import { getActiveSponsor, type SponsorSlotId, type SponsorTheme } from '@/lib/sponsors';

/**
 * A single, clearly-labeled sponsor placement.
 *
 * Renders `null` when the slot is unsold, so it is safe to drop into any page
 * — no empty box, no layout shift. The "Sponsored" label and the link to the
 * sponsorship policy keep the commercial/editorial separation the site
 * promises. Outbound links use `rel="sponsored"` and fire a `sponsor_click`
 * analytics event (cookieless, like every other conversion signal).
 */

const THEME: Record<SponsorTheme, { border: string; accent: string }> = {
  cyan: { border: 'border-accent-cyan/30', accent: 'text-accent-cyan' },
  emerald: { border: 'border-accent-emerald/30', accent: 'text-accent-emerald' },
  violet: { border: 'border-accent-violet/30', accent: 'text-accent-violet' },
  amber: { border: 'border-accent-amber/30', accent: 'text-accent-amber' },
  rose: { border: 'border-accent-rose/30', accent: 'text-accent-rose' },
};

interface SponsorSlotProps {
  slot: SponsorSlotId;
  className?: string;
}

export function SponsorSlot({ slot, className }: SponsorSlotProps) {
  const sponsor = getActiveSponsor(slot);
  if (!sponsor) return null;

  const theme = THEME[sponsor.theme ?? 'cyan'];

  return (
    <GlassPanel
      depth="mid"
      className={cn('rounded-2xl border p-5', theme.border, className)}
    >
      <aside aria-label="Sponsored message" className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-label uppercase tracking-wider text-muted-foreground">
            Sponsored
          </span>
          <Link
            href="/trust/sponsorship"
            className="focus-ring link-underline rounded text-caption text-muted-foreground hover:text-accent-cyan"
          >
            Why this is here
          </Link>
        </div>

        <div>
          <p className={cn('font-display text-lg font-medium', theme.accent)}>
            {sponsor.name}
          </p>
          <p className="mt-1 text-body-sm text-muted-foreground">{sponsor.tagline}</p>
        </div>

        <ExternalAction
          href={sponsor.href}
          destination={`${sponsor.cta} — ${sponsor.name}`}
          variant="inline"
          onClick={() =>
            trackEvent(ANALYTICS_EVENTS.sponsorClick, { sponsor: sponsor.id, slot })
          }
          className="interactive w-fit rounded-lg text-sm font-semibold text-foreground hover:text-accent-cyan"
        >
          {sponsor.cta}
        </ExternalAction>
      </aside>
    </GlassPanel>
  );
}
