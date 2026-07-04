'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  CheckCircle2,
  Copy,
  FlaskConical,
  Activity,
  AlertTriangle,
  Zap,
  Pill,
} from 'lucide-react';
import { compounds } from '@/lib/data';
import { useStack } from '@/context/PlatformContext';
import type { EliteStack } from '@/lib/stacks-library';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { PmidLink } from '@/components/trust/SourceCitation';
import { goalLabels, costLabels, simplicityLabels } from '@/lib/stacks-library';

interface EliteStackCardProps {
  stack: EliteStack;
  expanded?: boolean;
}


const costColor = { budget: 'text-accent-emerald', moderate: 'text-accent-cyan', premium: 'text-accent-violet', clinical: 'text-accent-rose' };

export function EliteStackCard({ stack, expanded: defaultExpanded = false }: EliteStackCardProps) {
  const [open, setOpen] = useState(defaultExpanded);
  const [cloned, setCloned] = useState(false);
  const { setSelected } = useStack();

  const loadStack = () => {
    setSelected([...stack.compoundIds]);
    setCloned(true);
    setTimeout(() => setCloned(false), 2500);
    setTimeout(() => {
      document.getElementById('stack-builder')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const compoundNames = stack.compoundIds.map((id) => compounds.find((c) => c.id === id)?.name ?? id);

  return (
    <motion.div layout className="glass rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-5 hover:bg-muted/30 transition"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[10px] font-mono text-accent-violet">{goalLabels[stack.goal]}</span>
              <EvidenceTag tier={stack.evidenceTier} size="sm" />
              {stack.rxCompounds && (
                <span className="text-[10px] font-mono text-accent-rose bg-accent-rose/10 px-2 py-0.5 rounded-full">
                  Rx Component
                </span>
              )}
            </div>
            <h3 className="font-bold text-lg mb-1">{stack.name}</h3>
            <p className="text-sm text-muted-foreground">{stack.tagline}</p>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="flex items-center gap-1 text-accent-emerald">
              <Zap className="w-3.5 h-3.5" />
              <span className="text-sm font-bold">{stack.synergyRating}</span>
            </div>
            <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {compoundNames.map((name) => (
            <span key={name} className="text-[10px] font-mono bg-accent-violet/10 text-accent-violet px-2 py-0.5 rounded-full">
              {name}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="text-center">
            <p className={`text-xs font-bold ${costColor[stack.costTier]}`}>{costLabels[stack.costTier]}</p>
            <p className="text-[9px] font-mono text-caption">${stack.costMonthlyUsd.low}–{stack.costMonthlyUsd.high}/mo</p>
          </div>
          <div className="text-center">
            <p className="text-xs font-bold text-accent-cyan">{simplicityLabels[stack.simplicity]}</p>
            <p className="text-[9px] font-mono text-caption">{stack.compoundIds.length} OTC compounds</p>
          </div>
          <div className="text-center">
            <p className="text-xs font-bold text-accent-amber">{stack.hallmarkCoverage.length} hallmarks</p>
            <p className="text-[9px] font-mono text-caption">{stack.durationWeeks}</p>
          </div>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-6 border-t border-border pt-5">
              <p className="text-sm text-muted-foreground leading-relaxed">{stack.rationale}</p>
              <p className="text-xs text-muted-foreground italic">{stack.evidenceSummary}</p>

              {/* Breakdown */}
              <div>
                <p className="text-[10px] font-mono text-accent-violet uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FlaskConical className="w-3.5 h-3.5" /> Compound Breakdown
                </p>
                <div className="space-y-3">
                  {stack.breakdown.map((b) => {
                    const compound = compounds.find((c) => c.id === b.compoundId);
                    return (
                      <div key={b.compoundId} className="glass rounded-xl p-4">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-semibold text-sm">{compound?.name ?? b.compoundId}</h4>
                          <span className="text-[10px] font-mono text-muted-foreground">{compound?.dose}</span>
                        </div>
                        <p className="text-xs text-accent-violet mb-1">{b.role}</p>
                        <p className="text-xs text-muted-foreground">{b.mechanism}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Rx compounds */}
              {stack.rxCompounds && (
                <div>
                  <p className="text-[10px] font-mono text-accent-rose uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Pill className="w-3.5 h-3.5" /> Prescription Components (Educational)
                  </p>
                  {stack.rxCompounds.map((rx) => (
                    <div key={rx.id} className="glass rounded-xl p-4 border border-accent-rose/20 mb-2">
                      <h4 className="font-semibold text-sm text-rose-300">{rx.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{rx.class} — {rx.typicalDose}</p>
                      <p className="text-xs text-muted-foreground mt-2">{rx.note}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Dosing schedule */}
              <div>
                <p className="text-[10px] font-mono text-accent-amber uppercase tracking-wider mb-3">Dosing Schedule</p>
                {stack.dosingSchedule.map((block, i) => (
                  <div key={i} className="mb-3 last:mb-0">
                    <p className="text-xs font-semibold text-foreground/80 mb-1">
                      {block.period} {block.time && `· ${block.time}`}
                    </p>
                    {block.items.map((item, j) => {
                      const isRx = !compounds.some((c) => c.id === item.compoundId);
                      const name = isRx
                        ? stack.rxCompounds?.find((r) => r.id === item.compoundId)?.name ?? item.compoundId
                        : compounds.find((c) => c.id === item.compoundId)?.name ?? item.compoundId;
                      return (
                        <div key={j} className="flex justify-between text-xs py-1 border-b border-border last:border-0">
                          <span className={isRx ? 'text-rose-300' : 'text-muted-foreground'}>{name}</span>
                          <span className="font-mono text-caption">{item.dose}</span>
                        </div>
                      );
                    })}
                    <p className="text-[10px] text-caption mt-1">{block.rationale}</p>
                  </div>
                ))}
              </div>

              {/* Monitoring */}
              <div>
                <p className="text-[10px] font-mono text-accent-cyan uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5" /> Monitoring Recommendations
                </p>
                <ul className="space-y-1">
                  {stack.monitoring.map((m) => (
                    <li key={m} className="text-xs text-muted-foreground flex gap-2">
                      <span className="text-accent-cyan shrink-0">•</span> {m}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Studies */}
              <div>
                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2">Key Evidence</p>
                {stack.studies.map((s) => (
                  <div key={s.pmid} className="py-1">
                    <p className="text-body-sm mb-0.5">{s.title} ({s.journal}, {s.year})</p>
                    <PmidLink pmid={s.pmid} />
                  </div>
                ))}
              </div>

              {/* Warnings */}
              {stack.warnings.length > 0 && (
                <div className="glass rounded-xl p-4 border border-accent-amber/20">
                  <p className="text-[10px] font-mono text-accent-amber uppercase tracking-wider mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5" /> Warnings
                  </p>
                  <ul className="space-y-1">
                    {stack.warnings.map((w) => (
                      <li key={w} className="text-xs text-muted-foreground">• {w}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={loadStack}
                className={`w-full py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  cloned
                    ? 'bg-accent-emerald text-black'
                    : 'bg-accent-violet text-black hover:bg-accent-cyan'
                }`}
              >
                {cloned ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Loaded into builder ↓
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Clone &amp; Customize
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}