import type { Metadata } from 'next';
import Link from 'next/link';
import { Waypoints, ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StructuredData } from '@/components/seo/StructuredData';
import { buildPageMetadata, buildBreadcrumbSchema } from '@/lib/seo';
import {
  pathways,
  pathwayCategoryMeta,
  pathwayCategoryOrder,
  getPathwaysByCategory,
} from '@/lib/pathways';

export const metadata: Metadata = buildPageMetadata({
  title: 'Longevity Pathways — The Molecular Actors of Aging',
  description:
    'The mechanistic pathways compounds act through — PINK1/Parkin mitophagy, SIRT3, NRF2, AMPK, mTOR, NAD⁺ and more — each linked to the hallmarks it moves and the compounds that engage it.',
  path: '/pathways',
  keywords: [
    'longevity pathways',
    'PINK1 Parkin mitophagy',
    'SIRT3',
    'NRF2 pathway',
    'AMPK mTOR',
    'NAD+ sirtuins',
    'mechanism of aging',
  ],
});

const themeAccent: Record<string, string> = {
  cyan: 'text-accent-cyan',
  violet: 'text-accent-violet',
  emerald: 'text-accent-emerald',
  amber: 'text-accent-amber',
  rose: 'text-accent-rose',
};

/**
 * Server-rendered hub for the molecular pathway layer — the "how" between
 * compounds and hallmarks. Every name/summary is real crawlable markup.
 */
export default function PathwaysHubPage() {
  return (
    <div className="py-8 md:py-10">
      <StructuredData
        schemas={[
          buildBreadcrumbSchema([
            { name: 'Library', path: '/library' },
            { name: 'Pathways', path: '/pathways' },
          ]),
        ]}
      />
      <div className="container-page">
        <PageHeader
          icon={Waypoints}
          eyebrow="Molecular Pathways"
          title="How compounds actually move a hallmark."
          description="The mechanistic layer between what you take and what ages — the pathways (PINK1/Parkin, SIRT3, NRF2, AMPK, mTOR, NAD⁺ …) that compounds engage. Each pathway links to the hallmarks it acts on and every compound that targets it."
          theme="cyan"
        />

        <p className="mx-auto mb-12 max-w-3xl text-body-sm text-muted-foreground">
          {pathways.length} pathways across {pathwayCategoryOrder.length} families.
        </p>

        {pathwayCategoryOrder.map((category) => {
          const items = getPathwaysByCategory(category);
          if (items.length === 0) return null;
          const meta = pathwayCategoryMeta[category];
          return (
            <section key={category} aria-labelledby={`pathways-${category}-heading`} className="mb-14">
              <div className="mb-5">
                <h2
                  id={`pathways-${category}-heading`}
                  className={`heading-section mb-1 text-xl md:text-2xl ${themeAccent[meta.theme] ?? ''}`}
                >
                  {meta.label}
                </h2>
                <p className="text-body-sm max-w-3xl">{meta.description}</p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/pathways/${p.slug}`}
                    style={{ ['--card-accent' as string]: `var(--accent-${meta.theme})` }}
                    className="premium-card focus-ring group h-full p-5"
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <h3 className={`heading-card text-base ${themeAccent[meta.theme] ?? ''}`}>{p.name}</h3>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:[color:var(--card-accent)]" aria-hidden="true" />
                    </div>
                    <p className="text-body-sm flex-1 text-muted-foreground">{p.summary}</p>
                    <p className="text-caption mt-3 text-muted-foreground">
                      {p.compoundSlugs.length} compound{p.compoundSlugs.length === 1 ? '' : 's'} ·{' '}
                      {p.hallmarkIds.length} hallmark{p.hallmarkIds.length === 1 ? '' : 's'}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
