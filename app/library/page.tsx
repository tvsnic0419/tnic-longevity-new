import { Suspense } from 'react';
import Link from 'next/link';
import { buildPageMetadata } from '@/lib/seo';
import { AntiAgingLibrary } from '@/components/library/AntiAgingLibrary';
import { LibraryModulesHub } from '@/components/library/LibraryModulesHub';
import { LifestylePillarsHub } from '@/components/library/LifestylePillarsHub';
import { LibrarySearch } from '@/components/library/LibrarySearch';
import { ToolsPromoStrip } from '@/components/tools/ToolsPromoStrip';
import { LibraryFacetFilters } from '@/components/library/LibraryFacetFilters';
import { RecommendedNextSteps } from '@/components/ui/RecommendedNextSteps';

// All 12 visuals
import { GenomicInstabilityVisual } from '@/components/illustrations/GenomicInstabilityVisual';
import { TelomereAttritionVisual } from '@/components/illustrations/TelomereAttritionVisual';
import { EpigeneticAlterationsVisual } from '@/components/illustrations/EpigeneticAlterationsVisual';
import { LossOfProteostasisVisual } from '@/components/illustrations/LossOfProteostasisVisual';
import { DeregulatedNutrientSensingVisual } from '@/components/illustrations/DeregulatedNutrientSensingVisual';
import { MitochondrialDysfunctionVisual } from '@/components/illustrations/HallmarkVisuals';
import { CellularSenescenceVisual } from '@/components/illustrations/CellularSenescenceVisual';
import { StemCellExhaustionVisual } from '@/components/illustrations/StemCellExhaustionVisual';
import { AlteredIntercellularCommunicationVisual } from '@/components/illustrations/AlteredIntercellularCommunicationVisual';
import { ChronicInflammationVisual } from '@/components/illustrations/ChronicInflammationVisual';
import { DysbiosisVisual } from '@/components/illustrations/DysbiosisVisual';
import { DisabledMacroautophagyVisual } from '@/components/illustrations/DisabledMacroautophagyVisual';
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

const visuals = [
  { Component: GenomicInstabilityVisual, title: 'Genomic Instability' },
  { Component: TelomereAttritionVisual, title: 'Telomere Attrition' },
  { Component: EpigeneticAlterationsVisual, title: 'Epigenetic Alterations' },
  { Component: LossOfProteostasisVisual, title: 'Loss of Proteostasis' },
  { Component: DeregulatedNutrientSensingVisual, title: 'Deregulated Nutrient Sensing' },
  { Component: MitochondrialDysfunctionVisual, title: 'Mitochondrial Dysfunction' },
  { Component: CellularSenescenceVisual, title: 'Cellular Senescence' },
  { Component: StemCellExhaustionVisual, title: 'Stem Cell Exhaustion' },
  { Component: AlteredIntercellularCommunicationVisual, title: 'Altered Intercellular Communication' },
  { Component: ChronicInflammationVisual, title: 'Chronic Inflammation' },
  { Component: DysbiosisVisual, title: 'Dysbiosis' },
  { Component: DisabledMacroautophagyVisual, title: 'Disabled Macroautophagy' },
];

export default function LibraryPage() {
  return (
    <>
      <CinematicHubHero
        hue="cyan"
        kicker="The Library"
        title={<>Every intervention, <em>graded</em>.</>}
        lead="The 12 hallmarks of aging, each paired with PMID-cited interventions and mechanistic visuals — the free, evidence-first reference the whole site is built on."
        stats={[
          { value: String(COMPOUND_COUNT), label: 'Graded compounds' },
          { value: '12', label: 'Hallmarks of aging' },
          { value: 'A–C', label: 'Evidence tiers' },
          { value: String(eliteInterventions.length), label: 'Elite interventions' },
        ]}
        primary={{ href: '/quiz', label: 'Take The NICO Starter Questionnaire' }}
        secondary={{ href: '/stacks', label: 'Open the Stack Architect' }}
      />
      {/* Lead with the page title and context, then the tools to act on it */}
      <AntiAgingLibrary asPageTitle />

      <Suspense fallback={<div className="h-12 animate-pulse bg-white/5" />}>
        <LibrarySearch />
      </Suspense>

      <div className="container-page pb-6">
        <Suspense fallback={<div className="h-20 animate-pulse bg-white/5 rounded-xl" />}>
          <LibraryFacetFilters />
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
            <Link href="/library" className="text-sm text-[var(--accent-cyan)] hover:underline">
              Explore full library →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visuals.map(({ Component, title }, index) => (
              <Link
                key={index}
                href="/library"
                className="group block transition-transform hover:scale-[1.01]"
              >
                <div className="tnic-glass rounded-2xl overflow-hidden border border-[var(--color-border-subtle)] group-hover:border-[var(--accent-cyan)]/30 transition-colors h-full">
                  <div className="p-4">
                    <Component showLabels={true} interactive={false} />
                  </div>
                  <div className="px-4 pb-4 pt-2 border-t border-[var(--color-border-subtle)]">
                    <div className="text-sm font-medium text-[var(--color-text-primary)] group-hover:text-[var(--accent-cyan)] transition-colors">
                      {title}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

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
