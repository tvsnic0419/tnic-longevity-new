import type { Metadata } from 'next';
import Link from 'next/link';
import { Infinity as InfinityIcon, Check, ArrowRight, Dna } from 'lucide-react';
import { JoinClub } from '@/components/club/JoinClub';
import { CLUB_PLEDGE, CLUB_MANIFESTO } from '@/lib/club';
import { buildPageMetadata } from '@/lib/seo';
import { SubPageLayout } from '@/components/layouts/SubPageLayout';

export const metadata: Metadata = buildPageMetadata({
  title: 'The 150-Year Club — Commit to Maximum Healthspan',
  description:
    "Not a promise of 150 years — a public commitment to the evidence-based pursuit of maximum healthspan. Claim your free charter member card and share your longevity grade.",
  path: '/club',
  keywords: ['150 year club', 'longevity club', 'healthspan pledge', 'longevity community', 'maximum lifespan'],
});

export default function ClubPage() {
  return (
    <SubPageLayout>
      <div className="min-h-screen section-deep">
      <div className="container-page py-16 md:py-24 max-w-3xl">
        {/* Manifesto */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full card-ultra">
            <InfinityIcon className="w-4 h-4 text-accent-emerald" aria-hidden="true" />
            <span className="text-eyebrow !text-accent-emerald">{CLUB_MANIFESTO.eyebrow}</span>
          </div>
          <h1 className="headline-editorial mb-5">{CLUB_MANIFESTO.headline}</h1>
          <p className="text-body max-w-xl mx-auto">{CLUB_MANIFESTO.subhead}</p>
        </div>

        {/* Join */}
        <div className="mb-14">
          <JoinClub />
        </div>

        {/* The pledge */}
        <div className="mb-14">
          <h2 className="heading-section text-center mb-8">The Charter Pledge</h2>
          <ul className="space-y-4">
            {CLUB_PLEDGE.map((line, i) => (
              <li key={i} className="flex gap-4 card-depth rounded-2xl p-5">
                <span className="w-8 h-8 rounded-xl bg-accent-emerald/10 text-accent-emerald flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4" aria-hidden="true" />
                </span>
                <p className="text-body-sm text-foreground/90 self-center">{line}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Honesty note — on brand */}
        <div className="rounded-2xl border border-accent-amber/25 bg-accent-amber/5 p-6 mb-14">
          <p className="text-body-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Why &ldquo;150&rdquo; if we can&rsquo;t promise it?</strong>{' '}
            Because the longest verified human lifespan is 122, and the science of extending healthy
            years is real but early. 150 is the north star that keeps the bar honest and the ambition
            loud. Membership is a commitment to the method — not a claim about the outcome.
          </p>
        </div>

        {/* Funnel */}
        <div className="card-floating rounded-2xl p-8 text-center">
          <Dna className="w-8 h-8 text-accent-cyan mx-auto mb-4" aria-hidden="true" />
          <h2 className="heading-section mb-3">Don&rsquo;t have a grade yet?</h2>
          <p className="text-body-sm max-w-md mx-auto mb-6">
            Take the NICO Starter Questionnaire to build an evidence-graded stack, get your longevity grade,
            then bring it back to your charter card.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/nico" className="focus-ring btn-gradient rounded-full text-sm !px-6">
              Build my stack
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href="/library"
              className="focus-ring btn-ghost-premium inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
            >
              Explore the science
            </Link>
          </div>
        </div>
      </div>
      </div>
    </SubPageLayout>
  );
}
