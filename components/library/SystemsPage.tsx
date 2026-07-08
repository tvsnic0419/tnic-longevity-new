'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Network, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { hallmarkLibrary } from '@/lib/hallmarks-library';
import { impactPropagations } from '@/lib/relations';
import { SystemsSynthesisView } from './SystemsSynthesisView';
import { EmergentEffectsView } from './EmergentEffectsView';
import { PathwaySynthesis } from './PathwaySynthesis';
import { ContextRail } from '@/components/ui/ContextRail';

const hallmarkAccent: Record<string, 'cyan' | 'amber' | 'violet' | 'emerald' | 'rose'> = {
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

const accentBg: Record<string, string> = {
  cyan:    'bg-accent-cyan/10 border-accent-cyan/30 text-accent-cyan',
  amber:   'bg-accent-amber/10 border-accent-amber/30 text-accent-amber',
  violet:  'bg-accent-violet/10 border-accent-violet/30 text-accent-violet',
  emerald: 'bg-accent-emerald/10 border-accent-emerald/30 text-accent-emerald',
  rose:    'bg-accent-rose/10 border-accent-rose/30 text-accent-rose',
};

const accentGlow: Record<string, string> = {
  cyan:    'glow-hover-cyan',
  amber:   'glow-hover-amber',
  violet:  'glow-hover-violet',
  emerald: 'glow-hover-emerald',
  rose:    'glow-hover-rose',
};

const leverageByHallmark = new Map(
  impactPropagations.map((p) => [p.hallmarkId, p.leverageScore])
);

export function SystemsPage() {
  const sorted = [...hallmarkLibrary].sort((a, b) => {
    const la = leverageByHallmark.get(a.id) ?? 0;
    const lb = leverageByHallmark.get(b.id) ?? 0;
    return lb - la;
  });

  const [selected, setSelected] = useState(sorted[0].id);
  const [view, setView] = useState<'synthesis' | 'pathways' | 'emergent'>('synthesis');

  const selectedHallmark = hallmarkLibrary.find((h) => h.id === selected)!;
  const leverage = leverageByHallmark.get(selected);

  return (
    <div className="min-h-screen bg-background pt-6 md:pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="icon-badge-violet w-8 h-8 rounded-xl flex items-center justify-center">
              <Network className="w-4 h-4 text-accent-violet" />
            </div>
            <p className="font-mono text-[10px] text-accent-violet tracking-widest uppercase">Systems Synthesis</p>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Hallmark Systems Map
          </h1>
          <p className="text-muted-foreground max-w-2xl leading-relaxed">
            How do the 12 Hallmarks of Aging interact? Select a hallmark to explore its cross-system effects, molecular leverage score, shared pathways, and emergent synergies.
          </p>
        </motion.div>

        <ContextRail
          what="Cross-hallmark relationships, cascade propagation, and emergent synergy effects for all 12 Hallmarks of Aging."
          why="Targeting one hallmark always ripples. Understanding leverage points and feedback loops lets you design interventions that address multiple hallmarks simultaneously."
          next="Select any hallmark to explore its downstream cascade. High leverage-score hallmarks (mito, senescence, inflammation) affect the most downstream systems."
          theme="violet"
          className="mb-10"
        />

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left — hallmark selector */}
          <div className="lg:col-span-4 space-y-2">
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-3 px-1">
              Select Hallmark — sorted by leverage
            </p>
            {sorted.map((h) => {
              const accent = hallmarkAccent[h.id] ?? 'cyan';
              const lv = leverageByHallmark.get(h.id);
              const active = selected === h.id;
              return (
                <button
                  key={h.id}
                  onClick={() => setSelected(h.id)}
                  className={cn(
                    'w-full flex items-center justify-between gap-3 p-3.5 rounded-xl border text-left transition-all',
                    active
                      ? `${accentBg[accent]} ${accentGlow[accent]}`
                      : 'border-border/40 bg-card/30 hover:border-border hover:bg-card/60',
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={cn(
                      'text-[10px] font-mono w-5 shrink-0',
                      active ? accentBg[accent].split(' ')[2] : 'text-muted-foreground',
                    )}>
                      {String(h.number).padStart(2, '0')}
                    </span>
                    <span className={cn('text-sm font-semibold truncate', active ? accentBg[accent].split(' ')[2] : 'text-foreground')}>
                      {h.title}
                    </span>
                  </div>
                  {lv !== undefined && (
                    <span className={cn(
                      'text-[10px] font-mono shrink-0 tabular-nums',
                      lv >= 85 ? 'text-accent-rose' : lv >= 75 ? 'text-accent-amber' : 'text-muted-foreground',
                    )}>
                      {lv}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Leverage legend */}
            <div className="mt-4 p-3 rounded-xl border border-border/40 bg-card/20">
              <p className="text-[9px] font-mono text-muted-foreground uppercase mb-2">Leverage Score Legend</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent-rose shrink-0" />
                  <span className="text-[10px] text-muted-foreground">85+ · High systems impact</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent-amber shrink-0" />
                  <span className="text-[10px] text-muted-foreground">75–84 · Moderate cascade</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/40 shrink-0" />
                  <span className="text-[10px] text-muted-foreground">below 75 · Downstream integrator</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right — synthesis panel */}
          <div className="lg:col-span-8">
            {selectedHallmark && (
              <motion.div
                key={selected}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Hallmark header */}
                <div className="rounded-2xl border border-border/60 bg-card/40 p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">
                          Hallmark {selectedHallmark.number} of 12
                        </p>
                        {leverage !== undefined && (
                          <span className={cn(
                            'text-[10px] font-mono px-2 py-0.5 rounded-full border',
                            leverage >= 85
                              ? 'text-accent-rose bg-accent-rose/10 border-accent-rose/25'
                              : leverage >= 75
                              ? 'text-accent-amber bg-accent-amber/10 border-accent-amber/25'
                              : 'text-muted-foreground bg-card border-border',
                          )}>
                            Leverage {leverage}
                          </span>
                        )}
                      </div>
                      <h2 className="text-xl font-bold tracking-tight">{selectedHallmark.title}</h2>
                      <p className="text-sm text-muted-foreground mt-1">{selectedHallmark.tagline}</p>
                    </div>
                    <Link
                      href={`/library/${selectedHallmark.slug}`}
                      className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-accent-cyan hover:text-accent-cyan/80 transition"
                    >
                      Full entry <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{selectedHallmark.summary}</p>
                </div>

                {/* Sub-view tabs */}
                <div className="flex gap-1 p-1 bg-card border border-border rounded-xl">
                  {([
                    { id: 'synthesis', label: 'Systems Effects' },
                    { id: 'pathways',  label: 'Pathways' },
                    { id: 'emergent',  label: 'Emergent Synergies' },
                  ] as const).map(({ id, label }) => (
                    <button
                      key={id}
                      onClick={() => setView(id)}
                      className={cn(
                        'flex-1 text-xs font-semibold py-2 px-3 rounded-lg transition-all',
                        view === id
                          ? 'bg-accent-violet/15 text-accent-violet border border-accent-violet/25'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Content */}
                <motion.div
                  key={`${selected}-${view}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {view === 'synthesis' && <SystemsSynthesisView hallmarkId={selected} />}
                  {view === 'pathways' && <PathwaySynthesis hallmarkId={selected} showAll />}
                  {view === 'emergent' && <EmergentEffectsView hallmarkId={selected} />}
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
