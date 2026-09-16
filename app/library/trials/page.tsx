import type { Metadata } from 'next';
import Link from 'next/link';
import { FlaskConical } from 'lucide-react';
import { PageShell } from '@/components/ui/PageShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { CinematicHubHero } from '@/components/viz/CinematicHubHero';
import { TrialHeroInstrument } from '@/components/library/TrialHeroInstrument';
import { StructuredData } from '@/components/seo/StructuredData';
import { TrialIndexTable } from '@/components/library/TrialIndexTable';
import { buildPageMetadata, buildBreadcrumbSchema } from '@/lib/seo';
import { SITE } from '@/lib/site';
import { trialIndex, trialIndexStats, compoundsWithoutTrialTable } from '@/lib/trial-index.server';
import { DESIGN_CLASS_LABEL } from '@/lib/trial-index';

const rows = trialIndex();
const stats = trialIndexStats();
const uncovered = compoundsWithoutTrialTable();

export const metadata: Metadata = buildPageMetadata({
  title: 'The Trial Index — Every Study the Library Cites',
  description: `All ${stats.total} study rows cited across ${stats.compoundsCovered} TNiC compound deep-dives in one filterable table: design, population, duration, reported outcome and evidence tier, with ${stats.withPmid} PMID-linked. ${stats.byEvidenceBase.human} are human studies.`,
  path: '/library/trials',
  keywords: [
    'longevity supplement clinical trials',
    'supplement study index',
    'human trials longevity compounds',
    'PMID supplement evidence',
    'randomised trials supplements',
  ],
});

/**
 * A Dataset, like the Evidence Table — and for the same reason. The page's value
 * is a structured, enumerable index, and saying so lets an answer engine read it
 * as one rather than treating 363 rows as prose. Every count in the schema is the
 * same build-time derivation the table renders, so the two cannot drift.
 */
function buildDatasetSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'TNiC Trial Index — studies cited by the compound library',
    description: `Every study row cited by a TNiC compound deep-dive: ${stats.total} rows across ${stats.compoundsCovered} of ${stats.compoundsTotal} compounds, with study design, population studied, duration, reported outcome and assigned evidence tier. ${stats.withPmid} rows carry a PubMed identifier. ${stats.byEvidenceBase.human} describe human studies and ${stats.byEvidenceBase.preclinical} preclinical work; rows whose design does not state which are labelled as such rather than assumed.`,
    url: `${SITE.url}/library/trials`,
    isAccessibleForFree: true,
    license: `${SITE.url}/terms`,
    creator: { '@type': 'Organization', name: SITE.name, url: SITE.url },
    temporalCoverage:
      stats.yearRange.earliest && stats.yearRange.latest
        ? `${stats.yearRange.earliest}/${stats.yearRange.latest}`
        : undefined,
    variableMeasured: [
      { '@type': 'PropertyValue', name: 'Study', description: 'The citation as written on the compound deep-dive, with its PubMed identifier where one is cited.' },
      { '@type': 'PropertyValue', name: 'Design', description: 'The study design as authored, plus a TNiC classification into randomised, meta-analysis, crossover, observational, open-label, pharmacokinetic, mechanistic, review or preclinical.' },
      { '@type': 'PropertyValue', name: 'Studied in', description: 'Whether the design describes human participants, preclinical models, both, or does not state.' },
      { '@type': 'PropertyValue', name: 'Duration', description: 'Study duration as reported by the deep-dive.' },
      { '@type': 'PropertyValue', name: 'Reported outcome', description: 'The outcome as summarised on the compound deep-dive.' },
      { '@type': 'PropertyValue', name: 'Tier', description: 'The evidence tier the deep-dive assigned that specific row, including any qualifier such as "preclinical" or "for the combination".' },
    ],
  };
}

const topDesigns = (['rct', 'meta-analysis', 'observational', 'preclinical'] as const).map((d) => ({
  label: DESIGN_CLASS_LABEL[d],
  count: stats.byDesignClass[d],
}));

