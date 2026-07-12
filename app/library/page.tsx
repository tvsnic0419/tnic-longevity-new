'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamic imports
const AntiAgingLibrary = dynamic(() => import('@/components/library/AntiAgingLibrary').then(mod => ({ default: mod.AntiAgingLibrary })), { ssr: false });
const LibraryModulesHub = dynamic(() => import('@/components/library/LibraryModulesHub').then(m => ({ default: m.LibraryModulesHub })), { ssr: false });
const LifestylePillarsHub = dynamic(() => import('@/components/library/LifestylePillarsHub').then(m => ({ default: m.LifestylePillarsHub })), { ssr: false });
const LibrarySearch = dynamic(() => import('@/components/library/LibrarySearch').then(m => ({ default: m.LibrarySearch })), { ssr: false });
const ToolsPromoStrip = dynamic(() => import('@/components/tools/ToolsPromoStrip').then(m => ({ default: m.ToolsPromoStrip })), { ssr: false });
const LibraryFacetFilters = dynamic(() => import('@/components/library/LibraryFacetFilters').then(mod => ({ default: mod.LibraryFacetFilters })), { ssr: false });
const RecommendedNextSteps = dynamic(() => import('@/components/ui/RecommendedNextSteps').then(mod => ({ default: mod.RecommendedNextSteps })), { ssr: false });

// All 12 visuals
const GenomicInstabilityVisual = dynamic(() => import('@/components/illustrations/GenomicInstabilityVisual').then(mod => ({ default: mod.GenomicInstabilityVisual })), { ssr: false });
const TelomereAttritionVisual = dynamic(() => import('@/components/illustrations/TelomereAttritionVisual').then(mod => ({ default: mod.TelomereAttritionVisual })), { ssr: false });
const EpigeneticAlterationsVisual = dynamic(() => import('@/components/illustrations/EpigeneticAlterationsVisual').then(mod => ({ default: mod.EpigeneticAlterationsVisual })), { ssr: false });
const LossOfProteostasisVisual = dynamic(() => import('@/components/illustrations/LossOfProteostasisVisual').then(mod => ({ default: mod.LossOfProteostasisVisual })), { ssr: false });
const DeregulatedNutrientSensingVisual = dynamic(() => import('@/components/illustrations/DeregulatedNutrientSensingVisual').then(mod => ({ default: mod.DeregulatedNutrientSensingVisual })), { ssr: false });
const MitochondrialDysfunctionVisual = dynamic(() => import('@/components/illustrations/HallmarkVisuals').then(mod => ({ default: mod.MitochondrialDysfunctionVisual })), { ssr: false });
const CellularSenescenceVisual = dynamic(() => import('@/components/illustrations/CellularSenescenceVisual').then(mod => ({ default: mod.CellularSenescenceVisual })), { ssr: false });
const StemCellExhaustionVisual = dynamic(() => import('@/components/illustrations/StemCellExhaustionVisual').then(mod => ({ default: mod.StemCellExhaustionVisual })), { ssr: false });
const AlteredIntercellularCommunicationVisual = dynamic(() => import('@/components/illustrations/AlteredIntercellularCommunicationVisual').then(mod => ({ default: mod.AlteredIntercellularCommunicationVisual })), { ssr: false });
const ChronicInflammationVisual = dynamic(() => import('@/components/illustrations/ChronicInflammationVisual').then(mod => ({ default: mod.ChronicInflammationVisual })), { ssr: false });
const DysbiosisVisual = dynamic(() => import('@/components/illustrations/DysbiosisVisual').then(mod => ({ default: mod.DysbiosisVisual })), { ssr: false });
const DisabledMacroautophagyVisual = dynamic(() => import('@/components/illustrations/DisabledMacroautophagyVisual').then(mod => ({ default: mod.DisabledMacroautophagyVisual })), { ssr: false });

export default function LibraryPage() {
  const visuals = [
    { Component: GenomicInstabilityVisual, title: "Genomic Instability" },
    { Component: TelomereAttritionVisual, title: "Telomere Attrition" },
    { Component: EpigeneticAlterationsVisual, title: "Epigenetic Alterations" },
    { Component: LossOfProteostasisVisual, title: "Loss of Proteostasis" },
    { Component: DeregulatedNutrientSensingVisual, title: "Deregulated Nutrient Sensing" },
    { Component: MitochondrialDysfunctionVisual, title: "Mitochondrial Dysfunction" },
    { Component: CellularSenescenceVisual, title: "Cellular Senescence" },
    { Component: StemCellExhaustionVisual, title: "Stem Cell Exhaustion" },
    { Component: AlteredIntercellularCommunicationVisual, title: "Altered Intercellular Communication" },
    { Component: ChronicInflammationVisual, title: "Chronic Inflammation" },
    { Component: DysbiosisVisual, title: "Dysbiosis" },
    { Component: DisabledMacroautophagyVisual, title: "Disabled Macroautophagy" },
  ];

  return (
    <>
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

          <div className="mt-6 text-center">
            <Link
              href="/library/explorer"
              className="focus-ring interactive inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-5 py-2.5 text-sm font-semibold text-foreground/80 hover:border-accent-cyan/50 hover:text-accent-cyan transition-colors"
            >
              Explore the Knowledge Graph →
            </Link>
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
