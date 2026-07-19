import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Scale } from 'lucide-react';
import { EvidenceCompareTable } from '@/components/library/EvidenceCompareTable';
import { StructuredData } from '@/components/seo/StructuredData';
import { PageHeader } from '@/components/ui/PageHeader';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import {
  getAllComparisonSlugs,
  getComparison,
} from '@/lib/comparisons';
import { getRelatedComparisons } from '@/lib/comparison-relations';
import { buildArticleSchema, buildBreadcrumbSchema, buildPageMetadata } from '@/lib/seo';
import { getCompareContext } from '@/lib/hub-context';

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
    title: `${comp.title} — Evidence Comparison`,
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

        <EvidenceCompareTable comparison={comparison} />

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