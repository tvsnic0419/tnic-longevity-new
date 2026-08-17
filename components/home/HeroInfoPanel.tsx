'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, X } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import {
  HERO_NETWORK_TIER_COLOR,
  HERO_NETWORK_TIER_LABEL,
  getEdgeExplanation,
  getHeroCompound,
  getPartnerIds,
} from '@/lib/hero-network';

interface HeroInfoPanelProps {
  selectedId: string | null;
  onSelectPartner: (id: string) => void;
  onClose: () => void;
}

/**
 * Persistent (not hover-only) info panel for the interactive hero synergy
 * widget. Docked at a fixed screen position rather than following the
 * rotating 3D node — anchoring real interactive content (links, buttons) to
 * a per-frame-projected position would leave it visually lagging a live
 * scene by a frame; the scene's hover chip keeps that frame-synced pattern
 * instead since it has no interactive content of its own.
 */
export function HeroInfoPanel({ selectedId, onSelectPartner, onClose }: HeroInfoPanelProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (selectedId) headingRef.current?.focus();
  }, [selectedId]);

  useEffect(() => {
    if (!selectedId) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedId, onClose]);

  if (!selectedId) return null;

  const compound = getHeroCompound(selectedId);
  if (!compound) return null;

  const partnerIds = getPartnerIds(selectedId);
  const tierColor = HERO_NETWORK_TIER_COLOR[compound.evidence];

  return (
    <GlassPanel
      depth="content"
      scrim
      className="absolute bottom-4 left-4 right-4 z-20 max-h-[85%] overflow-y-auto rounded-2xl p-5 sm:left-4 sm:right-auto sm:w-[340px]"
    >
      <div className="relative">
        <button
          type="button"
          onClick={onClose}
          className="focus-ring absolute -right-1 -top-1 rounded-full p-1.5 text-white/80 hover:text-white"
          aria-label="Close compound details"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        <div className="mb-1 flex items-center gap-2 pr-6">
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ background: tierColor, boxShadow: `0 0 8px ${tierColor}` }}
            aria-hidden="true"
          />
          <h3
            ref={headingRef}
            tabIndex={-1}
            className="text-base font-bold text-white outline-none"
          >
            {compound.name}
          </h3>
        </div>
        <p className="mb-3 text-xs font-medium" style={{ color: tierColor }}>
          {HERO_NETWORK_TIER_LABEL[compound.evidence]}
        </p>

        {/* Clamped: mechanism prose runs long for some compounds, and the
            partner list below is the educational payload this panel exists
            for — the full text lives on the compound page linked at the end. */}
        <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-white/90">{compound.mechanism}</p>

        {partnerIds.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 text-label text-white/70">
              Synergizes with
            </p>
            <ul className="space-y-2">
              {partnerIds.map((partnerId) => {
                const partner = getHeroCompound(partnerId);
                if (!partner) return null;
                const explanation = getEdgeExplanation(selectedId, partnerId);
                return (
                  <li key={partnerId}>
                    <button
                      type="button"
                      onClick={() => onSelectPartner(partnerId)}
                      className="focus-ring group block w-full rounded-lg border border-white/10 bg-white/[0.03] p-2.5 text-left transition-colors hover:border-white/20 hover:bg-white/[0.06]"
                    >
                      <span className="mb-0.5 flex items-center gap-1.5 text-sm font-semibold text-white">
                        {partner.name}
                        <ArrowRight
                          className="h-3 w-3 text-white/60 transition-transform group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </span>
                      <span className="block text-xs leading-snug text-white/80">
                        {explanation.text}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <Link
          href={`/library/compounds/${compound.id}`}
          className="focus-ring inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent-cyan)] hover:underline"
        >
          View compound
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </GlassPanel>
  );
}
