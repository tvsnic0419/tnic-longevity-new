'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, FlaskConical, Clock, ShieldCheck, Zap, ExternalLink, Lock } from 'lucide-react';
import { getScoredCompounds, LQ_DIMENSIONS, CLOCK_CONFIDENCE_LABELS, type ScoredLQCompound } from '@/lib/elite-8-data';

const TIER_STYLE: Record<string, string> = {
  A: 'text-accent-emerald bg-accent-emerald/10 border-accent-emerald/30',
  B: 'text-accent-amber bg-accent-amber/10 border-accent-amber/30',
  C: 'text-accent-rose bg-accent-rose/10 border-accent-rose/30',
};

const CONFIDENCE_COLOR: Record<string, string> = {
  high:     '#34d399',
  moderate: '#fbbf24',
  low:      '#94a3b8',
  modeled:  '#c084fc',
};

// Clamp LQ score to 0–100 for display
function formatScore(score: number) {
  return Math.max(0, Math.min(100, score)).toFixed(1);
}

function ScoreBar({ value, max = 10, color }: { value: number; max?: number; color: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="h-full rounded-full"
        style={{ background: color }}
      />
    </div>
  );
}

function LQDimBar({ dim, value, color }: { dim: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-0.5">
        <span className="text-[9px] font-mono text-white/40 uppercase">{dim}</span>
        <span className="text-[9px] font-mono" style={{ color }}>{value.toFixed(1)}</span>
      </div>
      <ScoreBar value={value} color={color} />
    </div>
  );
}

