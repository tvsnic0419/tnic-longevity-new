import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Scale, ShieldCheck } from 'lucide-react';
import { EvidenceCompareTable } from '@/components/library/EvidenceCompareTable';
import { StructuredData } from '@/components/seo/StructuredData';
import { PageHeader } from '@/components/ui/PageHeader';
import { AnswerBox } from '@/components/ui/AnswerBox';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { GuideVerifiedPick } from '@/components/guides/GuideVerifiedPick';
import { getComparePicks } from '@/lib/product-picks';
import { compounds } from '@/lib/data';
import {
  getAllComparisonSlugs,
  getComparison,
} from '@/lib/comparisons';
import { getRelatedComparisons } from '@/lib/comparison-relations';
import { buildArticleSchema, buildBreadcrumbSchema, buildFaqPageSchema, buildPageMetadata } from '@/lib/seo';
import { getCompareContext } from '@/lib/hub-context';

/** Join authored bullet points into one clean sentence-list for FAQ answers. */
function joinPoints(points: string[]): string {
  return points
    .map((p) => p.trim().replace(/[.;]+$/, ''))
    .filter(Boolean)
    .join('; ')
    .concat('.');
}

export function generateStaticParams() {
  return getAllComparisonSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const comp = getComparison(slug);
  if (!comp) return { title: 'Not Found' };
  return buildPageMetadata({
    title: `${comp.title}: Which Is Better? Evidence Comparison`,
    description: comp.summary,
    path: `/library/compare/${slug}`,
    keywords: comp.keywords,
  });
}

export default async function CompareDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const comparison = getComparison(slug);
  if (!comparison) notFound();

  const relatedComparisons = getRelatedComparisons(slug);
  // Verified buy paths for whichever compared compounds have a curated pick —
  // "X vs Y" is peak purchase intent, so surface the product action here.
  // Restrict to picks whose compound is graded in lib/data.ts, since the card
  // shows an evidence tier and must never render a buy button beside an absent
  // one (e.g. NR/TUDCA have picks but no graded compound).
  const comparePicks = getComparePicks(slug).filter((pick) =>
    compounds.some((c) => c.id === pick.compoundId),
  );

  // FAQ composed faithfully from the comparison's own authored verdict and
  // when-to-choose guidance — no new claims — to win FAQ-rich SERP results.
  const faq = buildFaqPageSchema([
    {
      question: `${comparison.labelA} vs ${comparison.labelB}: which is better?`,
      answer: comparison.verdict,
    },
    {
      question: `When should you choose ${comparison.labelA}?`,
      answer: joinPoints(comparison.whenChooseA),
    },
    {
      question: `When should you choose ${comparison.labelB}?`,
      answer: joinPoints(comparison.whenChooseB),
    },
  ]);

  const schemas = [
    buildArticleSchema({
      title: comparison.title,
      description: comparison.summary,
      path: `/library/compare/${slug}`,
      evidenceTier: comparison.evidenceTier,
    }),
    buildBreadcrumbSchema([
      { name: 'Library', path: '/library' },
      { name: 'Comparisons', path: '/library/compare' },
      { name: comparison.title, path: `/library/compare/${slug}` },
    ]),
    ...(faq ? [faq] : []),
  ];

  return (
    <div className="min-h-screen canvas-scrim text-foreground pt-6 md:pt-8 pb-20">
      <StructuredData schemas={schemas} />
      <div className="container-page max-w-5xl">
        <Link
          href="/library/compare"
          className="focus-ring interactive inline-flex items-center gap-2 text-body-sm text-muted-foreground hover:text-accent-cyan mb-6 rounded-md"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          All comparisons
        </Link>

        <PageHeader
          icon={Scale}
          eyebrow={`${comparison.labelA} vs ${comparison.labelB}`}
          title={comparison.title}
          description={comparison.subtitle}
          theme="cyan"
          align="left"
          context={getCompareContext(comparison)}
        />

        {/* Answer-first: the authored verdict leads the page — above the table —
            so the citable "which is better" answer is in the first screen for
            readers and AI answer engines, not buried below the metric grid. */}
        <AnswerBox question={`${comparison.title}: which is better?`} className="mb-8">
          {comparison.verdict}
        </AnswerBox>

        <EvidenceCompareTable comparison={comparison} />

        {comparePicks.length > 0 && (
          <section className="mt-10" aria-labelledby="compare-picks-heading">
            <h2 id="compare-picks-heading" className="text-label text-accent-emerald mb-2">
              {comparePicks.length > 1 ? 'The verified picks' : 'The verified pick'}
            </h2>
            <p className="text-body-sm text-muted-foreground mb-4 max-w-2xl">
              Decided? Each verified pick matches the studied dose and form, and links straight to the
              manufacturer.
            </p>
            <div className="grid gap-4">
              {comparePicks.map((pick) => (
                <GuideVerifiedPick key={pick.compoundId} compoundId={pick.compoundId} showDisclosure={false} />
              ))}
            </div>
            <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-amber" aria-hidden="true" />
              <span>
                Links go to the manufacturer and may carry an affiliate token — at no extra cost to you.
                TNiC sells nothing and commission never moves a ranking or evidence tier. Educational
                information, not medical advice.
              </span>
            </p>
          </section>
        )}

        {relatedComparisons.length > 0 && (
          <section className="mt-10" aria-labelledby="related-comparisons-heading">
            <h2
              id="related-comparisons-heading"
              className="text-label text-accent-cyan mb-4"
            >
              Related comparisons
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {relatedComparisons.map((related) => (
                <li key={related.slug}>
                  <Link
                    href={`/library/compare/${related.slug}`}
                    className="focus-ring interactive group flex items-center justify-between gap-3 glass glass-hover rounded-xl p-4"
                  >
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-foreground truncate">
                        {related.title}
                      </span>
                      <span className="block text-xs text-muted-foreground truncate">
                        {related.labelA} vs {related.labelB}
                      </span>
                    </span>
                    <EvidenceTag tier={related.evidenceTier} className="shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}