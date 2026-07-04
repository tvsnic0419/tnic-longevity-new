import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Scale } from 'lucide-react';
import { EvidenceCompareTable } from '@/components/library/EvidenceCompareTable';
import { StructuredData } from '@/components/seo/StructuredData';
import { PageHeader } from '@/components/ui/PageHeader';
import {
  getAllComparisonSlugs,
  getComparison,
} from '@/lib/comparisons';
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
    <div className="min-h-screen bg-background text-foreground pt-6 md:pt-8 pb-20">
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
      </div>
    </div>
  );
}