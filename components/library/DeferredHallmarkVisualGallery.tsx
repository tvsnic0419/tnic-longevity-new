'use client';

import { useEffect, useRef, useState, type ComponentType } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

type HallmarkVisualProps = {
  showLabels?: boolean;
  interactive?: boolean;
};

type HallmarkVisualId =
  | 'genomic'
  | 'telomeres'
  | 'epigenetic'
  | 'proteostasis'
  | 'autophagy'
  | 'mito'
  | 'senescence'
  | 'stem'
  | 'communication'
  | 'inflammation'
  | 'dysbiosis'
  | 'nutrient';

export interface HallmarkVisualCard {
  id: HallmarkVisualId;
  title: string;
  href: string;
}

const visualLoading = () => <div className="tnic-stage-placeholder min-h-[300px]" aria-hidden="true" />;

/**
 * The visual cards are optional reading enhancements beneath the primary
 * Library exploration and compound finder. Explicit client-side dynamic
 * imports keep those large SVG modules out of the initial route transfer, but
 * preserve their art whenever the reader reaches the section.
 */
const visualById: Record<HallmarkVisualId, ComponentType<HallmarkVisualProps>> = {
  genomic: dynamic(
    () => import('@/components/illustrations/GenomicInstabilityVisual').then((mod) => mod.GenomicInstabilityVisual),
    { ssr: false, loading: visualLoading },
  ),
  telomeres: dynamic(
    () => import('@/components/illustrations/TelomereAttritionVisual').then((mod) => mod.TelomereAttritionVisual),
    { ssr: false, loading: visualLoading },
  ),
  epigenetic: dynamic(
    () => import('@/components/illustrations/EpigeneticAlterationsVisual').then((mod) => mod.EpigeneticAlterationsVisual),
    { ssr: false, loading: visualLoading },
  ),
  proteostasis: dynamic(
    () => import('@/components/illustrations/LossOfProteostasisVisual').then((mod) => mod.LossOfProteostasisVisual),
    { ssr: false, loading: visualLoading },
  ),
  autophagy: dynamic(
    () => import('@/components/illustrations/DisabledMacroautophagyVisual').then((mod) => mod.DisabledMacroautophagyVisual),
    { ssr: false, loading: visualLoading },
  ),
  mito: dynamic<HallmarkVisualProps>(
    () =>
      import('@/components/illustrations/HallmarkVisuals').then((mod) =>
        function MitochondrialVisual() {
          return <mod.MitochondrialDysfunctionVisual />;
        },
      ),
    { ssr: false, loading: visualLoading },
  ),
  senescence: dynamic(
    () => import('@/components/illustrations/CellularSenescenceVisual').then((mod) => mod.CellularSenescenceVisual),
    { ssr: false, loading: visualLoading },
  ),
  stem: dynamic(
    () => import('@/components/illustrations/StemCellExhaustionVisual').then((mod) => mod.StemCellExhaustionVisual),
    { ssr: false, loading: visualLoading },
  ),
  communication: dynamic(
    () => import('@/components/illustrations/AlteredIntercellularCommunicationVisual').then((mod) => mod.AlteredIntercellularCommunicationVisual),
    { ssr: false, loading: visualLoading },
  ),
  inflammation: dynamic(
    () => import('@/components/illustrations/ChronicInflammationVisual').then((mod) => mod.ChronicInflammationVisual),
    { ssr: false, loading: visualLoading },
  ),
  dysbiosis: dynamic(
    () => import('@/components/illustrations/DysbiosisVisual').then((mod) => mod.DysbiosisVisual),
    { ssr: false, loading: visualLoading },
  ),
  nutrient: dynamic(
    () => import('@/components/illustrations/DeregulatedNutrientSensingVisual').then((mod) => mod.DeregulatedNutrientSensingVisual),
    { ssr: false, loading: visualLoading },
  ),
};

function VisualPlaceholder({ index }: { index: number }) {
  return (
    <div
      className="tnic-glass min-h-[300px] overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] p-5"
      aria-hidden="true"
    >
      <div className="text-label text-[var(--accent-cyan)]">HALLMARK {String(index + 1).padStart(2, '0')}</div>
      <div className="mt-5 h-36 rounded-xl border border-[var(--color-border-subtle)] bg-[radial-gradient(circle_at_50%_50%,color-mix(in_srgb,var(--accent-cyan)_12%,transparent),transparent_68%)]" />
      <div className="mt-4 h-2.5 w-4/5 rounded-full bg-[var(--color-border-subtle)]/70" />
      <div className="mt-2 h-2.5 w-3/5 rounded-full bg-[var(--color-border-subtle)]/45" />
    </div>
  );
}

export function DeferredHallmarkVisualGallery({ cards }: { cards: readonly HallmarkVisualCard[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || isNearViewport) return;
    if (typeof IntersectionObserver === 'undefined') {
      // Defer the compatibility fallback to the next task so the initial render
      // never schedules a synchronous state update from this effect.
      const fallback = window.setTimeout(() => setIsNearViewport(true), 0);
      return () => window.clearTimeout(fallback);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setIsNearViewport(true);
        observer.disconnect();
      },
      { rootMargin: '360px 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [isNearViewport]);

  return (
    <div ref={sectionRef} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {cards.map((card, index) => {
        const Visual = visualById[card.id];
        return (
          <Link
            key={card.id}
            href={card.href}
            aria-label={`${card.title} — open the evidence deep-dive`}
            className="focus-ring group block h-full rounded-2xl transition-transform hover:-translate-y-0.5"
          >
            {/* Each illustration is already a self-contained, titled glass card
                (its own "HALLMARK NN · <title>" header + caption), so the gallery
                does NOT re-title it — that would double the name. The link adds a
                consistent hover lift, focus ring, and one clear deep-dive CTA;
                the real mechanistic artwork stays the hero of the card. */}
            {isNearViewport ? <Visual showLabels interactive={false} /> : <VisualPlaceholder index={index} />}
            <span className="mt-2 flex items-center justify-center gap-1.5 text-caption font-semibold uppercase tracking-[0.1em] text-accent-cyan/80 transition-colors group-hover:text-accent-cyan">
              Open the evidence deep-dive
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
