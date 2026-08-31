'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, X } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { HERO_NETWORK_TIER_COLOR, HERO_NETWORK_TIER_LABEL } from '@/lib/hero-network';
import {
  FLOW_NODE_BY_ID,
  compoundName,
  compoundTier,
  hallmarkDesc,
  hallmarkLabel,
  hallmarkTitle,
  pathwaysForNode,
} from '@/lib/hero-pathways';

interface HeroPathwayPanelProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
  onClose: () => void;
}

/** A chip that re-selects another node in the flow, so the diagram can be walked. */
function NodeChip({ id, label, color, onSelect }: { id: string; label: string; color?: string; onSelect: (id: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-white/85 transition-colors hover:border-white/25 hover:bg-white/[0.08]"
    >
      {color && <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} aria-hidden="true" />}
      {label}
    </button>
  );
}

/**
 * Persistent selection panel for the Pathway Flow. Renders the mechanism from
 * the selected node's point of view: a compound flows out to hallmarks
 * through its pathways; a hallmark is fed by compounds; a molecule is the hub
 * of one pathway. Docked at a fixed screen position (the scene tilts with
 * parallax, so anchoring interactive content to a moving projection would lag).
 */
export function HeroPathwayPanel({ selectedId, onSelect, onClose }: HeroPathwayPanelProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (selectedId) headingRef.current?.focus();
  }, [selectedId]);

  useEffect(() => {
    if (!selectedId) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedId, onClose]);

  if (!selectedId) return null;
  const node = FLOW_NODE_BY_ID.get(selectedId);
  if (!node) return null;

  const pathways = pathwaysForNode(selectedId);
  const raw = selectedId.slice(4);
  const tier = node.kind === 'compound' ? compoundTier(raw) : undefined;

  const heading =
    node.kind === 'compound' ? compoundName(raw) : node.kind === 'hallmark' ? hallmarkTitle(raw) : node.label;
  const eyebrow =
    node.kind === 'compound' ? 'Compound' : node.kind === 'hallmark' ? 'Hallmark of aging' : 'Pathway hub';

  return (
    <GlassPanel
      depth="content"
      scrim
      className="absolute bottom-4 left-4 right-4 z-20 max-h-[88%] overflow-y-auto rounded-2xl p-5 sm:left-4 sm:right-auto sm:w-[360px]"
    >
      <button
        type="button"
        onClick={onClose}
        className="focus-ring absolute right-3 top-3 rounded-full p-1.5 text-white/60 hover:text-white"
        aria-label="Close details"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>

      <p className="mb-1 text-label font-semibold uppercase tracking-widest text-white/45">{eyebrow}</p>
      <h3 ref={headingRef} tabIndex={-1} className="mb-1 pr-6 text-base font-bold text-white outline-none">
        {heading}
      </h3>
      {tier && (
        <p className="mb-3 text-xs font-medium" style={{ color: HERO_NETWORK_TIER_COLOR[tier] }}>
          {HERO_NETWORK_TIER_LABEL[tier]}
        </p>
      )}
      {node.kind === 'hallmark' && <p className="mb-3 text-sm leading-relaxed text-white/70">{hallmarkDesc(raw)}</p>}

      <div className="space-y-4">
        {pathways.map((p) => {
          const molNode = FLOW_NODE_BY_ID.get(`mol:${p.id}`);
          return (
            <div key={p.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold" style={{ color: p.color }}>
                <span className="h-2 w-2 rounded-full" style={{ background: p.color }} aria-hidden="true" />
                {p.name}
              </p>

              {/* compound → molecule → hallmark, as walkable chips */}
              <div className="mb-2 flex flex-wrap items-center gap-1.5 text-white/40">
                {molNode && (
                  <NodeChip id={molNode.id} label={p.molecule} color={p.color} onSelect={onSelect} />
                )}
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
                {p.hallmarkIds.map((h) => (
                  <NodeChip key={h} id={`hlm:${h}`} label={hallmarkLabel(h)} onSelect={onSelect} />
                ))}
              </div>

              {node.kind !== 'compound' && (
                <div className="mb-2 flex flex-wrap items-center gap-1.5">
                  {p.compoundIds.map((c) => (
                    <NodeChip key={c} id={`cmp:${c}`} label={compoundName(c)} onSelect={onSelect} />
                  ))}
                </div>
              )}

              <p className="text-xs leading-snug text-white/60">{p.synergy}</p>
            </div>
          );
        })}
      </div>

      {node.kind === 'compound' && (
        <Link
          href={`/library/compounds/${raw}`}
          className="focus-ring mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent-cyan)] hover:underline"
        >
          View compound
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      )}
    </GlassPanel>
  );
}