function CompoundCard({
  compound,
  rank,
  isActive,
  onClick,
}: {
  compound: ScoredLQCompound;
  rank: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const { color, name, category, evidenceTier, isRx, clock, clockConfidence, mechanism, score, libraryHref } = compound;

  const scoreDisplay = formatScore(score);
  const scoreNum = parseFloat(scoreDisplay);
  const scoreColor = scoreNum >= 78 ? '#34d399' : scoreNum >= 68 ? '#00e0ff' : '#fbbf24';

  return (
    <motion.button
      layout
      onClick={onClick}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.04 }}
      className={`w-full text-left rounded-2xl p-5 border transition-all duration-300 focus-ring group relative overflow-hidden ${
        isActive
          ? 'border-white/20 bg-white/[0.06]'
          : 'border-white/[0.07] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]'
      }`}
    >
      {/* Rank watermark */}
      <span
        className="absolute top-3 right-4 text-[36px] font-black leading-none select-none pointer-events-none"
        style={{ color: `${color}08` }}
        aria-hidden="true"
      >
        {String(rank).padStart(2, '0')}
      </span>

      {/* Header row */}
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center"
          style={{ background: `${color}18`, border: `1px solid ${color}30` }}
        >
          <FlaskConical className="w-4.5 h-4.5" style={{ color }} aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm text-white leading-tight">{name}</span>
            {isRx && (
              <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-accent-rose bg-accent-rose/10 border border-accent-rose/25 px-1.5 py-0.5 rounded">
                <Lock className="w-2.5 h-2.5" />Rx
              </span>
            )}
            {evidenceTier && (
              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${TIER_STYLE[evidenceTier] ?? ''}`}>
                Tier {evidenceTier}
              </span>
            )}
          </div>
          <span className="text-[10px] text-white/40 font-mono leading-none">{category}</span>
        </div>
        {/* LQ Score badge */}
        <div className="shrink-0 text-right">
          <div className="text-lg font-black leading-none tabular-nums" style={{ color: scoreColor }}>
            {scoreDisplay}
          </div>
          <div className="text-[8px] font-mono text-white/30 uppercase">LQ Score</div>
        </div>
      </div>

      {/* Mechanism */}
      <p className="text-[11px] text-white/55 leading-relaxed mb-3 line-clamp-2">{mechanism}</p>

      {/* Score bar */}
      <div className="mb-3">
        <ScoreBar value={scoreNum} max={100} color={scoreColor} />
      </div>

      {/* Clock estimate */}
      <div className="flex items-center gap-2">
        <Clock className="w-3 h-3 shrink-0" style={{ color: CONFIDENCE_COLOR[clockConfidence] }} aria-hidden="true" />
        <span className="text-[10px] text-white/60 font-mono truncate">{clock}</span>
        <span
          className="text-[8px] font-mono shrink-0 px-1.5 py-0.5 rounded"
          style={{ color: CONFIDENCE_COLOR[clockConfidence], background: `${CONFIDENCE_COLOR[clockConfidence]}14` }}
        >
          {CLOCK_CONFIDENCE_LABELS[clockConfidence]}
        </span>
      </div>

      {isActive && libraryHref && (
        <Link
          href={libraryHref}
          onClick={(e) => e.stopPropagation()}
          className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold transition-colors"
          style={{ color }}
        >
          Library deep-dive <ExternalLink className="w-3 h-3" />
        </Link>
      )}
    </motion.button>
  );
}

function DimensionPanel({ compound }: { compound: ScoredLQCompound }) {
  const dims = LQ_DIMENSIONS.filter((d) => !d.penalty);
  const penalty = LQ_DIMENSIONS.find((d) => d.penalty);

  return (
    <motion.div
      key={compound.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35 }}
      className="h-full flex flex-col"
    >
      {/* Compound header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: `${compound.color}20`, border: `1.5px solid ${compound.color}40` }}
          >
            <FlaskConical className="w-5 h-5" style={{ color: compound.color }} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">{compound.name}</h3>
            <p className="text-xs text-white/40 font-mono">{compound.full}</p>
          </div>
        </div>
        <p className="text-sm text-white/60 leading-relaxed">{compound.mechanism}</p>
      </div>

      {/* LQ Dimensions breakdown */}
      <div className="flex-1 space-y-2.5 mb-6">
        <p className="text-[10px] font-mono uppercase text-white/30 tracking-wider mb-3">LQ Score Dimensions</p>
        {dims.map((d) => (
          <LQDimBar
            key={d.key}
            dim={d.label}
            value={compound[d.key] as number}
            color={compound.color}
          />
        ))}
        {penalty && (
          <div className="pt-2 border-t border-white/[0.06]">
            <LQDimBar
              dim={`${penalty.label} (penalty)`}
              value={compound[penalty.key] as number}
              color="#f472b6"
            />
          </div>
        )}
      </div>

      {/* Top study */}
      <div className="rounded-xl p-3.5 border border-white/[0.06] bg-white/[0.03] mb-4">
        <p className="text-[9px] font-mono text-white/30 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <ShieldCheck className="w-3 h-3" />Top Evidence
        </p>
        <p className="text-[11px] text-white/65 leading-relaxed">{compound.topStudy}</p>
      </div>

      {/* Clock & score summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl p-3 border border-white/[0.06] bg-white/[0.03] text-center">
          <div className="text-2xl font-black" style={{ color: compound.color }}>
            {formatScore(compound.score)}
          </div>
          <div className="text-[9px] font-mono text-white/30 uppercase mt-0.5">LQ Score / 100</div>
        </div>
        <div className="rounded-xl p-3 border border-white/[0.06] bg-white/[0.03] text-center">
          <div className="text-xs font-bold text-white/70 leading-tight">{compound.clock}</div>
          <div className="text-[9px] font-mono mt-0.5" style={{ color: CONFIDENCE_COLOR[compound.clockConfidence] }}>
            {CLOCK_CONFIDENCE_LABELS[compound.clockConfidence]}
          </div>
        </div>
      </div>

      {compound.libraryHref && (
        <Link
          href={compound.libraryHref}
          className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all border"
          style={{
            color: compound.color,
            borderColor: `${compound.color}30`,
            background: `${compound.color}0e`,
          }}
        >
          <Zap className="w-4 h-4" />
          Full Compound Deep-Dive
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </motion.div>
  );
}

export function EliteCompoundsShowcase() {
  const scored = getScoredCompounds();
  const [activeId, setActiveId] = useState(scored[0]?.id ?? null);

  const activeCompound = scored.find((c) => c.id === activeId) ?? scored[0];

  return (
    <section
      id="elite-compounds"
      className="relative py-20 sm:py-28 overflow-hidden"
      style={{ background: 'linear-gradient(to bottom, #020811, #060d1a, #020811)' }}
    >
      {/* Background atmosphere */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-1/4 left-1/4 w-[600px] h-[400px] rounded-full blur-[120px] opacity-[0.08]"
          style={{ background: 'radial-gradient(ellipse, #00e0ff, transparent)' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[350px] rounded-full blur-[100px] opacity-[0.06]"
          style={{ background: 'radial-gradient(ellipse, #c084fc, transparent)' }}
        />
      </div>

      <div className="relative container-page">
        {/* Section header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-accent-cyan border border-accent-cyan/20 bg-accent-cyan/[0.06] px-4 py-2 rounded-full mb-5">
            <FlaskConical className="w-3 h-3" />
            Compound Intelligence
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4">
            Elite Compound{' '}
            <span style={{ color: 'var(--accent-cyan)' }} className="gradient-sweep-text">
              Rankings
            </span>
          </h2>
          <p className="text-white/50 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Every compound scored across 8 evidence dimensions: clinical trials, epigenetic biomarkers,
            effect size, evolutionary depth, safety, bioavailability, and population data.
          </p>
        </div>

        {/* Two-column layout: ranked list + detail panel */}
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          {/* Left — ranked compound list */}
          <div className="lg:col-span-5 space-y-3">
            <p className="text-[10px] font-mono uppercase tracking-wider text-white/30 mb-4 flex items-center gap-2">
              <span className="inline-block w-4 h-px bg-accent-cyan/40" />
              Ranked by composite LQ score
              <span className="inline-block flex-1 h-px bg-white/[0.05]" />
            </p>
            {scored.map((compound, i) => (
              <CompoundCard
                key={compound.id}
                compound={compound}
                rank={i + 1}
                isActive={activeId === compound.id}
                onClick={() => setActiveId(compound.id)}
              />
            ))}
          </div>

          {/* Right — detail panel */}
          <div className="lg:col-span-7 sticky top-24">
            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-6 lg:p-8 min-h-[520px]">
              <AnimatePresence mode="wait">
                {activeCompound && <DimensionPanel compound={activeCompound} />}
              </AnimatePresence>
            </div>

            {/* Methodology note */}
            <div className="mt-4 text-center">
              <p className="text-[10px] text-white/25 font-mono leading-relaxed max-w-md mx-auto">
                LQ Score = weighted composite of 8 dimensions. Risk penalty subtracted.
                Scores are educational estimates — not medical advice.
                All data from peer-reviewed literature.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-14">
          <Link
            href="/library"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-semibold text-white border border-accent-cyan/20 bg-accent-cyan/[0.07] hover:bg-accent-cyan/[0.14] transition-all duration-300 focus-ring"
            style={{ boxShadow: '0 0 40px rgba(0,224,255,0.08)' }}
          >
            <FlaskConical className="w-4 h-4 text-accent-cyan" />
            Explore Full Compound Library
            <ArrowRight className="w-4 h-4 text-accent-cyan group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
