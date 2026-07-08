import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CompareHub } from '@/components/library/CompareHub';
import { StructuredData } from '@/components/seo/StructuredData';
import { buildBreadcrumbSchema, buildCollectionPageSchema } from '@/lib/seo';
import { evidenceComparisons } from '@/lib/comparisons';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Evidence Comparisons — NMN vs NR, Stack vs Stack',
  description:
    'Neutral longevity comparison tables with PMID anchors: NMN vs NR, GlyNAC vs liposomal glutathione, NRF2 vs Mito stacks, and more.',
  path: '/library/compare',
  keywords: ['NMN vs NR', 'longevity stack comparison', 'sulforaphane vs curcumin', 'evidence table'],
});

export default function CompareIndexPage() {
  const schemas = [
    buildCollectionPageSchema({
      name: 'TNiC Evidence Comparisons',
      description: 'Head-to-head evidence tables for compounds and stacks.',
      path: '/library/compare',
      itemCount: evidenceComparisons.length,
    }),
    buildBreadcrumbSchema([
      { name: 'Library', path: '/library' },
      { name: 'Comparisons', path: '/library/compare' },
    ]),
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pt-6 md:pt-8 pb-20">
      <StructuredData schemas={schemas} />
      <div className="container-page">
        <Link
          href="/library"
          className="focus-ring interactive inline-flex items-center gap-2 text-body-sm text-muted-foreground hover:text-accent-cyan mb-6 rounded-md"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Library
        </Link>
        <CompareHub />
      </div>
    </div>
  );
}