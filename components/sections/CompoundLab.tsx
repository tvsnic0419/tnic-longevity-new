'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, GitCompareArrows, ExternalLink, Table2 } from 'lucide-react';
import { SectionShell } from '@/components/SectionShell';
import { compounds } from '@/lib/data';
import type { Compound } from '@/lib/types';

const evidenceColors = { A: 'text-accent-emerald bg-accent-emerald/10', B: 'text-accent-cyan bg-accent-cyan/10', C: 'text-accent-amber bg-accent-amber/10' };

function CompoundPanel({ compound, compare }: { compound: Compound; compare?: boolean }) {
  return (
    <div className={`gradient-border p-6 ${compare ? 'h-full' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-accent-cyan bg-accent-cyan/10 px-3 py-1 rounded-full">
          {compound.badge.toUpperCase()}
        </span>
        <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${evidenceColors[compound.evidence]}`}>
          Evidence {compound.evidence}
        </span>
      </div>
      <h3 className="text-xl font-bold mb-1">{compound.name}</h3>
      <p className="text-xs text-muted-foreground mb-4">{compound.brand}</p>

      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted-foreground">Bioavailability</span>
          <span className="font-mono text-accent-cyan">{compound.bioavailability}%</span>
        </div>
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-accent-cyan rounded-full" style={{ width: `${compound.bioavailability}%` }} />
        </div>
      </div>

      <p className="text-xs text-accent-emerald/80 font-mono mb-3">{compound.pathway}</p>
      <p className="text-sm text-foreground/80 mb-4 leading-relaxed">{compound.mechanism}</p>

      <div className="grid grid-cols-2 gap-3 text-xs mb-4">
        <div className="glass rounded-lg p-3">
          <span className="text-muted-foreground block mb-1">Dose</span>
          <span className="font-mono text-foreground/80">{compound.dose}</span>
        </div>
        <div className="glass rounded-lg p-3">
          <span className="text-muted-foreground block mb-1">Timing</span>
          <span className="font-mono text-foreground/80">{compound.timing}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {compound.hallmarks.map((h) => (
          <span key={h} className="text-[10px] font-mono bg-accent-violet/10 text-accent-violet px-2 py-0.5 rounded">
            {h}
          </span>
        ))}
      </div>

      {compound.studies.length > 0 && (
        <div className="mb-4 border-t border-border pt-4">
          <p className="text-[10px] font-mono text-accent-amber uppercase tracking-wider mb-2">PubMed Evidence</p>
          {compound.studies.map((s) => (
            <a
              key={s.pmid}
              href={`https://pubmed.ncbi.nlm.nih.gov/${s.pmid}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 text-xs text-muted-foreground hover:text-accent-cyan transition-colors mb-2 group"
            >
              <ExternalLink className="w-3 h-3 shrink-0 mt-0.5 opacity-50 group-hover:opacity-100" />
              <span>
                <span className="text-foreground/80">{s.title}</span>
                <span className="text-caption block font-mono">{s.journal} · {s.year}</span>
              </span>
            </a>
          ))}
        </div>
      )}

      {!compare && (
        <a
          href="https://amazon.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-foreground/80 hover:text-accent-cyan transition-colors"
        >
          Shop Now <ChevronRight className="w-4 h-4" />
        </a>
      )}
    </div>
  );
}

type ViewMode = 'single' | 'compare' | 'matrix';

export function CompoundLab() {
  const [selected, setSelected] = useState(compounds[0].id);
  const [viewMode, setViewMode] = useState<ViewMode>('single');
  const [compareB, setCompareB] = useState(compounds[1].id);

  const active = compounds.find((c) => c.id === selected)!;
  const compareCompound = compounds.find((c) => c.id === compareB)!;
  const sharedSynergy = active.synergies.includes(compareB);

  return (
    <SectionShell
      id="compounds"
      mod="MOD-LAB-03"
      theme="amber"
      badge="Molecule Intelligence Lab"
      title="Compound Deep Analysis"
      subtitle="Evidence tiers, bioavailability scores, mechanistic pathways, and hallmark targeting — not a catalog, a research instrument."
      className="bg-background"
    >
      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() => setViewMode('single')}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            viewMode === 'single' ? 'bg-accent-amber text-black' : 'glass text-muted-foreground'
          }`}
        >
          Single Analysis
        </button>
        <button
          onClick={() => setViewMode('compare')}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
            viewMode === 'compare' ? 'bg-accent-amber text-black' : 'glass text-muted-foreground'
          }`}
        >
          <GitCompareArrows className="w-4 h-4" />
          Compare Mode
        </button>
        <button
          onClick={() => setViewMode('matrix')}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
            viewMode === 'matrix' ? 'bg-accent-amber text-black' : 'glass text-muted-foreground'
          }`}
        >
          <Table2 className="w-4 h-4" />
          Full Matrix
        </button>
      </div>

      {viewMode !== 'matrix' && (
        <div className="flex flex-wrap gap-2 mb-8">
          {compounds.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelected(c.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selected === c.id && viewMode === 'single'
                  ? 'bg-accent-amber/20 text-accent-amber border border-accent-amber/30'
                  : 'glass text-muted-foreground hover:text-foreground'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {viewMode === 'single' ? (
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-2xl"
          >
            <CompoundPanel compound={active} />
            <div className="mt-6 glass rounded-xl p-5">
              <p className="text-[10px] font-mono text-accent-amber uppercase tracking-wider mb-3">Synergy Partners</p>
              <div className="flex flex-wrap gap-2">
                {active.synergies.map((s) => {
                  const partner = compounds.find((c) => c.id === s);
                  return partner ? (
                    <button
                      key={s}
                      onClick={() => { setCompareB(s); setViewMode('compare'); }}
                      className="text-xs glass px-3 py-2 rounded-lg hover:border-accent-amber/30 transition-all"
                    >
                      + {partner.name}
                    </button>
                  ) : null;
                })}
              </div>
            </div>
          </motion.div>
        ) : viewMode === 'compare' ? (
          <motion.div
            key="compare"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-xs text-muted-foreground self-center mr-2">Compare with:</span>
              {compounds.filter((c) => c.id !== selected).map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCompareB(c.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    compareB === c.id
                      ? 'bg-accent-amber/20 text-accent-amber border border-accent-amber/30'
                      : 'glass text-muted-foreground'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6 relative">
              <CompoundPanel compound={active} compare />
              <CompoundPanel compound={compareCompound} compare />

              {sharedSynergy && (
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex">
                  <div className="bg-accent-emerald text-black text-xs font-bold px-4 py-2 rounded-full shadow-[0_0_30px_rgba(52,211,153,0.4)]">
                    SYNERGY DETECTED
                  </div>
                </div>
              )}
            </div>

            {sharedSynergy && (
              <p className="md:hidden text-center text-accent-emerald text-sm font-semibold mt-4">
                ✓ Synergy Detected
              </p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="matrix"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="overflow-x-auto"
          >
            <table className="w-full text-sm border-collapse min-w-[720px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-[10px] font-mono text-muted-foreground uppercase">Compound</th>
                  <th className="text-left py-3 px-4 text-[10px] font-mono text-muted-foreground uppercase">Pathway</th>
                  <th className="text-center py-3 px-4 text-[10px] font-mono text-muted-foreground uppercase">Evidence</th>
                  <th className="text-center py-3 px-4 text-[10px] font-mono text-muted-foreground uppercase">Bioavail.</th>
                  <th className="text-left py-3 px-4 text-[10px] font-mono text-muted-foreground uppercase">Dose</th>
                  <th className="text-center py-3 px-4 text-[10px] font-mono text-muted-foreground uppercase">Timing</th>
                  <th className="text-left py-3 px-4 text-[10px] font-mono text-muted-foreground uppercase">Hallmarks</th>
                </tr>
              </thead>
              <tbody>
                {compounds.map((c) => (
                  <tr key={c.id} className="border-b border-border hover:bg-muted/30 transition">
                    <td className="py-3 px-4 font-semibold">{c.name}</td>
                    <td className="py-3 px-4 text-xs text-accent-cyan/80">{c.pathway}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${evidenceColors[c.evidence]}`}>
                        {c.evidence}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-xs">{c.bioavailability}%</td>
                    <td className="py-3 px-4 text-xs font-mono text-muted-foreground">{c.dose}</td>
                    <td className="py-3 px-4 text-center text-xs">{c.timing}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {c.hallmarks.map((h) => (
                          <span key={h} className="text-[10px] font-mono bg-accent-violet/10 text-accent-violet px-1.5 py-0.5 rounded">
                            {h}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionShell>
  );
}