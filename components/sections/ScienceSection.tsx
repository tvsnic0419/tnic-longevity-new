'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionShell } from '@/components/SectionShell';
import { hallmarks } from '@/lib/data';

function RadarChart({ coverage }: { coverage: number[] }) {
  const cx = 120;
  const cy = 120;
  const maxR = 90;
  const angles = coverage.map((_, i) => (i * 2 * Math.PI) / coverage.length - Math.PI / 2);

  const points = coverage
    .map((val, i) => {
      const r = (val / 100) * maxR;
      return `${cx + r * Math.cos(angles[i])},${cy + r * Math.sin(angles[i])}`;
    })
    .join(' ');

  const gridLevels = [25, 50, 75, 100];

  return (
    <svg viewBox="0 0 240 240" className="w-full max-w-[280px] mx-auto">
      {gridLevels.map((level) => {
        const r = (level / 100) * maxR;
        const gridPoints = angles
          .map((a) => `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`)
          .join(' ');
        return (
          <polygon
            key={level}
            points={gridPoints}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="0.5"
          />
        );
      })}
      {angles.map((a, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={cx + maxR * Math.cos(a)}
          y2={cy + maxR * Math.sin(a)}
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="0.5"
        />
      ))}
      <motion.polygon
        points={points}
        fill="rgba(34, 211, 238, 0.15)"
        stroke="#22d3ee"
        strokeWidth="1.5"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fill="#22d3ee" fontSize="14" fontWeight="bold">
        {Math.round(coverage.reduce((a, b) => a + b, 0) / coverage.length)}%
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="#71717a" fontSize="6">
        COVERAGE
      </text>
    </svg>
  );
}

export function ScienceSection() {
  const [selected, setSelected] = useState(hallmarks[0].id);
  const active = hallmarks.find((h) => h.id === selected)!;
  const avgCoverage = Math.round(hallmarks.reduce((s, h) => s + h.coverage, 0) / hallmarks.length);

  return (
    <SectionShell
      id="science"
      mod="MOD-SCI-02"
      theme="emerald"
      badge="Hallmarks Command"
      title="12 Hallmarks of Aging"
      subtitle="Quick radar overview. For full explanations, evidence-ranked interventions, and personal notes — visit the Anti-Aging Library."
      className="bg-[#0a0f1a]/60"
    >
      <div className="mb-8 text-center">
        <Link
          href="/library"
          className="inline-flex items-center gap-2 bg-accent-emerald text-black px-6 py-3 rounded-xl text-sm font-semibold hover:bg-accent-cyan transition"
        >
          Open Full Anti-Aging Library →
        </Link>
      </div>
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 glass rounded-3xl p-8 flex flex-col items-center justify-center">
          <RadarChart coverage={hallmarks.map((h) => h.coverage)} />
          <p className="text-center mt-4">
            <span className="text-3xl font-bold text-accent-emerald">{avgCoverage}%</span>
            <span className="block text-xs text-muted-foreground mt-1">Average Hallmark Coverage</span>
          </p>
        </div>

        <div className="lg:col-span-8">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 mb-8">
            {hallmarks.map((h) => (
              <button
                key={h.id}
                onClick={() => setSelected(h.id)}
                className={`text-left p-4 rounded-xl transition-all duration-300 ${
                  selected === h.id
                    ? 'bg-accent-emerald/10 border border-accent-emerald/30'
                    : 'glass glass-hover'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <h.icon className={`w-4 h-4 ${selected === h.id ? 'text-accent-emerald' : 'text-muted-foreground'}`} />
                  <span className="text-xs font-mono text-muted-foreground">{h.coverage}%</span>
                </div>
                <h4 className="font-semibold text-sm">{h.title}</h4>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="gradient-border p-8"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent-emerald/10 flex items-center justify-center shrink-0">
                  <active.icon className="w-6 h-6 text-accent-emerald" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold">{active.title}</h3>
                    <div className="h-1.5 flex-1 max-w-[120px] bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent-emerald rounded-full"
                        style={{ width: `${active.coverage}%` }}
                      />
                    </div>
                    <span className="font-mono text-accent-emerald text-sm">{active.coverage}%</span>
                  </div>
                  <p className="text-muted-foreground mb-6">{active.desc}</p>
                  <div className="glass rounded-xl p-4">
                    <p className="text-[10px] font-mono text-accent-emerald uppercase tracking-wider mb-2">
                      TNiC Intervention Protocol
                    </p>
                    <p className="text-sm text-foreground/80 font-mono">{active.intervention}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </SectionShell>
  );
}
