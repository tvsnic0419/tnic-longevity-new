import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PathwaysHub } from '@/components/library/PathwaysHub';
import { StructuredData } from '@/components/seo/StructuredData';
import { buildBreadcrumbSchema, buildCollectionPageSchema, buildPageMetadata } from '@/lib/seo';
import { pathways } from '@/lib/pathways';

export const metadata = buildPageMetadata({
  title: 'Molecular Pathways — AMPK, NRF2, Sirtuins, mTOR, Mitochondria, Senescence',
  description:
    'The six molecular pathways TNiC compounds converge on, each with every compound and peptide lever that engages it — the cross-cutting view neither compound nor hallmark pages show alone.',
  path: '/library/pathways',
  keywords: ['AMPK pathway', 'NRF2 KEAP1', 'sirtuin NAD+ axis', 'mTOR autophagy', 'mitochondrial quality control', 'senescence clearance', 'longevity mechanism'],
});

export default function PathwaysIndexPage() {
  const schemas = [
    buildCollectionPageSchema({
      name: 'TNiC Molecular Pathways',
      description: 'Cross-cutting mechanism pages — every compound and peptide lever on each pathway.',
      path: '/library/pathways',
      itemCount: pathways.length,
    }),
    buildBreadcrumbSchema([
      { name: 'Library', path: '/library' },
      { name: 'Pathways', path: '/library/pathways' },
    ]),
  ];

  return (
    <div className="min-h-screen canvas-scrim text-foreground pt-6 md:pt-8 pb-20">
      <StructuredData schemas={schemas} />
      <div className="container-page">
        <Link
          href="/library"
          className="focus-ring interactive inline-flex items-center gap-2 text-body-sm text-muted-foreground hover:text-accent-violet mb-6 rounded-md"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Library
        </Link>
        <PathwaysHub />
      </div>
    </div>
  );
}
