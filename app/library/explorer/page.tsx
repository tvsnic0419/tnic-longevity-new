import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Network } from 'lucide-react';
import { KnowledgeGraphExplorer } from '@/components/library/KnowledgeGraphExplorer';
import { StructuredData } from '@/components/seo/StructuredData';
import { PageHeader } from '@/components/ui/PageHeader';
import { getKnowledgeGraphData } from '@/lib/knowledge-graph';
import { buildArticleSchema, buildBreadcrumbSchema, buildPageMetadata } from '@/lib/seo';

const PATH = '/library/explorer';

export const metadata: Metadata = buildPageMetadata({
  title: 'Knowledge Graph — Hallmarks & Compounds Interlinked',
  description:
    'Explore how all 12 hallmarks of aging connect to every evidence-graded compound in the TNiC library. Hover or click any node to see its connections and open its page.',
  path: PATH,
  keywords: ['hallmarks of aging', 'longevity knowledge graph', 'compound interlink', 'evidence graph'],
});

export default function KnowledgeGraphExplorerPage() {
  const { hallmarks, compounds, edges } = getKnowledgeGraphData();

  const schemas = [
    buildArticleSchema({
      title: 'Knowledge Graph — Hallmarks & Compounds Interlinked',
      description:
        'An interactive map of every hallmark-of-aging-to-compound relationship curated by TNiC, with real evidence grades and direct links.',
      path: PATH,
      evidenceTier: 'A',
    }),
    buildBreadcrumbSchema([
      { name: 'Library', path: '/library' },
      { name: 'Knowledge Graph', path: PATH },
    ]),
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pt-6 md:pt-8 pb-20">
      <StructuredData schemas={schemas} />
      <div className="container-page max-w-5xl">
        <Link
          href="/library"
          className="focus-ring interactive inline-flex items-center gap-2 text-body-sm text-muted-foreground hover:text-accent-cyan mb-6 rounded-md"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back to Library
        </Link>

        <PageHeader
          icon={Network}
          eyebrow={`${hallmarks.length} hallmarks · ${compounds.length} compounds · ${edges.length} connections`}
          title="Knowledge Graph"
          description="Every hallmark of aging, every evidence-graded compound that targets it, and how they connect — derived directly from the same data that powers every page on this site. Nothing here is decorative; every edge is a real, resolvable link."
          theme="cyan"
          align="left"
        />

        <div className="mt-8 rounded-xl border border-border bg-card/40 p-4 md:p-8">
          <KnowledgeGraphExplorer hallmarks={hallmarks} compounds={compounds} edges={edges} />
        </div>

        <p className="text-caption text-center mt-8 max-w-2xl mx-auto">
          Inner ring — the 12 hallmarks of aging. Outer ring — compounds with a full library
          deep-dive, colored by evidence grade (green = Tier A, cyan = Tier B, amber = Tier C).
        </p>
      </div>
    </div>
  );
}
