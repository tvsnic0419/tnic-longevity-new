'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Crown } from 'lucide-react';
import { SectionShell } from '@/components/SectionShell';
import { ContextRail } from '@/components/ui/ContextRail';
import { competitors } from '@/lib/data';

const featureMatrix = [
  { feature: 'Interactive Stack Architect', tnic: true, blueprint: false, donotage: true, insidetracker: false, lifespan: false },
  { feature: 'Synergy Scoring Engine', tnic: true, blueprint: false, donotage: false, insidetracker: false, lifespan: false },
  { feature: '12 Hallmarks Coverage Map', tnic: true, blueprint: false, donotage: false, insidetracker: false, lifespan: true },
  { feature: 'Biomarker Intelligence', tnic: true, blueprint: true, donotage: false, insidetracker: true, lifespan: false },
  { feature: 'PubMed-Cited Compounds', tnic: true, blueprint: false, donotage: false, insidetracker: false, lifespan: true },
  { feature: 'Biological Age Calculator', tnic: true, blueprint: true, donotage: true, insidetracker: true, lifespan: false },
  { feature: 'Research Intel Feed', tnic: true, blueprint: false, donotage: false, insidetracker: false, lifespan: true },
  { feature: 'Zero Lab Cost Entry', tnic: true, blueprint: false, donotage: true, insidetracker: false, lifespan: true },
  { feature: 'Daily Protocol Timeline', tnic: true, blueprint: true, donotage: true, insidetracker: false, lifespan: false },
  { feature: 'Evidence Tier Grading', tnic: true, blueprint: false, donotage: false, insidetracker: false, lifespan: false },
  { feature: 'Local-First Data Privacy', tnic: true, blueprint: false, donotage: false, insidetracker: false, lifespan: false },
  { feature: 'Quiz-Based Personalization', tnic: true, blueprint: false, donotage: false, insidetracker: true, lifespan: false },
  { feature: 'Compound Interaction Checker', tnic: true, blueprint: false, donotage: false, insidetracker: false, lifespan: false },
];

export function CompetitiveEdge() {
  const [selected, setSelected] = useState(0);
  const comp = competitors[selected];

  return (
    <SectionShell
      id="edge"
      mod="MOD-EDG-06"
      theme="amber"
      badge="Competitive Intelligence"
      title="Why TNiC Wins"
      subtitle="We studied Blueprint, DoNotAge, InsideTracker, Lifespan.io, and Function Health — then built what none of them offer alone."
      className="bg-background"
    >
      <ContextRail
        what="Side-by-side competitive intelligence — strengths, gaps, and TNiC's differentiated stack."
        why="Longevity buyers compare Blueprint, InsideTracker, and affiliate stores without a unified evidence lens."
        next="Pick a competitor tab, then load your preset in Stack Architect to see what TNiC models that they do not."
        theme="amber"
        className="mb-8"
      />

      <div className="flex flex-wrap gap-2 mb-10">
        {competitors.map((c, i) => (
          <button
            key={c.name}
            onClick={() => setSelected(i)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              selected === i ? 'bg-accent-amber text-black' : 'glass text-muted-foreground hover:text-foreground'
            }`}
          >
            vs {c.name.split(' ')[0]}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          className="grid lg:grid-cols-2 gap-8 mb-16"
        >
          <div className="card-premium border border-border/60 p-8 glow-hover-amber">
            <p className="text-[10px] font-mono text-muted-foreground uppercase mb-2">Competitor</p>
            <h3 className="text-2xl font-bold mb-2">{comp.name}</h3>
            <p className="text-sm text-muted-foreground mb-6">{comp.focus}</p>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] font-mono text-accent-emerald uppercase mb-3">Their Strengths</p>
                {comp.strengths.map((s) => (
                  <div key={s} className="flex items-center gap-2 text-sm text-foreground/80 mb-2">
                    <Check className="w-3.5 h-3.5 text-accent-emerald shrink-0" /> {s}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-[10px] font-mono text-accent-rose uppercase mb-3">Their Gaps</p>
                {comp.gaps.map((g) => (
                  <div key={g} className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <X className="w-3.5 h-3.5 text-accent-rose shrink-0" /> {g}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card-premium border border-accent-amber/25 p-8 relative overflow-hidden glow-hover-amber">
            <div className="absolute top-0 right-0 w-40 h-40 bg-accent-amber/5 rounded-full blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-5 h-5 text-accent-amber" />
                <p className="text-[10px] font-mono text-accent-amber uppercase tracking-wider">TNiC Advantage</p>
              </div>
              <p className="text-lg leading-relaxed text-foreground">{comp.tnicAdvantage}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-4 pr-4 text-muted-foreground font-medium">Capability</th>
              <th className="py-4 px-3 text-center text-accent-amber font-bold">TNiC</th>
              <th className="py-4 px-3 text-center text-muted-foreground font-medium">Blueprint</th>
              <th className="py-4 px-3 text-center text-muted-foreground font-medium">DoNotAge</th>
              <th className="py-4 px-3 text-center text-muted-foreground font-medium">InsideTracker</th>
              <th className="py-4 px-3 text-center text-muted-foreground font-medium">Lifespan</th>
            </tr>
          </thead>
          <tbody>
            {featureMatrix.map((row) => (
              <tr key={row.feature} className="border-b border-border hover:bg-muted/30 transition">
                <td className="py-3.5 pr-4 text-foreground/80">{row.feature}</td>
                {(['tnic', 'blueprint', 'donotage', 'insidetracker', 'lifespan'] as const).map((key) => (
                  <td key={key} className="py-3.5 px-3 text-center">
                    {row[key] ? (
                      <Check className={`w-4 h-4 mx-auto ${key === 'tnic' ? 'text-accent-amber' : 'text-accent-emerald/60'}`} />
                    ) : (
                      <X className="w-4 h-4 mx-auto text-muted-foreground/50" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionShell>
  );
}