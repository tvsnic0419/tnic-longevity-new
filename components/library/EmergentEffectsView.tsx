'use client';

import { motion } from 'framer-motion';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { SynergyNetworkVisual } from '@/components/illustrations/SynergyNetworkVisual';
import { emergentEffects, getEmergentEffectsForHallmark, getEmergentEffectsForCompound } from '@/lib/relations';
import type { EmergentEffect } from '@/lib/relations';

const compoundNames: Record<string, string> = {
  nmn: 'NMN',
  cakg: 'Ca-AKG',
  resveratrol: 'Resveratrol',
  sulforaphane: 'Sulforaphane',
  glynac: 'GlyNAC',
  rala: 'R-ALA',
  fisetin: 'Fisetin',
  quercetin: 'Quercetin',
  omega3: 'Omega-3',
  urolithina: 'Urolithin A',
  spermidine: 'Spermidine',
};

const compoundHrefs: Record<string, string> = {
  nmn: '/library/nmn',
  cakg: '/library/ca-akg',
  resveratrol: '/library/resveratrol',
  sulforaphane: '/library/sulforaphane',
  glynac: '/library/glynac',
  rala: '/library/r-alpha-lipoic-acid',
  fisetin: '/library/fisetin',
};

const evidenceColors: Record<string, string> = {
  A: 'text-accent-emerald bg-accent-emerald/10 border-accent-emerald/25',
  B: 'text-accent-cyan bg-accent-cyan/10 border-accent-cyan/25',
  C: 'text-accent-amber bg-accent-amber/10 border-accent-amber/25',
};

const evidenceLabels: Record<string, string> = {
  A: 'Human RCT',
  B: 'Strong Pre-clinical',
  C: 'Emerging Evidence',
};

function multiplierLabel(m: number): string {
  return `${m.toFixed(1)}× synergy`;
}

function EmergentCard({ effect, index }: { effect: EmergentEffect; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="rounded-2xl border border-border/60 bg-gradient-to-br from-accent-violet/[0.06] to-transparent p-5 space-y-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-accent-violet shrink-0" />
            <h4 className="text-sm font-bold text-foreground leading-tight">{effect.title}</h4>
          </div>
          <p className="text-xs text-muted-foreground leading-snug">{effect.tagline}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border', evidenceColors[effect.evidence])}>
            {evidenceLabels[effect.evidence]}
          </span>
          <span className="text-[10px] font-mono text-accent-violet bg-accent-violet/10 border border-accent-violet/25 px-2 py-0.5 rounded-full">
            {multiplierLabel(effect.synergyMultiplier)}
          </span>
        </div>
      </div>

      {/* Mechanism */}
      <div className="rounded-lg bg-card/60 border border-border/40 p-3">
        <p className="text-[9px] font-mono text-muted-foreground uppercase mb-1.5">Mechanism</p>
        <p className="text-xs text-muted-foreground leading-relaxed">{effect.mechanism}</p>
      </div>

      {/* Emergent benefit */}
      <div className="rounded-lg bg-accent-emerald/[0.07] border border-accent-emerald/20 p-3">
        <p className="text-[9px] font-mono text-accent-emerald uppercase mb-1.5">Emergent Benefit</p>
        <p className="text-xs text-foreground/80 leading-relaxed">{effect.emergentBenefit}</p>
      </div>

      {/* Compounds */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {effect.compoundIds.map((id) => {
          const href = compoundHrefs[id];
          const label = compoundNames[id] ?? id;
          return href ? (
            <Link
              key={id}
              href={href}
              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border bg-accent-violet/10 text-accent-violet border-accent-violet/25 hover:bg-accent-violet/20 transition"
            >
              {label}
              <ArrowUpRight className="w-2.5 h-2.5" />
            </Link>
          ) : (
            <span key={id} className="text-xs font-semibold px-2.5 py-1 rounded-lg border bg-accent-violet/10 text-accent-violet border-accent-violet/25">
              {label}
            </span>
          );
        })}
      </div>
    </motion.div>
  );
}

interface EmergentEffectsViewProps {
  hallmarkId?: string;
  compoundId?: string;
  showAll?: boolean;
  className?: string;
}

export function EmergentEffectsView({ hallmarkId, compoundId, showAll = false, className }: EmergentEffectsViewProps) {
  const effects = showAll
    ? emergentEffects
    : hallmarkId
    ? getEmergentEffectsForHallmark(hallmarkId)
    : compoundId
    ? getEmergentEffectsForCompound(compoundId)
    : [];

  if (effects.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
        <Sparkles className="w-8 h-8 opacity-25" />
        <p className="text-xs">No emergent effects mapped for this selection.</p>
        <p className="text-[10px] text-muted-foreground/60">Try targeting multiple related hallmarks for compound synergies.</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      <p className="text-xs text-muted-foreground leading-relaxed">
        Emergent effects arise when targeting <span className="text-foreground font-semibold">multiple hallmarks simultaneously</span> — the combined intervention produces benefits greater than the sum of individual effects.
      </p>
      {showAll && (
        <div className="rounded-2xl border border-border/50 bg-card/30 p-4 overflow-x-auto">
          <p className="text-[9px] font-mono text-muted-foreground uppercase mb-3">Compound Synergy Network</p>
          <SynergyNetworkVisual className="w-full max-w-[540px] mx-auto" />
        </div>
      )}
      {effects.map((effect, i) => (
        <EmergentCard key={effect.id} effect={effect} index={i} />
      ))}
    </div>
  );
}
