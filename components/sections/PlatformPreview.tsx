'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Layers, FlaskConical, Check } from 'lucide-react';

type TabId = 'dashboard' | 'stack' | 'labs';

const tabs = [
  { id: 'dashboard' as TabId, label: 'Dashboard', icon: LayoutDashboard, url: 'tnic.help/dashboard' },
  { id: 'stack' as TabId, label: 'Stack Architect', icon: Layers, url: 'tnic.help/stacks' },
  { id: 'labs' as TabId, label: 'Lab Hub', icon: FlaskConical, url: 'tnic.help/labs' },
];

const hallmarks = [
  { pct: 85, c: '#34d399' }, { pct: 45, c: '#fbbf24' }, { pct: 78, c: '#a78bfa' },
  { pct: 82, c: '#34d399' }, { pct: 70, c: '#22d3ee' }, { pct: 95, c: '#34d399' },
  { pct: 75, c: '#a78bfa' }, { pct: 68, c: '#fbbf24' }, { pct: 55, c: '#fbbf24' },
  { pct: 88, c: '#34d399' }, { pct: 40, c: '#fb7185' }, { pct: 72, c: '#a78bfa' },
];

const stackCompounds = [
  { name: 'NMN', dose: '500 mg', tier: 'A', score: 92, tags: ['NAD+', 'Mito', 'Epi'] },
  { name: 'GlyNAC', dose: '1.2 g', tier: 'A', score: 87, tags: ['GSH', 'Inflam'] },
  { name: 'Sulforaphane', dose: '30 mg', tier: 'A', score: 84, tags: ['NRF2', 'DNA'] },
  { name: 'Ca-AKG', dose: '1 g', tier: 'B', score: 71, tags: ['Epi', 'Stem'] },
  { name: 'Spermidine', dose: '5 mg', tier: 'B', score: 68, tags: ['Autophagy'] },
];

const biomarkers = [
  { name: 'NAD+', value: '42', unit: 'μM', ref: '18–25', trend: 'up', c: '#34d399', status: 'OPTIMAL' },
  { name: 'hs-CRP', value: '1.5', unit: 'mg/L', ref: '<3.0', trend: 'down', c: '#34d399', status: 'OPTIMAL' },
  { name: 'HbA1c', value: '5.1', unit: '%', ref: '<5.7', trend: 'same', c: '#34d399', status: 'OPTIMAL' },
  { name: 'Glutathione', value: '856', unit: 'μmol/L', ref: '500–900', trend: 'up', c: '#22d3ee', status: 'RISING' },
];

// Pre-computed SVG path for NAD+ chart (y = 60 - ((p-15)/30*60), x = i/11 * 280)
const NAD_PATH = 'M 0 54 L 25 46 L 51 42 L 76 34 L 102 30 L 127 22 L 153 18 L 178 14 L 204 10 L 229 8 L 255 6 L 280 6';
const NAD_AREA = NAD_PATH + ' L 280 60 L 0 60 Z';

const DOT_XY: [number, number][] = [[0, 54], [76, 34], [153, 18], [229, 8], [280, 6]];

