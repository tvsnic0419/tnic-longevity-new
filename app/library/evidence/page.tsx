import type { Metadata } from 'next';
import Link from 'next/link';
import { Table2 } from 'lucide-react';
import { PageShell } from '@/components/ui/PageShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { CinematicHubHero } from '@/components/viz/CinematicHubHero';
import { LibraryHeroInstrument } from '@/components/library/LibraryHeroInstrument';
import { StructuredData } from '@/components/seo/StructuredData';
import { EvidenceIndexTable } from '@/components/library/EvidenceIndexTable';
import { buildPageMetadata, buildBreadcrumbSchema } from '@/lib/seo';
import { SITE } from '@/lib/site';
import { evidenceRows, evidenceIndexStats, evidenceHallmarkFacets } from '@/lib/evidence-index';

const stats = evidenceIndexStats();
const hallmarks = evidenceHallmarkFacets();

export const metadata: Metadata = buildPageMetadata({
  title: 'The Evidence Table — Every Graded Compound, One View',
  description: `All ${stats.total} compounds in the TNiC library in a single sortable table: evidence tier, TNiC Score, score confidence, and the hallmarks of aging each one acts on. ${stats.unscored} carry no composite score and say so.`,
  path: '/library/evidence',
  keywords: [
    'longevity supplement evidence table',
    'supplement evidence grades',
    'compound evidence comparison',
    'anti-aging compound index',
  ],
});

/**
 * A Dataset, not an Article. The page's value is the table — a structured,
 * enumerable index over a registry — and describing it as one lets an answer
 * engine understand what it is looking at rather than treating a 100-row table
 * as prose. Every figure in it is derived at build time from the same
 * registries the deep-dives render, so the schema cannot drift from the page.
 */
function buildDatasetSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'TNiC Evidence Table — graded longevity compounds',
    description: `Evidence tier, composite TNiC Score, score confidence and hallmark coverage for all ${stats.total} compounds graded in the TNiC library. ${stats.scored} carry a composite score; ${stats.unscored} have no scored source and are marked as such rather than estimated.`,
    url: `${SITE.url}/library/evidence`,
    isAccessibleForFree: true,
    license: `${SITE.url}/terms`,
    creator: { '@type': 'Organization', name: SITE.name, url: SITE.url },
    variableMeasured: [
      { '@type': 'PropertyValue', name: 'Evidence tier', description: 'A (clinical), B (emerging) or C (preclinical), assigned on the strength of human evidence.' },
      { '@type': 'PropertyValue', name: 'TNiC Score', description: 'Composite 0–100 across human evidence, clinical evidence, mechanistic strength, safety, bioavailability and longevity relevance.' },
      { '@type': 'PropertyValue', name: 'Score confidence', description: 'High, moderate or limited, set by which source the composite could be derived from.' },
      { '@type': 'PropertyValue', name: 'Hallmarks of aging', description: 'Which of the twelve hallmarks the compound acts on.' },
    ],
  };
}

export default function EvidenceIndexPage() {
  return (
    <>
      <StructuredData
        schemas={[
          buildDatasetSchema(),
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Library', path: '/library' },
            { name: 'Evidence Table', path: '/library/evidence' },
          ]),
        ]}
      />

      <CinematicHubHero
        hue="cyan"
        kicker="The Evidence Table"
        title={<>Every grade, <em>side by side</em>.</>}
        lead={`The whole library as one table — tier, composite score, score confidence and hallmark coverage for all ${stats.total} graded compounds. Sort it, filter it, and see exactly where the evidence thins out.`}
        stats={[
          { value: String(stats.total), label: 'Compounds graded', href: '/library' },
          { value: String(stats.byTier.A), label: 'At Tier A' },
          { value: String(stats.scored), label: 'With a composite score' },
          { value: String(stats.unscored), label: 'Not scored — and said so' },
        ]}
        primary={{ href: '#evidence-table', label: 'Open the table' }}
        secondary={{ href: '/trust/methodology', label: 'How we grade' }}
        figure={<LibraryHeroInstrument />}
        figureCaption="Evidence split · derived from the graded library"
      />

      <PageShell>
        <PageHeader
          icon={Table2}
          eyebrow="Library · Evidence Tools"
          title="The Evidence Table"
          description={`Every compound TNiC has graded, in one view, with the same tier and score its own deep-dive carries. Nothing here is authored separately — each row reads from the registry behind that compound's page, including where that registry has nothing to say.`}
          theme="cyan"
          align="left"
        />

        {/* The honesty panel. A table like this invites the reader to treat
            every number as equally solid, and 57 of these composites rest on a
            canonical record rather than a scored trial set. Saying so in front
            of the table is the difference between an index and a leaderboard. */}
        <div className="premium-card mb-8 p-5 md:p-6">
          <p className="text-label mb-2 text-accent-cyan">Read this before the numbers</p>
          <p className="text-body-sm text-[var(--color-text-secondary)]">
            The <strong className="text-foreground">tier</strong> is the claim TNiC stands behind: A,
            B or C, set by the strength of human evidence.{' '}
            <strong className="text-foreground">TNiC Score</strong> is a derived convenience — a
            composite across six dimensions — and it is only as good as the source under it. Of the{' '}
            {stats.total} compounds here, <strong className="text-foreground">{stats.scored}</strong>{' '}
            can be scored at all; of those,{' '}
            <strong className="text-foreground">{stats.byConfidence.high}</strong> at high confidence,{' '}
            <strong className="text-foreground">{stats.byConfidence.moderate}</strong> at moderate,
            and <strong className="text-foreground">{stats.byConfidence.limited}</strong> at limited.
            The remaining <strong className="text-foreground">{stats.unscored}</strong> have no
            scored source and are listed as <em>Not scored</em> rather than given a number to fill
            the column. Sort by score if it is useful, but the tier is the grade.{' '}
            <Link
              href="/trust/methodology"
              className="action-link focus-ring rounded text-accent-cyan hover:underline"
            >
              How the grading works
            </Link>
          </p>
        </div>

        <section id="evidence-table" aria-labelledby="evidence-table-heading" className="scroll-mt-24">
          <h2 id="evidence-table-heading" className="heading-card text-lg mb-1">
            All {stats.total} graded compounds
          </h2>
          <div className="heading-accent-rule mb-5" aria-hidden="true" />
          <EvidenceIndexTable rows={evidenceRows} hallmarks={hallmarks} />
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/library/trials" className="tnic-button-outline focus-ring">
            The Trial Index — every study cited
          </Link>
          <Link href="/library" className="tnic-button-outline focus-ring">
            Browse the library as cards
          </Link>
          <Link href="/library/compare/head-to-head" className="tnic-button-outline focus-ring">
            Compare any two compounds
          </Link>
          <Link href="/best" className="tnic-button-outline focus-ring">
            Best supplements by goal
          </Link>
        </div>
      </PageShell>
    </>
  );
}
