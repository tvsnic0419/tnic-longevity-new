import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { CinematicHubHero } from '@/components/viz/CinematicHubHero';
import { InsightsCharts } from '@/components/insights/InsightsCharts';
import { ConnectionMatrix } from '@/components/insights/ConnectionMatrix';
import { FieldNotes } from '@/components/insights/FieldNotes';
import { CountUp } from '@/components/ui/CountUp';
import { buildPageMetadata } from '@/lib/seo';
import { INSIGHTS_TOTALS } from '@/lib/insights';
import {
  LIBRARY_COMPOUND_COUNT,
  LIBRARY_HALLMARK_COVERAGE,
  LIBRARY_TIER_SPLIT,
} from '@/lib/insights-library';

export const metadata = buildPageMetadata({
  title: 'Longevity by the Numbers — The Library as Data',
  description:
    'A data view of the TNiC library: evidence-tier breakdown and hallmark coverage across every compound deep-dive, plus oral bioavailability, dosing rhythm and a compound × pathway × hallmark map for the fully-graded set — every figure computed from the library, not marketing.',
  path: '/insights',
  keywords: [
    'longevity data',
    'supplement bioavailability comparison',
    'hallmarks of aging coverage',
    'evidence-graded compounds',
    'compound hallmark map',
  ],
});

const bandStats: { value: number; suffix?: string; label: string; sub: string }[] = [
  { value: LIBRARY_COMPOUND_COUNT, label: 'Compound deep-dives', sub: 'Each rated A–C on human evidence' },
  { value: INSIGHTS_TOTALS.studies, label: 'Studies cited', sub: `Across the ${INSIGHTS_TOTALS.compounds} fully-graded compounds` },
  { value: INSIGHTS_TOTALS.pathways, label: 'Pathways', sub: 'The "verb" between take & age' },
  { value: INSIGHTS_TOTALS.hallmarks, label: 'Hallmarks', sub: 'Full mechanistic coverage' },
  { value: INSIGHTS_TOTALS.medianBioavailability, suffix: '%', label: 'Median bioavailability', sub: `Across ${INSIGHTS_TOTALS.withBioavailability} measured compounds` },
];

function SectionHead({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8 max-w-2xl">
      <p className="text-label text-accent-cyan mb-3">{eyebrow}</p>
      <h2 className="heading-section mb-3">{title}</h2>
      <div className="heading-accent-rule mb-4" aria-hidden="true" />
      <p className="text-body">{children}</p>
    </div>
  );
}

export default function InsightsPage() {
  return (
    <SubPageLayout>
      <CinematicHubHero
        hue="cyan"
        kicker="Longevity by the Numbers"
        title={<>The library, <em>as data</em>.</>}
        lead={`Every figure on this page is counted from the library itself. Evidence tiers and hallmark coverage span all ${LIBRARY_COMPOUND_COUNT} compound deep-dives; absorption, dosing rhythm, citation depth and the connection map describe the ${INSIGHTS_TOTALS.compounds} fully-graded compounds that carry those fields. Nothing here is a marketing number.`}
        stats={[
          { value: String(LIBRARY_COMPOUND_COUNT), label: 'Compound deep-dives', href: '/library/compounds' },
          { value: String(INSIGHTS_TOTALS.studies), label: 'Studies cited', href: '/trust' },
          { value: String(INSIGHTS_TOTALS.pathways), label: 'Pathways', href: '/pathways' },
          { value: `A–C`, label: 'Evidence tiers', href: '/trust/methodology' },
        ]}
        primary={{ href: '/library', label: 'Open the library' }}
        secondary={{ href: '/hallmarks', label: 'The 12 hallmarks' }}
      />

      <div className="container-page pb-20">
        {/* Headline stat band */}
        <section aria-label="Library at a glance" className="mb-16">
          <dl className="summary-strip">
            {bandStats.map((s) => (
              <div key={s.label} className="stat-card">
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <CountUp value={s.value} suffix={s.suffix} className="stat-value block" />
                  <span className="mt-1 block text-body-sm font-medium text-foreground">{s.label}</span>
                  <span className="mt-0.5 block text-micro text-muted-foreground">{s.sub}</span>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Charts */}
        <section className="mb-20">
          <SectionHead eyebrow="By the numbers" title="Five reads on the library">
            Distribution and coverage across all {LIBRARY_COMPOUND_COUNT} deep-dives; absorption,
            dosing rhythm and citation depth across the {INSIGHTS_TOTALS.compounds} fully-graded
            compounds that carry those measurements. Bars and tiles link straight to the compounds
            and hallmarks behind them.
          </SectionHead>
          <InsightsCharts
            libraryTierSplit={LIBRARY_TIER_SPLIT}
            libraryHallmarkCoverage={LIBRARY_HALLMARK_COVERAGE}
            libraryCompoundCount={LIBRARY_COMPOUND_COUNT}
          />
        </section>

        {/* Connection matrix */}
        <section className="mb-20">
          <SectionHead eyebrow="The map" title="Compound × pathway × hallmark">
            How the library connects: each of the {INSIGHTS_TOTALS.compounds} fully-graded compounds
            acts through a pathway onto the hallmarks of aging. Cells are colored by evidence tier, so you can see both <em>what</em> a compound
            touches and <em>how well-proven</em> it is in one grid.
          </SectionHead>
          <ConnectionMatrix />
        </section>

        {/* Field notes */}
        <section className="mb-16">
          <SectionHead eyebrow="Good to know" title="Field notes">
            High-signal facts worth carrying around — each one drawn from a claim cited on the
            compound&apos;s own page, so you can trace it. Tap any card to read the evidence.
          </SectionHead>
          <FieldNotes />
        </section>

        {/* Close */}
        <div className="flex flex-col items-start gap-3 rounded-2xl border border-border/70 bg-card/30 p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-body-sm max-w-xl text-muted-foreground">
            Every number here is derived live from the library — it can&apos;t drift above what&apos;s
            actually published. Explore the full evidence, compound by compound.
          </p>
          <Link
            href="/library"
            className="btn-gradient focus-ring group shrink-0 justify-center rounded-full text-sm !py-3 !px-6"
          >
            Explore the library
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </SubPageLayout>
  );
}
