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

// All 12 visuals with correct slugs for deep linkage
const hallmarkData = [
  { slug: 'genomic-instability', Component: dynamic(() => import('@/components/illustrations/GenomicInstabilityVisual').then(mod => ({ default: mod.GenomicInstabilityVisual })), { ssr: false }), title: "Genomic Instability" },
  { slug: 'telomere-attrition', Component: dynamic(() => import('@/components/illustrations/TelomereAttritionVisual').then(mod => ({ default: mod.TelomereAttritionVisual })), { ssr: false }), title: "Telomere Attrition" },
  { slug: 'epigenetic-alterations', Component: dynamic(() => import('@/components/illustrations/EpigeneticAlterationsVisual').then(mod => ({ default: mod.EpigeneticAlterationsVisual })), { ssr: false }), title: "Epigenetic Alterations" },
  { slug: 'loss-of-proteostasis', Component: dynamic(() => import('@/components/illustrations/LossOfProteostasisVisual').then(mod => ({ default: mod.LossOfProteostasisVisual })), { ssr: false }), title: "Loss of Proteostasis" },
  { slug: 'deregulated-nutrient-sensing', Component: dynamic(() => import('@/components/illustrations/DeregulatedNutrientSensingVisual').then(mod => ({ default: mod.DeregulatedNutrientSensingVisual })), { ssr: false }), title: "Deregulated Nutrient Sensing" },
  { slug: 'mitochondrial-dysfunction', Component: dynamic(() => import('@/components/illustrations/HallmarkVisuals').then(mod => ({ default: mod.MitochondrialDysfunctionVisual })), { ssr: false }), title: "Mitochondrial Dysfunction" },
  { slug: 'cellular-senescence', Component: dynamic(() => import('@/components/illustrations/CellularSenescenceVisual').then(mod => ({ default: mod.CellularSenescenceVisual })), { ssr: false }), title: "Cellular Senescence" },
  { slug: 'stem-cell-exhaustion', Component: dynamic(() => import('@/components/illustrations/StemCellExhaustionVisual').then(mod => ({ default: mod.StemCellExhaustionVisual })), { ssr: false }), title: "Stem Cell Exhaustion" },
  { slug: 'altered-intercellular-communication', Component: dynamic(() => import('@/components/illustrations/AlteredIntercellularCommunicationVisual').then(mod => ({ default: mod.AlteredIntercellularCommunicationVisual })), { ssr: false }), title: "Altered Intercellular Communication" },
  { slug: 'chronic-inflammation', Component: dynamic(() => import('@/components/illustrations/ChronicInflammationVisual').then(mod => ({ default: mod.ChronicInflammationVisual })), { ssr: false }), title: "Chronic Inflammation" },
  { slug: 'dysbiosis', Component: dynamic(() => import('@/components/illustrations/DysbiosisVisual').then(mod => ({ default: mod.DysbiosisVisual })), { ssr: false }), title: "Dysbiosis" },
  { slug: 'disabled-macroautophagy', Component: dynamic(() => import('@/components/illustrations/DisabledMacroautophagyVisual').then(mod => ({ default: mod.DisabledMacroautophagyVisual })), { ssr: false }), title: "Disabled Macroautophagy" },
];

export default function LibraryPage() {
  return (
    <>
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

      {/* Premium Luminous All 12 Hallmarks Visual Grid */}
      <section className="container-page py-12 md:py-16 border-t border-[var(--color-border-subtle)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <div className="text-label text-[var(--accent-cyan)] mb-1.5">COMPLETE VISUAL SYSTEM</div>
              <h2 className="heading-section">All 12 Hallmarks of Aging</h2>
              <p className="text-body text-[var(--color-text-secondary)] max-w-2xl mt-2">
                High-detail mechanistic visualizations. Click any hallmark to explore the full evidence, compounds, and protocol actions.
              </p>
            </div>
            <Link href="/hallmarks" className="text-sm text-[var(--accent-cyan)] hover:underline">
              Explore all deep-dives →
            </Link>
          </div>

          {/* Enhanced luminous hallmark cards with premium depth and interaction */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {hallmarkData.map(({ slug, Component, title }, index) => (
              <Link 
                key={index} 
                href={`/hallmarks/${slug}`}
                className="group block"
              >
                <div className="tnic-glass rounded-2xl overflow-hidden border border-[var(--color-border-subtle)] transition-all duration-300 group-hover:border-[var(--accent-cyan)]/40 group-hover:shadow-[0_0_0_1px_rgba(0,224,255,0.15),0_20px_60px_-15px_rgba(0,0,0,0.5)] h-full flex flex-col">
                  
                  {/* Illustration container with enhanced luminous treatment */}
                  <div className="p-5 bg-[var(--color-bg-elevated)]/60 relative overflow-hidden">
                    <div className="relative z-10">
                      <Component showLabels={true} interactive={false} />
                    </div>
                    {/* Subtle luminous edge glow on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-cyan)]/5 via-transparent to-[var(--accent-emerald)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  <div className="px-5 pb-5 pt-4 border-t border-[var(--color-border-subtle)] flex-1 flex flex-col">
                    <div className="text-[15px] font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--accent-cyan)] transition-colors tracking-[-0.15px]">
                      {title}
                    </div>
                    <div className="text-xs text-[var(--color-text-muted)] mt-1.5 group-hover:text-[var(--accent-cyan)]/70 transition-colors flex items-center gap-1">
                      View evidence, compounds & synergies 
                      <span className="transition-transform group-hover:translate-x-0.5">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-[var(--color-text-muted)]">
              All visuals are part of TNiC’s evidence-based illustration system. Click any card to enter the full mechanistic deep-dive.
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
