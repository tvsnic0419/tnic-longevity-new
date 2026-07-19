import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { MechanismAtlasHub } from '@/components/library/MechanismAtlasHub';
import { StructuredData } from '@/components/seo/StructuredData';
import { buildBreadcrumbSchema, buildCollectionPageSchema, buildPageMetadata } from '@/lib/seo';
import { mechanismAtlas } from '@/lib/mechanism-atlas';

export const metadata = buildPageMetadata({
  title: 'Mechanism Atlas — Hallmarks, Pathways & Compound Levers in One Map',
  description:
    'An interactive map linking all 12 hallmarks of aging to the 6 molecular convergence pathways and every compound and peptide lever that engages them — trace any hallmark to its interventions, or any compound back to the biology it touches.',
  path: '/library/atlas',
  keywords: [
    'hallmarks of aging map',
    'longevity mechanism map',
    'aging pathways diagram',
    'compound pathway hallmark',
    'AMPK NRF2 sirtuin mTOR',
    'longevity intervention map',
  ],
});

export default function MechanismAtlasPage() {
  const schemas = [
    buildCollectionPageSchema({
      name: 'TNiC Mechanism Atlas',
      description:
        'Cross-linked map of the 12 hallmarks of aging, 6 convergence pathways, and their compound and peptide levers.',
      path: '/library/atlas',
      itemCount:
        mechanismAtlas.hallmarks.length + mechanismAtlas.pathways.length + mechanismAtlas.levers.length,
    }),
    buildBreadcrumbSchema([
      { name: 'Library', path: '/library' },
      { name: 'Mechanism Atlas', path: '/library/atlas' },
    ]),
  ];

  return (
    <div className="min-h-screen canvas-scrim text-foreground pt-6 md:pt-8 pb-20">
      <StructuredData schemas={schemas} />
      <div className="container-page">
        <Link
          href="/library"
          className="focus-ring interactive inline-flex items-center gap-2 text-body-sm text-muted-foreground hover:text-accent-cyan mb-6 rounded-md"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Library
        </Link>
        <MechanismAtlasHub />
      </div>
    </div>
  );
}
