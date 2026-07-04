'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { StackAnalysis } from '@/lib/stack-analysis';
import { cn } from '@/lib/utils';
import { LongevityGaugeArc } from '@/components/ui/LongevityGaugeArc';
import { HallmarkCoverageRing } from '@/components/ui/HallmarkCoverageRing';

const gaugeColor = (score: number) =>
  score >= 75
    ? 'var(--accent-emerald)'
    : score >= 50
      ? 'var(--accent-cyan)'
      : score >= 25
        ? 'var(--accent-amber)'
        : 'var(--accent-rose)';

interface SynergyScorePanelProps {
  score: number;
  analysis: StackAnalysis;
  verdict?: string;
  className?: string;
}

export function SynergyScorePanel({ score, analysis, verdict, className = '' }: SynergyScorePanelProps) {
  const color = gaugeColor(score);

  return (
    <div className={cn('card-premium border border-border/60 rounded-2xl p-5', className)}>
      <p className="text-label text-accent-violet mb-4">Live Synergy Score</p>

      {/* Gauge + coverage ring side by side */}
      <div className="flex items-center gap-5">
        {/* LQ arc gauge */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={score}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35 }}
            >
              <LongevityGaugeArc
                score={score}
                color={color}
                label="SYNERGY"
                sublabel="out of 100"
                size={148}
                immediate
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Hallmark coverage ring */}
        <div className="flex flex-col items-center gap-1.5 shrink-0">
          <HallmarkCoverageRing
            count={analysis.hallmarkCount}
            size={88}
            className="w-22"
          />
          <p className="text-[9px] font-mono text-muted-foreground tracking-widest">HALLMARKS</p>
        </div>
      </div>

      {/* Evidence tier + cost pills */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        <div className="glass rounded-xl py-2.5 px-3 text-center">
          <p className="text-sm font-bold text-accent-emerald">Tier {analysis.evidenceTier}</p>
          <p className="text-[9px] font-mono text-muted-foreground mt-0.5">EVIDENCE GRADE</p>
        </div>
        <div className="glass rounded-xl py-2.5 px-3 text-center">
          <p className="text-sm font-bold text-accent-amber">
            ${analysis.monthlyCost.low}–{analysis.monthlyCost.high}
          </p>
          <p className="text-[9px] font-mono text-muted-foreground mt-0.5">EST. / MONTH</p>
        </div>
      </div>

      {/* Synergy bar (secondary indicator) */}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-1.5 text-[10px] font-mono text-muted-foreground">
          <span>Pathway synergy</span>
          <span style={{ color }}>{score}%</span>
        </div>
        <div className="h-1.5 bg-muted/40 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, var(--accent-violet), ${color})` }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      {/* Verdict */}
      {verdict && (
        <p className="text-body-sm mt-4 pt-4 border-t border-border/40 text-left">{verdict}</p>
      )}
    </div>
  );
}