export default function TrialIndexPage() {
  return (
    <>
      <StructuredData
        schemas={[
          buildDatasetSchema(),
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Library', path: '/library' },
            { name: 'Trial Index', path: '/library/trials' },
          ]),
        ]}
      />

      <CinematicHubHero
        hue="emerald"
        kicker="The Trial Index"
        title={<>Every study, <em>in the open</em>.</>}
        lead={`The library cites ${stats.total} studies across its deep-dives. This is all of them in one table — design, who was studied, for how long, what was reported, and the tier that row earned. ${stats.withPmid} link straight to PubMed.`}
        stats={[
          { value: String(stats.total), label: 'Study rows indexed' },
          { value: String(stats.byEvidenceBase.human), label: 'In human participants' },
          { value: String(stats.humanControlled), label: 'Randomised, crossover or pooled' },
          { value: String(stats.withPmid), label: 'PMID-linked' },
        ]}
        primary={{ href: '#trial-table', label: 'Open the index' }}
        secondary={{ href: '/trust/methodology', label: 'How we grade' }}
        figure={<TrialHeroInstrument />}
        figureCaption="Where the evidence was gathered · derived from the cited studies"
      />

      <PageShell>
        <PageHeader
          icon={FlaskConical}
          eyebrow="Library · Evidence Tools"
          title="The Trial Index"
          description="Every study row cited by a compound deep-dive, gathered into one place. Nothing here is written for this page — each row is lifted from the table on the compound's own page, cell for cell, including the rows that report a null result or a harm."
          theme="emerald"
          align="left"
        />

        {/* The honesty panel. An index this size reads as authority, and the two
            things a reader most needs before trusting it are what the rows are
            (verbatim) and what they are not (complete). Both, in front of the
            table rather than in a footnote. */}
        <div className="premium-card mb-8 p-5 md:p-6">
          <p className="text-label mb-2 text-accent-emerald">Read this before the rows</p>
          <p className="text-body-sm text-[var(--color-text-secondary)]">
            Every cell is <strong className="text-foreground">verbatim</strong> from the compound&rsquo;s
            own deep-dive — design, sample size, duration and reported outcome are reproduced as
            written, and a column a source table never had shows an em-dash rather than being filled
            in from somewhere else. One thing on screen is derived: the small{' '}
            <em>design class</em> under each authored design, which is TNiC&rsquo;s classification, not the
            study&rsquo;s own label. It falls back to nothing rather than guessing, and a design naming
            both people and animals is counted as <em>mixed</em>, never as human evidence.
          </p>
          <p className="text-body-sm mt-3 text-[var(--color-text-secondary)]">
            It is not complete, and the gap is stated rather than hidden:{' '}
            <strong className="text-foreground">{stats.compoundsCovered}</strong> of{' '}
            {stats.compoundsTotal} compounds carry an evidence table, so{' '}
            <strong className="text-foreground">{uncovered.length}</strong> contribute no rows here.
            Of the rows that do,{' '}
            <strong className="text-foreground">{stats.byEvidenceBase.human}</strong> describe human
            studies, <strong className="text-foreground">{stats.byEvidenceBase.preclinical}</strong>{' '}
            preclinical work, and{' '}
            <strong className="text-foreground">{stats.byEvidenceBase.unclear}</strong> do not say —
            those are labelled <em>not stated</em>, not quietly counted as human.{' '}
            <Link
              href="/trust/methodology"
              className="action-link focus-ring rounded text-accent-emerald hover:underline"
            >
              How the grading works
            </Link>
          </p>
        </div>

        {/* Composition at a glance — the same derived counts the table filters on,
            so a reader can see the shape of the evidence before reading a row. */}
        <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {topDesigns.map((d) => (
            <div key={d.label} className="premium-card p-4">
              <p className="text-metric-lg text-foreground">{d.count}</p>
              <p className="text-caption mt-1 text-muted-foreground">{d.label}</p>
            </div>
          ))}
        </div>

        <section id="trial-table" aria-labelledby="trial-table-heading" className="scroll-mt-24">
          <h2 id="trial-table-heading" className="heading-card text-lg mb-1">
            All {stats.total} cited study rows
          </h2>
          <div className="heading-accent-rule mb-5" aria-hidden="true" />
          <TrialIndexTable rows={rows} />
        </section>

        {/* The uncovered list, named. A count alone would let a reader assume the
            gap is random; naming them makes it a review queue. */}
        {uncovered.length > 0 && (
          <section aria-labelledby="uncovered-heading" className="mt-12">
            <h2 id="uncovered-heading" className="heading-card text-lg mb-1">
              {uncovered.length} compounds contribute no rows
            </h2>
            <div className="heading-accent-rule mb-4" aria-hidden="true" />
            <p className="text-body-sm mb-4 max-w-prose text-[var(--color-text-secondary)]">
              These deep-dives discuss their evidence in prose without an evidence table, so there is
              nothing here to extract. They are listed rather than omitted — a gap you can see is a
              review queue; a gap you cannot is a silent claim of completeness.
            </p>
            <ul className="flex flex-wrap gap-2">
              {uncovered.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/library/compounds/${c.slug}`}
                    className="focus-ring inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-caption text-[var(--color-text-secondary)] transition-colors hover:border-accent-emerald/40 hover:text-foreground"
                  >
                    {c.title}
                    <span className="font-mono text-[var(--color-text-faint)]">{c.tier}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/library/evidence" className="tnic-button-outline focus-ring">
            The Evidence Table
          </Link>
          <Link href="/library" className="tnic-button-outline focus-ring">
            Browse the library
          </Link>
          <Link href="/library/compare/head-to-head" className="tnic-button-outline focus-ring">
            Compare any two compounds
          </Link>
        </div>
      </PageShell>
    </>
  );
}
