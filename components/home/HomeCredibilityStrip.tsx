import Link from 'next/link';
import { PlatformCredibilityStrip } from '@/components/trust/PlatformCredibilityStrip';
import { platformStats } from '@/lib/derived-stats';

/**
 * Homepage credibility strip, placed directly below the cinematic hero.
 *
 * Numbers come entirely from the derived-stats source of truth — no hardcoded
 * values — so they can never drift from what is actually published. The trust
 * caption states only claims the platform actually honours elsewhere:
 * evidence tiered A–C, one verified product per compound, no pay-for-placement
 * (see /trust/methodology and /trust/sponsorship). Server-rendered, so all of
 * it ships in the initial HTML.
 */
export function HomeCredibilityStrip() {
  return (
    <section className="container-page py-10 md:py-14" aria-label="Platform credibility">
      <PlatformCredibilityStrip stats={platformStats} />
      <p className="mt-4 text-center text-xs text-muted-foreground max-w-2xl mx-auto">
        Every grade traces to the strength of human evidence, tiered A–C. One
        verified product per compound — no pay-for-placement.{' '}
        <Link
          href="/trust/methodology"
          className="focus-ring underline underline-offset-2 hover:text-foreground"
        >
          How we grade
        </Link>
        .
      </p>
    </section>
  );
}
