import { Suspense } from 'react';
import { BookmarkPlus, Compass, Layers3 } from 'lucide-react';
import Link from 'next/link';
import { buildPageMetadata } from '@/lib/seo';
import { AntiAgingLibrary } from '@/components/library/AntiAgingLibrary';
import { LibraryModulesHub } from '@/components/library/LibraryModulesHub';
import { LifestylePillarsHub } from '@/components/library/LifestylePillarsHub';
import { LibrarySearch } from '@/components/library/LibrarySearch';
import { ToolsPromoStrip } from '@/components/tools/ToolsPromoStrip';
import { LibraryFacetFilters } from '@/components/library/LibraryFacetFilters';
import { CompoundExplorer } from '@/components/library/CompoundExplorer';
import { RecommendedNextSteps } from '@/components/ui/RecommendedNextSteps';
import { ResearchQueueShelf } from '@/components/library/ResearchQueueShelf';
import { EvidenceTierSpectrum } from '@/components/library/EvidenceTierSpectrum';
import { DecisionSteps } from '@/components/ui/DecisionSteps';
import {
  DeferredHallmarkVisualGallery,
  type HallmarkVisualCard,
} from '@/components/library/DeferredHallmarkVisualGallery';
import { hallmarkLibrary } from '@/lib/hallmarks-library';
import { CinematicHubHero } from '@/components/viz/CinematicHubHero';
import { COMPOUND_COUNT } from '@/lib/library-modules';
import { eliteInterventions } from '@/lib/elite-interventions';

export const metadata = buildPageMetadata({
  title: 'Anti-Aging Library — The 12 Hallmarks of Aging, Evidence-Graded',
  description:
    'Explore the 12 hallmarks of aging with evidence-graded interventions, PMID-cited studies, and mechanistic visuals for each pathway — from genomic instability to disabled macroautophagy.',
  path: '/library',
  keywords: ['12 hallmarks of aging', 'anti-aging library', 'longevity interventions', 'hallmarks of aging explained'],
});

// Titles and canonical destinations stay tied to the hallmark registry; the
// visual gallery defers only the below-fold decorative SVG components.
const visualCards: HallmarkVisualCard[] = hallmarkLibrary.map(({ id, title, slug }) => ({
  id: id as HallmarkVisualCard['id'],
  title,
  href: `/library/${slug}`,
}));

export default function LibraryPage() {
  return (
    <>
      <CinematicHubHero
        hue="cyan"
        kicker="The Library"
        title={<>Every intervention, <em>graded</em>.</>}
        lead="The 12 hallmarks of aging, each paired with PMID-cited interventions and mechanistic visuals — the free, evidence-first reference the whole site is built on."
        stats={[
          { value: String(COMPOUND_COUNT), label: 'Graded compounds', href: '/library/compounds' },
          { value: '12', label: 'Hallmarks of aging', href: '/hallmarks' },
          { value: 'A–C', label: 'Evidence tiers', href: '/trust/methodology' },
          { value: String(eliteInterventions.length), label: 'Elite interventions', href: '/elite-8' },
        ]}
        primary={{ href: '/nico', label: 'Find your personalized stack' }}
        secondary={{ href: '/stacks', label: 'Open the Stack Architect' }}
      />
      {/* Search is the highest-intent action on a research hub, so it appears
          immediately after the overview instead of after the hallmark atlas. */}
      <Suspense fallback={<div className="h-36 animate-pulse bg-white/5" />}>
        <LibrarySearch />
      </Suspense>

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
      <div className="container-page pb-2">
        <EvidenceTierSpectrum />
      </div>
      <ResearchQueueShelf />
      {/* Lead with the page title and context, then the tools to act on it */}
      <div id="hallmark-atlas"><AntiAgingLibrary asPageTitle /></div>

      <div className="container-page pb-6">
        <Suspense fallback={<div className="h-20 animate-pulse bg-white/5 rounded-xl" />}>
          <LibraryFacetFilters />
        </Suspense>
      </div>

      {/* The result surface those facet filters drive — and the clickable
          tier-count pills. Same `?tiers=`/`?hallmarks=` params, now rendered. */}
      <div className="container-page pb-12">
        <Suspense fallback={<div className="h-40 animate-pulse bg-white/5 rounded-xl" />}>
          <CompoundExplorer />
        </Suspense>
      </div>

      <div className="container-page pb-12">
        <RecommendedNextSteps context="library" />
      </div>

      {/* Polished All 12 Hallmarks Visual Grid */}
      <section className="container-page py-12 md:py-16 border-t border-[var(--color-border-subtle)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <div className="text-label text-[var(--accent-cyan)] mb-1.5">COMPLETE VISUAL SYSTEM</div>
              <h2 className="heading-section">All 12 Hallmarks of Aging</h2>
              <p className="text-body text-[var(--color-text-secondary)] max-w-2xl mt-2">
                High-detail mechanistic visualizations. Hover to explore.
              </p>
            </div>
            <Link href="#content-modules" className="text-sm text-[var(--accent-cyan)] hover:underline">
              Explore module index →
            </Link>
          </div>

          <DeferredHallmarkVisualGallery cards={visualCards} />

          <div className="mt-8 text-center">
            <p className="text-sm text-[var(--color-text-muted)]">
              All visuals are part of TNiC’s evidence-based illustration system.
            </p>
          </div>
        </div>
      </section>

      <LifestylePillarsHub />
      <div className="container-page py-8">
        <ToolsPromoStrip headline="Simulate stacks, build protocols, and project healthspan from library modules" />
      </div>
      <LibraryModulesHub />
    </>
  );
}
