'use client';

import { useState } from 'react';
import { AlertTriangle, ChevronDown, Link2, ShieldAlert, Sparkles } from 'lucide-react';
import type { StackAnalysis, StackInteraction } from '@/lib/stack-analysis';
import { cn } from '@/lib/utils';
import { GlassPanel } from '@/components/ui/GlassPanel';

const interactionIcon = (type: StackInteraction['type']) => {
  if (type === 'synergy') return <Sparkles className="w-3.5 h-3.5 text-accent-emerald" aria-hidden="true" />;
  if (type === 'contraindication') return <ShieldAlert className="w-3.5 h-3.5 text-accent-rose" aria-hidden="true" />;
  return <AlertTriangle className="w-3.5 h-3.5 text-accent-amber" aria-hidden="true" />;
};

interface StackInteractionsPanelProps {
  analysis: StackAnalysis;
  className?: string;
}

export function StackInteractionsPanel({ analysis, className = '' }: StackInteractionsPanelProps) {
  const [showAllConsultIf, setShowAllConsultIf] = useState(false);
  const synergyInteractions = analysis.interactions.filter((i) => i.type === 'synergy');
  const cautionInteractions = analysis.interactions.filter((i) => i.type !== 'synergy');

  const extraSynergies = analysis.synergies.filter(
    (s) =>
      !synergyInteractions.some(
        (i) =>
          (i.compoundIds[0] === s.from && i.compoundIds[1] === s.to) ||
          (i.compoundIds[0] === s.to && i.compoundIds[1] === s.from),
      ),
  );

  const hasSynergies = synergyInteractions.length > 0 || extraSynergies.length > 0;
  const hasCautions = cautionInteractions.length > 0 || analysis.consultIf.length > 0;

  if (!hasSynergies && !hasCautions) return null;

  return (
    <div className={cn('space-y-4', className)}>
      {hasSynergies && (
        <GlassPanel depth="mid" className="rounded-2xl p-5">
          <p className="text-label text-accent-emerald mb-3 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            Active synergies
          </p>
          <div className="space-y-2">
            {synergyInteractions.map((i) => (
              <div key={`${i.compoundIds[0]}-${i.compoundIds[1]}`} className="text-xs">
                <p className="font-semibold text-accent-emerald">{i.title}</p>
                <p className="text-muted-foreground mt-0.5">{i.detail}</p>
              </div>
            ))}
            {extraSynergies.map((s) => (
              <div key={`${s.from}-${s.to}`} className="flex items-center gap-2 text-xs text-muted-foreground">
                <Link2 className="w-3 h-3 text-accent-emerald shrink-0" aria-hidden="true" />
                {s.label}
              </div>
            ))}
          </div>
        </GlassPanel>
      )}

      {hasCautions && (
        <GlassPanel depth="mid" className="rounded-2xl p-5 border border-accent-amber/20">
          <p className="text-label text-accent-amber mb-3 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
            Cautions & contraindications
          </p>
          <div className="space-y-2">
            {cautionInteractions.map((i) => (
              <div key={`${i.compoundIds[0]}-${i.compoundIds[1]}`} className="flex gap-2 text-xs">
                {interactionIcon(i.type)}
                <div>
                  <p className="font-semibold text-accent-amber">{i.title}</p>
                  <p className="text-muted-foreground mt-0.5">{i.detail}</p>
                </div>
              </div>
            ))}
            {(showAllConsultIf ? analysis.consultIf : analysis.consultIf.slice(0, 4)).map((c) => (
              <p key={c} className="text-xs text-muted-foreground pl-5">
                • {c}
              </p>
            ))}
            {analysis.consultIf.length > 4 && (
              <button
                type="button"
                onClick={() => setShowAllConsultIf((prev) => !prev)}
                className="focus-ring interactive flex items-center gap-1 text-[10px] font-mono text-accent-amber pl-5 uppercase tracking-wide"
                aria-expanded={showAllConsultIf}
              >
                <ChevronDown
                  className={cn('w-3 h-3 transition-transform', showAllConsultIf && 'rotate-180')}
                  aria-hidden="true"
                />
                {showAllConsultIf ? 'Show less' : `+${analysis.consultIf.length - 4} more — show all`}
              </button>
            )}
          </div>
        </GlassPanel>
      )}
    </div>
  );
}