function DashboardPreview() {
  return (
    <div className="p-4 md:p-6 bg-[#030712] min-h-[480px] font-mono select-none">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-[9px] text-emerald-400/60 uppercase tracking-[0.15em] mb-0.5">MY LONGEVITY OS</p>
          <p className="text-white font-bold text-sm">Protocol Active · Week 12</p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[9px] text-emerald-400 font-bold bg-emerald-400/10 border border-emerald-400/25 rounded-full px-2.5 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          ACTIVE
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-5">
        {([
          ['Bio Age Delta', '-3.2yr', 'text-emerald-400'],
          ['Coverage', '74%', 'text-cyan-400'],
          ['Compounds', '5', 'text-violet-400'],
          ['Protocol Streak', '84d', 'text-amber-400'],
        ] as [string, string, string][]).map(([label, val, col]) => (
          <div key={label} className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-2.5 text-center">
            <p className={`text-base md:text-lg font-bold tabular-nums ${col}`}>{val}</p>
            <p className="text-[8px] text-white/30 uppercase tracking-wider mt-0.5 leading-tight">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-[8px] text-white/30 uppercase tracking-[0.12em] mb-2.5">12 Hallmarks Coverage</p>
          <div className="grid grid-cols-4 gap-1.5">
            {hallmarks.map((h, i) => (
              <div
                key={i}
                className="aspect-square rounded-lg border relative overflow-hidden"
                style={{
                  backgroundColor: `color-mix(in srgb, ${h.c} ${h.pct / 100 * 28}%, #050a14)`,
                  borderColor: `color-mix(in srgb, ${h.c} ${h.pct > 70 ? 40 : 15}%, transparent)`,
                }}
                aria-hidden="true"
              >
                <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ background: h.c, opacity: h.pct / 100 }} />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 mt-2" aria-hidden="true">
            {([['#34d399', '≥75%'], ['#fbbf24', '50–74%'], ['#fb7185', '<50%']] as [string, string][]).map(([c, l]) => (
              <div key={l} className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-sm" style={{ background: c }} />
                <span className="text-[7px] text-white/25">{l}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[8px] text-white/30 uppercase tracking-[0.12em] mb-2.5">Active Stack</p>
          <div className="space-y-1.5">
            {stackCompounds.map((c) => (
              <div key={c.name} className="flex items-center gap-2 bg-white/[0.03] rounded-lg px-2 py-1.5 border border-white/[0.05]">
                <span className={`text-[7px] font-bold px-1.5 py-0.5 rounded shrink-0 ${c.tier === 'A' ? 'bg-emerald-400/20 text-emerald-400' : 'bg-amber-400/20 text-amber-400'}`}>
                  {c.tier}
                </span>
                <span className="text-[10px] text-white/80 font-semibold flex-1 truncate">{c.name}</span>
                <span className="text-[8px] text-white/25 shrink-0">{c.dose}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[8px] text-white/30 uppercase tracking-[0.12em]">NAD+ Trend · 12-Week Protocol</p>
          <span className="text-[8px] text-emerald-400 font-bold">+133% ↑</span>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
          <div className="flex justify-between text-[7px] text-white/20 mb-1">
            <span>18 μM</span>
            <span>Week 1 → Week 12</span>
            <span>42 μM</span>
          </div>
          <svg width="100%" height="56" viewBox="0 0 280 60" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="dv-nad-dash" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[15, 30, 45].map(y => <line key={y} x1="0" y1={y} x2="280" y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />)}
            <path d={NAD_AREA} fill="url(#dv-nad-dash)" />
            <path d={NAD_PATH} fill="none" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            {DOT_XY.map(([x, y]) => <circle key={x} cx={x} cy={y} r="3" fill="#34d399" />)}
          </svg>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="w-3 h-[1.5px] bg-emerald-400 rounded" />
            <span className="text-[7px] text-white/25">Blood NAD+ (μM)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StackPreview() {
  return (
    <div className="p-4 md:p-6 bg-[#030712] min-h-[480px] font-mono select-none">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-[9px] text-violet-400/60 uppercase tracking-[0.15em] mb-0.5">STACK ARCHITECT</p>
          <p className="text-white font-bold text-sm">Longevity Hybrid — v3.1</p>
        </div>
        <div className="text-right">
          <p className="text-[8px] text-white/30 mb-0.5">Synergy Score</p>
          <p className="text-2xl font-bold text-violet-400 tabular-nums">8.4<span className="text-sm text-white/25 font-normal">/10</span></p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-5">
        {([
          ['Tier A', '3', 'text-emerald-400', 'bg-emerald-400/10 border-emerald-400/20'],
          ['Tier B', '2', 'text-amber-400', 'bg-amber-400/10 border-amber-400/20'],
          ['Hallmarks', '8', 'text-cyan-400', 'bg-cyan-400/10 border-cyan-400/20'],
        ] as [string, string, string, string][]).map(([label, val, col, bg]) => (
          <div key={label} className={`border rounded-xl p-3 text-center ${bg}`}>
            <p className={`text-xl font-bold tabular-nums ${col}`}>{val}</p>
            <p className="text-[8px] text-white/35 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <p className="text-[8px] text-white/30 uppercase tracking-[0.12em] mb-2.5">Compound Evidence Matrix</p>
        <div className="space-y-2">
          {stackCompounds.map((c) => (
            <div key={c.name} className="bg-white/[0.04] rounded-xl p-3 border border-white/[0.06]">
              <div className="flex items-start gap-3">
                <span className={`text-[8px] font-bold px-1.5 py-1 rounded mt-0.5 shrink-0 ${c.tier === 'A' ? 'bg-emerald-400/20 text-emerald-400' : 'bg-amber-400/20 text-amber-400'}`}>
                  {c.tier}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] text-white font-semibold">{c.name}</span>
                    <span className="text-[8px] text-white/30 font-mono">{c.dose}</span>
                  </div>
                  <div className="h-[3px] rounded-full bg-white/[0.07] mb-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${c.score}%`, background: c.tier === 'A' ? '#34d399' : '#fbbf24' }}
                    />
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {c.tags.map((tag) => (
                      <span key={tag} className="text-[7px] font-mono text-violet-400/70 bg-violet-400/10 px-1.5 py-0.5 rounded border border-violet-400/15">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-[9px] font-bold text-white/40 shrink-0 tabular-nums">{c.score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-emerald-400/5 border border-emerald-400/20 rounded-xl p-3 flex items-center gap-3">
        <div className="w-6 h-6 rounded-full bg-emerald-400/15 flex items-center justify-center shrink-0">
          <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
        </div>
        <div>
          <p className="text-[9px] text-emerald-400 font-bold">Pathway Check Passed</p>
          <p className="text-[8px] text-white/35 mt-0.5">No contraindications · NR/NMN co-use flagged as redundant — removed automatically</p>
        </div>
      </div>
    </div>
  );
}

function LabsPreview() {
  return (
    <div className="p-4 md:p-6 bg-[#030712] min-h-[480px] font-mono select-none">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-[9px] text-cyan-400/60 uppercase tracking-[0.15em] mb-0.5">LAB HUB</p>
          <p className="text-white font-bold text-sm">Biomarker Dashboard</p>
        </div>
        <div className="text-right">
          <p className="text-[8px] text-white/30 mb-0.5">Last updated</p>
          <p className="text-[10px] text-cyan-400 font-bold">Jun 2026</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-5">
        {biomarkers.map((b) => (
          <div key={b.name} className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-3">
            <div className="flex items-start justify-between mb-2">
              <p className="text-[9px] text-white/45 uppercase tracking-wider">{b.name}</p>
              <span className="text-[7px] font-bold px-1.5 py-0.5 rounded" style={{ color: b.c, backgroundColor: `${b.c}22` }}>
                {b.status}
              </span>
            </div>
            <p className="text-xl font-bold text-white tabular-nums">
              {b.value}<span className="text-[9px] text-white/25 ml-0.5">{b.unit}</span>
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[10px]" style={{ color: b.trend === 'up' ? '#34d399' : b.trend === 'down' ? '#fb7185' : '#6b7280' }}>
                {b.trend === 'up' ? '↑' : b.trend === 'down' ? '↓' : '→'}
              </span>
              <span className="text-[7px] text-white/20">Ref {b.ref}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[8px] text-white/30 uppercase tracking-[0.12em]">NAD+ · 12-Week Protocol Trend</p>
          <span className="text-[8px] text-cyan-400 font-bold">Retest in 6 weeks</span>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
          <svg width="100%" height="56" viewBox="0 0 280 60" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="dv-nad-labs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[15, 30, 45].map(y => <line key={y} x1="0" y1={y} x2="280" y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />)}
            <path d={NAD_AREA} fill="url(#dv-nad-labs)" />
            <path d={NAD_PATH} fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            {DOT_XY.map(([x, y]) => <circle key={x} cx={x} cy={y} r="3" fill="#22d3ee" />)}
          </svg>
          <div className="flex items-center gap-3 mt-1.5">
            <div className="flex items-center gap-1">
              <div className="w-3 h-[1.5px] bg-cyan-400 rounded" />
              <span className="text-[7px] text-white/25">Blood NAD+ (μM)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[7px] text-white/15">18μM → 42μM</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-cyan-400/5 border border-cyan-400/20 rounded-xl p-3 flex items-center gap-3">
        <div className="w-6 h-6 rounded-full bg-cyan-400/15 flex items-center justify-center shrink-0">
          <Check className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
        </div>
        <div>
          <p className="text-[9px] text-cyan-400 font-bold">Local-first · Zero cloud</p>
          <p className="text-[8px] text-white/35 mt-0.5">All biomarker data lives in your browser only. No accounts. CSV export anytime.</p>
        </div>
      </div>
    </div>
  );
}

export function PlatformPreview() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const activeUrl = tabs.find(t => t.id === activeTab)?.url ?? 'tnic.help';

  return (
    <section className="py-20 md:py-28 section-deep border-b border-border relative overflow-hidden">
      <div className="aurora-beams" aria-hidden="true" />
      <div className="bracket-corner bracket-corner-tl" aria-hidden="true" />
      <div className="bracket-corner bracket-corner-br" aria-hidden="true" />

      <div className="container-page">
        <div className="text-center mb-12 section-spotlight">
          <span className="section-badge-cyan inline-flex items-center gap-2 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse-glow" aria-hidden="true" />
            Live Platform Preview
          </span>
          <h2 className="headline-editorial mt-4 mb-3">
            See the OS you&apos;re building.<br />
            <span className="shimmer-text">Three modules. Zero accounts.</span>
          </h2>
          <p className="text-body max-w-xl mx-auto">
            Every module runs locally in your browser. Your data never leaves your device.
            Below is exactly what you get when you take the quiz.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-1 p-1 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-foreground text-background'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                  }`}
                  aria-pressed={isActive}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Browser frame */}
        <div className="max-w-4xl mx-auto card-floating overflow-hidden">
          {/* Browser chrome */}
          <div className="bg-[#0f1120] border-b border-white/[0.07] px-4 py-3 flex items-center gap-3">
            <div className="flex gap-1.5" aria-hidden="true">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
            </div>
            <div className="flex-1 bg-white/[0.05] rounded-lg px-3 py-1.5 text-xs font-mono text-white/30 flex items-center gap-2 max-w-sm mx-auto">
              <span className="w-2 h-2 rounded-full bg-green-400/50 shrink-0" aria-hidden="true" />
              {activeUrl}
            </div>
            <div className="hidden sm:flex gap-1.5" aria-hidden="true">
              <div className="w-6 h-5 rounded bg-white/[0.04] border border-white/[0.06]" />
              <div className="w-6 h-5 rounded bg-white/[0.04] border border-white/[0.06]" />
            </div>
          </div>

          {/* Module content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              {activeTab === 'dashboard' && <DashboardPreview />}
              {activeTab === 'stack' && <StackPreview />}
              {activeTab === 'labs' && <LabsPreview />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-10 flex flex-col items-center gap-5">
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            Your personalized version opens the moment you take the quiz.
            Stack pre-loaded, hallmarks mapped, biomarker templates ready.
          </p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <Link href="/#starter-quiz" className="btn-gradient text-sm">
              Build Your Protocol
            </Link>
            <Link href="/dashboard" className="btn-ghost-premium text-sm">
              Open Dashboard
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
