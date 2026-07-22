'use client';

import type { ComponentType } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { hallmarkLibrary } from '@/lib/hallmarks-library';
import { AntiAgingLibrary } from '@/components/library/AntiAgingLibrary';

/**
 * Dedicated /library/hallmarks experience — the 12 Hallmarks of Aging.
 *
 * This is the interactive hallmark explorer that used to lead the main
 * /library page. It now lives on its own route so /library can lead with the
 * compound library (the "interventions" users expect), while the hallmarks
 * keep a prominent, interlinked home of their own.
 */

type HallmarkVisual = ComponentType<{ showLabels?: boolean; interactive?: boolean }>;

const load = (loader: () => Promise<{ default: HallmarkVisual }>) =>
  dynamic(loader, { ssr: false });

// One mechanistic illustration per hallmark, keyed by hallmark id so each card
// pairs with the correct /library/[slug] destination (fixing the old grid,
// where every card linked back to /library itself — a dead end).
const HALLMARK_VISUALS: Record<string, HallmarkVisual> = {
  genomic: load(() => import('@/components/illustrations/GenomicInstabilityVisual').then((m) => ({ default: m.GenomicInstabilityVisual }))),
  telomeres: load(() => import('@/components/illustrations/TelomereAttritionVisual').then((m) => ({ default: m.TelomereAttritionVisual }))),
  epigenetic: load(() => import('@/components/illustrations/EpigeneticAlterationsVisual').then((m) => ({ default: m.EpigeneticAlterationsVisual }))),
  proteostasis: load(() => import('@/components/illustrations/LossOfProteostasisVisual').then((m) => ({ default: m.LossOfProteostasisVisual }))),
  autophagy: load(() => import('@/components/illustrations/DisabledMacroautophagyVisual').then((m) => ({ default: m.DisabledMacroautophagyVisual }))),
  // MitochondrialDysfunctionVisual lives in the shared HallmarkVisuals set and
  // takes a different (size/accentColor) prop shape than the standalone,
  // label-driven visuals; it ignores showLabels/interactive at runtime, so we
  // bridge the type here to keep the grid uniform.
  mito: load(() => import('@/components/illustrations/HallmarkVisuals').then((m) => ({ default: m.MitochondrialDysfunctionVisual as unknown as HallmarkVisual }))),
  senescence: load(() => import('@/components/illustrations/CellularSenescenceVisual').then((m) => ({ default: m.CellularSenescenceVisual }))),
  stem: load(() => import('@/components/illustrations/StemCellExhaustionVisual').then((m) => ({ default: m.StemCellExhaustionVisual }))),
  communication: load(() => import('@/components/illustrations/AlteredIntercellularCommunicationVisual').then((m) => ({ default: m.AlteredIntercellularCommunicationVisual }))),
  inflammation: load(() => import('@/components/illustrations/ChronicInflammationVisual').then((m) => ({ default: m.ChronicInflammationVisual }))),
  dysbiosis: load(() => import('@/components/illustrations/DysbiosisVisual').then((m) => ({ default: m.DysbiosisVisual }))),
  nutrient: load(() => import('@/components/illustrations/DeregulatedNutrientSensingVisual').then((m) => ({ default: m.DeregulatedNutrientSensingVisual }))),
};

export function HallmarksExplorer() {
  return (
    <>
      {/* Back to the compound library */}
      <div className="container-page pt-6">
        <Link
          href="/library"
          className="focus-ring interactive inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-accent-cyan rounded"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back to the Compound Library
        </Link>
      </div>

      {/* Interactive hallmark explorer — provides the page's h1 */}
      <AntiAgingLibrary asPageTitle />

      {/* At-a-glance visual system — every card now links to its real hallmark
          deep-dive rather than back to this page. */}
      <section className="container-page py-12 md:py-16 border-t border-[var(--color-border-subtle)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <div className="text-label text-[var(--accent-cyan)] mb-1.5">COMPLETE VISUAL SYSTEM</div>
              <h2 className="heading-section">All 12 Hallmarks of Aging</h2>
              <p className="text-body text-[var(--color-text-secondary)] max-w-2xl mt-2">
                High-detail mechanistic visualizations. Select any hallmark to open its deep-dive.
              </p>
            </div>
            <Link href="/library" className="text-sm text-[var(--accent-cyan)] hover:underline">
              Browse the compound library →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {hallmarkLibrary.map((hallmark) => {
              const Visual = HALLMARK_VISUALS[hallmark.id];
              if (!Visual) return null;
              return (
                <Link
                  key={hallmark.id}
                  href={`/library/${hallmark.slug}`}
                  className="group block transition-transform hover:scale-[1.01]"
                >
                  <div className="tnic-glass rounded-2xl overflow-hidden border border-[var(--color-border-subtle)] group-hover:border-[var(--accent-cyan)]/30 transition-colors h-full">
                    <div className="p-4">
                      <Visual showLabels interactive={false} />
                    </div>
                    <div className="px-4 pb-4 pt-2 border-t border-[var(--color-border-subtle)] flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-[var(--color-text-primary)] group-hover:text-[var(--accent-cyan)] transition-colors">
                        {hallmark.title}
                      </span>
                      <ArrowRight
                        className="w-4 h-4 shrink-0 text-[var(--color-text-muted)] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-[var(--color-text-muted)]">
              All visuals are part of TNiC&rsquo;s evidence-based illustration system.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
