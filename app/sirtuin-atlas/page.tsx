import type { Metadata } from 'next';
import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { SirtuinAtlas } from '@/components/sirtuins/SirtuinAtlas';
import { StructuredData } from '@/components/seo/StructuredData';
import { buildArticleSchema, buildBreadcrumbSchema } from '@/lib/seo';
import { EntityChips } from '@/components/ui/EntityChips';
import { SIRTUIN_CANDIDATES } from '@/lib/sirtuin-atlas-data';
import { compoundEntityByNameOrSlug, resolvePathways, resolveHallmarks } from '@/lib/entity-graph';
import { pathways } from '@/lib/pathways';
import type { GraphEntity } from '@/lib/entity-graph';

export const metadata: Metadata = {
  title: 'Sirtuin Atlas: SIRT1–SIRT7 Activators, NAD+ & Evidence | TNiC',
  description:
    'Explore an interactive evidence atlas of SIRT1 through SIRT7. Compare direct activators, NAD+ support, expression effects, research compounds, human translation stage, and unproven supplement claims.',
  alternates: { canonical: '/sirtuin-atlas' },
  keywords: [
    'SIRT1 activator',
    'SIRT2 activator',
    'SIRT3 activator',
    'SIRT6 activator',
    'sirtuins',
    'NAD+',
    'NMN',
    'NR',
    'resveratrol',
    'longevity',
  ],
  openGraph: {
    title: 'The Sirtuin Atlas — SIRT1 to SIRT7',
    description: 'What actually activates human sirtuins? An interactive target-engagement and translation map from TNiC.',
    url: '/sirtuin-atlas',
    type: 'article',
    siteName: 'TNiC',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Sirtuin Atlas — SIRT1 to SIRT7',
    description: 'Direct activators, NAD+ support, signaling claims and evidence maturity — separated instead of blurred together.',
  },
};

export default function SirtuinAtlasPage() {
  const schemas = [
    buildArticleSchema({
      title: 'The Sirtuin Atlas — SIRT1 to SIRT7 Activators and Evidence',
      description:
        'Interactive evidence map separating direct sirtuin activation, NAD+ substrate support, expression/signaling effects and translation maturity across SIRT1 through SIRT7.',
      path: '/sirtuin-atlas',
      evidenceTier: 'B',
    }),
    buildBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Sirtuin Atlas', path: '/sirtuin-atlas' },
    ]),
  ];

  // ── The atlas's place in the graph, derived rather than asserted ──────────
  // This page used to server-render 12,183 characters and zero in-body links.
  // Every entity below is resolved from a registry: the candidates the atlas
  // itself scores (those with a deep-dive behind them), the pathways the
  // pathway registry files under `sirtuins`, and the hallmarks those pathways
  // declare they act on. Nothing here is hand-listed, so the rail moves when
  // the registries do.
  const candidateCompounds = SIRTUIN_CANDIDATES
    .map((c) => compoundEntityByNameOrSlug(c.id))
    .filter((e): e is GraphEntity => e !== null);
  const sirtuinPathways = resolvePathways(
    pathways.filter((p) => p.category === 'sirtuins').map((p) => p.slug),
  );
  const reachedHallmarks = resolveHallmarks([
    ...new Set(pathways.filter((p) => p.category === 'sirtuins').flatMap((p) => p.hallmarkIds)),
  ]);

  return (
    <SubPageLayout>
      <StructuredData schemas={schemas} />
      <SirtuinAtlas />

      <section
        aria-labelledby="atlas-graph-heading"
        className="container-page mt-16 mb-4"
      >
        <div className="premium-card p-5 md:p-7">
          <p className="text-label mb-2 text-accent-violet">Where this connects</p>
          <h2 id="atlas-graph-heading" className="heading-section mb-2 text-xl md:text-2xl">
            The sirtuin layer, and what sits either side of it.
          </h2>
          <p className="text-body-sm mb-6 max-w-3xl text-muted-foreground">
            Sirtuin activity is one mechanism among several. These are the compounds the
            atlas scores that have a full evidence module, the pathways this layer belongs
            to, and the hallmarks of aging those pathways act on.
          </p>
          <div className="grid gap-5 md:grid-cols-3">
            <EntityChips label="Scored here, with a deep-dive" entities={candidateCompounds} />
            <EntityChips label="Pathways in this layer" entities={sirtuinPathways} />
            <EntityChips label="Hallmarks these pathways act on" entities={reachedHallmarks} />
          </div>
        </div>
      </section>
    </SubPageLayout>
  );
}
