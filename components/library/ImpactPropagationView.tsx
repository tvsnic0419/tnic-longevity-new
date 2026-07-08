'use client';

import { motion } from 'framer-motion';
import { ArrowDown, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RelationBadge } from './RelationBadge';
import { getImpactPropagation } from '@/lib/relations';

const hallmarkNames: Record<string, string> = {
  genomic:      'Genomic Instability',
  telomeres:    'Telomere Attrition',
  epigenetic:   'Epigenetic Alterations',
  proteostasis: 'Loss of Proteostasis',
  autophagy:    'Disabled Autophagy',
  mito:         'Mitochondrial Dysfunction',
  senescence:   'Cellular Senescence',
  stem:         'Stem Cell Exhaustion',
  communication:'Altered Communication',
  inflammation: 'Chronic Inflammation',
  dysbiosis:    'Gut Dysbiosis',
  nutrient:     'Nutrient Dysregulation',
};

const hallmarkAccent: Record<string, string> = {
  genomic:      'cyan',
  telomeres:    'amber',
  epigenetic:   'violet',
  proteostasis: 'violet',
  autophagy:    'cyan',
  mito:         'emerald',
  senescence:   'rose',
  stem:         'violet',
  communication:'amber',
  inflammation: 'rose',
  dysbiosis:    'emerald',
  nutrient:     'amber',
};

const accentText: Record<string, string> = {
  cyan:    'text-accent-cyan',
  amber:   'text-accent-amber',
  violet:  'text-accent-violet',
  emerald: 'text-accent-emerald',
  rose:    'text-accent-rose',
};

const accentBg: Record<string, string> = {
  cyan:    'bg-accent-cyan/8 border-accent-cyan/20',
  amber:   'bg-accent-amber/8 border-accent-amber/20',
  violet:  'bg-accent-violet/8 border-accent-violet/20',
  emerald: 'bg-accent-emerald/8 border-accent-emerald/20',
  rose:    'bg-accent-rose/8 border-accent-rose/20',
};

function LeverageBar({ score }: { score: number }) {
  const color =
    score >= 85 ? 'from-accent-rose to-accent-amber' :
    score >= 75 ? 'from-accent-amber to-accent-emerald' :
    'from-accent-emerald to-accent-cyan';

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          className={cn('h-full rounded-full bg-gradient-to-r', color)}
        />
      </div>
      <span className="text-xs font-bold tabular-nums w-8 text-right">{score}</span>
    </div>
  );
}

interface ImpactPropagationViewProps {
  hallmarkId: string;
  className?: string;
}

export function ImpactPropagationView({ hallmarkId, className }: ImpactPropagationViewProps) {
  const propagation = getImpactPropagation(hallmarkId);

  if (!propagation) {
    return (
      <p className="text-xs text-muted-foreground text-center py-6">
        Propagation data not yet available for this hallmark.
      </p>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Leverage Score */}
      <div className="glass rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-accent-amber" />
          <p className="text-xs font-bold uppercase tracking-wider">Systems Leverage Score</p>
        </div>
        <LeverageBar score={propagation.leverageScore} />
        <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{propagation.pathway}</p>
      </div>

      {/* Direct Effects */}
      <div>
        <p className="text-[10px] font-mono text-accent-cyan uppercase tracking-wider mb-3">
          Direct Effects — Tier 1 Cascade
        </p>
        <div className="space-y-2">
          {propagation.directEffects.map((effect, i) => {
            const accent = hallmarkAccent[effect.hallmarkId] ?? 'cyan';
            return (
              <motion.div
                key={effect.hallmarkId}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className={cn('rounded-xl border p-4', accentBg[accent])}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className={cn('text-sm font-semibold', accentText[accent])}>
                    {hallmarkNames[effect.hallmarkId] ?? effect.hallmarkId}
                  </span>
                  <RelationBadge type={effect.type} strength={effect.strength} showStrength={false} />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{effect.mechanism}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Secondary Effects */}
      {propagation.secondaryEffects.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ArrowDown className="w-3.5 h-3.5 text-muted-foreground" />
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
              Secondary Cascade — via Intermediaries
            </p>
          </div>
          <div className="space-y-2 pl-4 border-l-2 border-border/50">
            {propagation.secondaryEffects.map((effect, i) => {
              const accent = hallmarkAccent[effect.hallmarkId] ?? 'cyan';
              return (
                <motion.div
                  key={`${effect.hallmarkId}-${i}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="rounded-lg border border-border/40 bg-card/50 p-3"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn('text-xs font-semibold', accentText[accent])}>
                      {hallmarkNames[effect.hallmarkId] ?? effect.hallmarkId}
                    </span>
                    <span className="text-[9px] font-mono text-muted-foreground">
                      via {hallmarkNames[effect.via] ?? effect.via}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{effect.mechanism}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
