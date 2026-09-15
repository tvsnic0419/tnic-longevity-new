import { Suspense } from 'react';
import { BookmarkPlus, Compass, Layers3 } from 'lucide-react';
import { buildPageMetadata, buildBreadcrumbSchema } from '@/lib/seo';
import { SITE } from '@/lib/site';
import { AntiAgingLibrary } from '@/components/library/AntiAgingLibrary';
import { LibraryModulesHub } from '@/components/library/LibraryModulesHub';
import { LifestylePillarsHub } from '@/components/library/LifestylePillarsHub';
import { LibrarySearch } from '@/components/library/LibrarySearch';
import { ToolsPromoStrip } from '@/components/tools/ToolsPromoStrip';
import { LibraryFacetFilters } from '@/components/library/LibraryFacetFilters';
import { CompoundExplorer, parseExplorerParams } from '@/components/library/CompoundExplorer';
import { ContinueTrail } from '@/components/ui/WalkCard';
import { ResearchQueueShelf } from '@/components/library/ResearchQueueShelf';
import { EvidenceTierSpectrum } from '@/components/library/EvidenceTierSpectrum';
import { LibraryHeroInstrument } from '@/components/library/LibraryHeroInstrument';
import { DecisionSteps } from '@/components/ui/DecisionSteps';
import { StructuredData } from '@/components/seo/StructuredData';
import {
  DeferredHallmarkVisualGallery,
  type HallmarkVisualCard,
} from '@/components/library/DeferredHallmarkVisualGallery';
import { hallmarkLibrary } from '@/lib/hallmarks-library';
import { CinematicHubHero } from '@/components/viz/CinematicHubHero';
import { COMPOUND_COUNT } from '@/lib/library-modules';
import { evidenceIndexStats } from '@/lib/evidence-index';

const indexStats = evidenceIndexStats();

const LIBRARY_DESCRIPTION = `${COMPOUND_COUNT} longevity compounds graded A–C with PMID-cited evidence, plus the ${hallmarkLibrary.length} hallmarks of aging each one acts on. Sort the whole set in the Evidence Table, or browse by molecule.`;

export const metadata = buildPageMetadata({
  title: `Anti-Aging Library — ${COMPOUND_COUNT} Evidence-Graded Compounds`,
  description: LIBRARY_DESCRIPTION,
  path: '/library',
  keywords: [
    'longevity supplement library',
    'evidence-graded compounds',
    'anti-aging library',
    'hallmarks of aging explained',
  ],
});

/**
 * CollectionPage, not Article. This hub is an index over the graded library —
 * the compounds, then the hallmarks they act on — and describing it as one
 * tells an answer engine what it is looking at. Counts are derived so the
 * schema cannot overstate the grid beneath it.
 */
function buildLibraryCollectionSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `TNiC Compound Library — ${COMPOUND_COUNT} evidence-graded compounds`,
    description: LIBRARY_DESCRIPTION,
    url: `${SITE.url}/library`,
    isAccessibleForFree: true,
    mainEntity: {
      '@type': 'ItemList',
      name: 'Graded longevity compounds',
      numberOfItems: COMPOUND_COUNT,
      itemListOrder: 'https://schema.org/ItemListUnordered',
    },
    relatedLink: [`${SITE.url}/library/evidence`, `${SITE.url}/hallmarks`],
  };
}

// Titles and canonical destinations stay tied to the hallmark registry; the
// visual gallery defers only the below-fold decorative SVG components.
const visualCards: HallmarkVisualCard[] = hallmarkLibrary.map(({ id, title, slug }) => ({
  id: id as HallmarkVisualCard['id'],
  title,
  href: `/library/${slug}`,
}));

function paramString(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? '';
  return value ?? '';
}

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ tiers?: string | string[]; hallmarks?: string | string[] }>;
}) {
  const sp = await searchParams;
  const { activeTiers, activeHallmarkIds } = parseExplorerParams({
    tiers: paramString(sp.tiers),
    hallmarks: paramString(sp.hallmarks),
  });

  return (
    <>
      <StructuredData
        schemas={[
          buildLibraryCollectionSchema(),
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Library', path: '/library' },
          ]),
        ]}
      />
      <CinematicHubHero
        hue="cyan"
        kicker="The Library"
        titleAsHeading
        title={<>Every intervention, <em>graded</em>.</>}
        lead={`${COMPOUND_COUNT} compounds, each graded A–C with PMID-cited evidence and the hallmarks of aging it acts on. Browse the molecules, open the table, or start from the biology.`}
        stats={[
          { value: String(COMPOUND_COUNT), label: 'Graded compounds', href: '/library/evidence' },
          { value: String(hallmarkLibrary.length), label: 'Hallmarks of aging', href: '/hallmarks' },
          { value: String(indexStats.scored), label: 'With a TNiC Score', href: '/library/evidence' },
          { value: 'A–C', label: 'Evidence tiers', href: '/trust/methodology' },
        ]}
        primary={{ href: '/nico', label: 'Find your personalized stack' }}
        secondary={{ href: '/library/evidence', label: 'Open the Evidence Table' }}
        figure={<LibraryHeroInstrument />}
        figureCaption="Evidence split · derived from the graded library"
      />
      {/* Search is the highest-intent action on a research hub, so it appears
          immediately after the overview. The compound grid follows — the job
          most visitors came to do — instead of sitting under the hallmark atlas. */}
      <Suspense fallback={<div className="h-36 animate-pulse bg-white/5" />}>
        <LibrarySearch />
      </Suspense>

      <div className="container-page pb-2 pt-8">
        <Suspense fallback={<div className="h-20 animate-pulse bg-white/5 rounded-xl" />}>
          <LibraryFacetFilters />
        </Suspense>
      </div>

      <div className="container-page pb-12">
        <CompoundExplorer activeTiers={activeTiers} activeHallmarkIds={activeHallmarkIds} />
      </div>

      <div className="container-page">
        <EvidenceTierSpectrum />
      </div>

      <div className="container-page pt-8">
        <DecisionSteps
          className="mb-6"
          eyebrow="A deliberate research path"
          title="Start with the evidence you need."
          detail="Search a compound or comparison, follow the biology behind it, then inspect a configuration only when you are ready to build."
          theme="cyan"
          recommendedIndex={0}
          steps={[
            { title: 'Search the library', detail: 'Find a compound, pathway, comparison, or research brief.', href: '#library-search', icon: BookmarkPlus },
            { title: 'Follow a hallmark', detail: 'Begin with the biology and the evidence that supports it.', href: '#hallmark-atlas', icon: Compass },
            { title: 'Inspect a configuration', detail: 'Use Stack Architect for coverage and interaction checks.', href: '/stacks', icon: Layers3 },
          ]}
        />
      </div>

      <ResearchQueueShelf />
      {/* Hallmark atlas is the second chapter, not the page identity. Search is
          already on the hub, so the atlas does not repeat it. */}
      <div id="hallmark-atlas"><AntiAgingLibrary hideLocalSearch /></div>

      <div className="container-page pb-12">
        <ContinueTrail
          title="Keep going from the library."
          items={[
            {
              href: '/library/evidence',
              kicker: 'Evidence table',
              title: 'Sort the whole set',
              detail: 'Every graded compound, one table — tier, hallmarks, and citations.',
              accent: 'cyan',
            },
            {
              href: '/stacks',
              kicker: 'Stacks',
              title: 'Open Stack Architect',
              detail: 'Inspect coverage and interactions before you configure anything.',
              accent: 'violet',
            },
            {
              href: '/protocols',
              kicker: 'Protocols',
              title: 'Read a choreographed plan',
              detail: 'Each compound has a job and a time. Not a pile of pills.',
              accent: 'emerald',
            },
            {
              href: '/labs',
              kicker: 'Labs',
              title: 'Log a baseline',
              detail: 'Supplements without labs is guessing. Start with a panel.',
              accent: 'rose',
            },
          ]}
        />
      </div>

      {/* Density: one browse surface above the fold. Synergies / lifestyle /
          visual atlas / module index live behind a single disclosure so the
          compound grid stays the primary research path. */}
      <section id="browse-modules" className="container-page py-10 md:py-14 border-t border-[var(--color-border-subtle)]">
        <details className="premium-card rounded-2xl border border-border/60 p-5 md:p-7 group">
          <summary className="focus-ring cursor-pointer list-none marker:content-none">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-label text-accent-cyan mb-1">Browse modules</p>
                <h2 className="heading-section text-xl md:text-2xl">Hallmark atlas, lifestyle, synergies & tools</h2>
                <p className="mt-1 max-w-2xl text-body-sm text-muted-foreground">
                  Keep the compound grid as the primary surface. Open this panel when you want the
                  mechanistic atlas, lifestyle pillars, or module index.
                </p>
              </div>
              <span className="text-sm font-semibold text-accent-cyan group-open:hidden">Expand →</span>
              <span className="text-sm font-semibold text-accent-cyan hidden group-open:inline">Collapse ↑</span>
            </div>
          </summary>
          <div className="mt-8 space-y-12">
            <div>
              <p className="text-label text-accent-cyan mb-1.5">The mechanistic atlas</p>
              <h3 className="text-lg font-bold mb-4">All {hallmarkLibrary.length} hallmarks, drawn from their biology</h3>
              <DeferredHallmarkVisualGallery cards={visualCards} />
              <p className="mt-6 text-caption text-[var(--color-text-muted)]">
                Every illustration is drawn from the mechanism it depicts — no stock art.
              </p>
            </div>
            <LifestylePillarsHub />
            <div>
              <ToolsPromoStrip headline="Simulate stacks, build protocols, and project healthspan from library modules" />
            </div>
            <LibraryModulesHub />
          </div>
        </details>
      </section>
    </>
  );
}
