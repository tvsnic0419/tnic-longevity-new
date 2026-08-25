'use client';
/* eslint-disable react-hooks/set-state-in-effect --
   The mount/URL-driven effect(s) below set state from client-only sources
   (localStorage, window, or URL search params) or trigger entrance animations.
   These cannot run during SSR, so the initial setState is intentional and not a
   value derivable during render. Reviewed 2026-06-21; safe to keep. */

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ShieldAlert, Trophy } from 'lucide-react';
import { LongevityGaugeArc } from '@/components/ui/LongevityGaugeArc';
import {
  CLOCK_CONFIDENCE_LABELS,
  LQ_DIMENSIONS,
  LQ_WEIGHTS,
  type LQDimensionKey,
  type ScoredLQCompound,
  getScoredCompounds,
} from '@/lib/elite-8-data';

function AnimCounter({ target, duration = 1400, decimals = 1 }: { target: number; duration?: number; decimals?: number }) {
  const [val, setVal] = useState(target);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let start: number | null = null;
    setVal(0);
    const step = (ts: number) => {
      if (!start) start = ts;
      const pct = Math.min((ts - start) / duration, 1);
      setVal(+(target * pct).toFixed(decimals));
      if (pct < 1) requestAnimationFrame(step);
    };
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, decimals]);

  if (!mounted) return <span>{target.toFixed(decimals)}</span>;
  return <span>{val.toFixed(decimals)}</span>;
}

function ScoreBar({ value, max = 100, color }: { value: number; max?: number; color: string }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth((value / max) * 100), 60);
    return () => clearTimeout(t);
  }, [value, max]);
  return (
    <div className="h-1.5 w-full bg-muted/40 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${width}%`, background: color }} />
    </div>
  );
}

function RadarMini({ product, size = 168 }: { product: ScoredLQCompound; size?: number }) {
  const dims = ['CE', 'EB', 'ES', 'EE', 'SF', 'BV'] as const;
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.36;
  const pts = dims.map((k, i) => {
    const angle = (i / dims.length) * 2 * Math.PI - Math.PI / 2;
    const val = product[k] / 10;
    return { x: cx + r * val * Math.cos(angle), y: cy + r * val * Math.sin(angle) };
  });
  const gridPts = dims.map((_, i) => {
    const angle = (i / dims.length) * 2 * Math.PI - Math.PI / 2;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });
  const polyPath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ') + 'Z';
  const gradId = `radar-${product.id}`;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-sm" aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={product.color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={product.color} stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <polygon points={gridPts.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ')} fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" />
      {[0.25, 0.5, 0.75].map((f, idx) => (
        <polygon
          key={idx}
          points={dims
            .map((_, i) => {
              const angle = (i / dims.length) * 2 * Math.PI - Math.PI / 2;
              return `${(cx + r * f * Math.cos(angle)).toFixed(2)},${(cy + r * f * Math.sin(angle)).toFixed(2)}`;
            })
            .join(' ')}
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.1"
          strokeWidth="0.75"
        />
      ))}
      {gridPts.map((p, i) => (
        <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.75" />
      ))}
      <path d={polyPath} fill={`url(#${gradId})`} stroke={product.color} strokeWidth="2" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill={product.color} stroke="currentColor" strokeWidth="1" />
      ))}
    </svg>
  );
}

function ClockConfidenceBadge({ confidence }: { confidence: ScoredLQCompound['clockConfidence'] }) {
  const styles: Record<ScoredLQCompound['clockConfidence'], string> = {
    high: 'bg-accent-emerald/15 text-accent-emerald border-accent-emerald/25',
    moderate: 'bg-accent-cyan/15 text-accent-cyan border-accent-cyan/25',
    low: 'bg-accent-amber/15 text-accent-amber border-accent-amber/25',
    modeled: 'bg-muted/30 text-muted-foreground border-border/60',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-micro font-semibold uppercase tracking-wider border ${styles[confidence]}`}>
      {CLOCK_CONFIDENCE_LABELS[confidence]}
    </span>
  );
}

function RxDisclaimer() {
  return (
    <div className="rounded-xl border border-accent-amber/25 bg-accent-amber/5 px-4 py-3 mt-4 flex gap-2 text-xs text-accent-amber">
      <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden="true" />
      <span>
        <strong>Prescription drug.</strong> Requires physician supervision. Included for educational completeness only — TNiC does not recommend off-label use.
      </span>
    </div>
  );
}

function CompoundCard({
  product,
  rank,
  expanded,
  onToggle,
}: {
  product: ScoredLQCompound;
  rank: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`glass-deep glass-plane-mid w-full text-left rounded-2xl border transition-all duration-300 overflow-hidden focus-ring ${
        expanded ? 'border-accent-emerald/40 glow-hover-emerald' : 'border-border/60 glow-hover-emerald'
      }`}
    >
      <div className="p-6 md:p-8">
        <div className="flex items-start gap-4 md:gap-6">
          <div className="font-mono text-3xl md:text-4xl font-black leading-none" style={{ color: product.color }}>
            {String(rank).padStart(2, '0')}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="font-semibold text-xl md:text-2xl">{product.name}</span>
              <span
                className="inline-flex px-2.5 py-0.5 rounded-full text-micro font-semibold tracking-wider uppercase border"
                style={{ borderColor: `${product.color}44`, color: product.color, background: `${product.color}18` }}
              >
                {product.category}
              </span>
              {product.evidenceTier && (
                <span className="text-micro font-mono text-accent-emerald bg-accent-emerald/10 px-2 py-0.5 rounded-lg border border-accent-emerald/20">
                  Tier {product.evidenceTier}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">{product.full}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="font-mono text-2xl md:text-3xl font-black" style={{ color: product.color }}>
              <AnimCounter target={product.score} />
            </div>
            <p className="text-micro tracking-widest text-muted-foreground mt-0.5">LQ SCORE</p>
          </div>
        </div>
        <div className="mt-4">
          <ScoreBar value={product.score} color={product.color} />
        </div>
      </div>

      {expanded && (
        <div className="px-6 md:px-8 pb-8 pt-2 border-t border-border/50">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="shrink-0 flex flex-col items-center text-muted-foreground">
              <RadarMini product={product} />
              <p className="mt-2 text-micro tracking-widest">CE · EB · ES · EE · SF · BV</p>
            </div>
            <div className="flex-1 space-y-3">
              <p className="text-label text-accent-emerald">Dimension scores</p>
              {LQ_DIMENSIONS.map((d) => (
                <div key={d.key}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">
                      {d.label} <span className="opacity-60">×{d.w.toFixed(2)}</span>
                      {d.penalty && <span className="text-accent-rose/80 ml-1">(penalty)</span>}
                    </span>
                    <span className="font-mono font-semibold" style={{ color: d.penalty ? '#fb7185' : product.color }}>
                      {product[d.key].toFixed(1)}
                    </span>
                  </div>
                  <ScoreBar value={product[d.key]} max={10} color={d.penalty ? '#fb7185' : product.color} />
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="glass-deep glass-plane-mid rounded-xl p-5 text-sm leading-relaxed">
              <p className="text-label text-accent-cyan mb-2">Mechanism of action</p>
              {product.mechanism}
            </div>
            <div className="glass-deep glass-plane-mid rounded-xl p-5 text-sm leading-relaxed">
              <p className="text-label text-accent-cyan mb-2">Key human study</p>
              {product.topStudy}
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-accent-emerald">Clock impact: {product.clock}</span>
                <ClockConfidenceBadge confidence={product.clockConfidence} />
              </div>
            </div>
          </div>

          {product.isRx && <RxDisclaimer />}

          <div className="mt-4 flex flex-wrap items-center gap-4">
            {product.libraryHref && (
              <Link
                href={product.libraryHref}
                onClick={(e) => e.stopPropagation()}
                className="text-xs font-semibold text-accent-violet hover:underline"
              >
                Read evidence module →
              </Link>
            )}
            {!product.isRx && (
              <Link
                href={`/stacks`}
                onClick={(e) => e.stopPropagation()}
                className="text-xs font-semibold text-accent-amber hover:underline"
              >
                Build a stack with {product.name} →
              </Link>
            )}
            {product.evidenceTier === 'A' && !product.isRx && (
              <Link
                href={`/library/compare`}
                onClick={(e) => e.stopPropagation()}
                className="text-xs font-semibold text-accent-cyan hover:underline"
              >
                Head-to-head comparisons →
              </Link>
            )}
          </div>
        </div>
      )}
    </button>
  );
}

function EquationBlock() {
  return (
    <div className="glass-deep glass-plane-mid border border-accent-emerald/25 rounded-2xl p-6 md:p-8">
      <p className="text-label text-accent-emerald mb-3">The Longevity Quotient equation</p>
      <p className="font-mono text-sm md:text-base leading-relaxed text-foreground/90">
        <span className="font-bold text-accent-amber">LQ(p)</span> = 0.22·CE + 0.18·EB + 0.16·ES + 0.14·EE + 0.12·SF + 0.10·BV + 0.05·HP − 0.03·R
      </p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-muted-foreground">
        {LQ_DIMENSIONS.map((d) => (
          <div key={d.key}>
            <span className="font-semibold text-foreground">{d.key}</span>{' '}
            <span className="opacity-60">({(d.w * 100).toFixed(0)}%)</span> — {d.desc}
            {d.penalty && <span className="text-accent-rose/70"> [subtracted]</span>}
          </div>
        ))}
      </div>
      <p className="mt-6 pt-4 border-t border-border/50 text-caption leading-relaxed">
        Dimension scores (0–10) are editorially synthesized from peer-reviewed literature. Weights reflect TNiC&apos;s evidence hierarchy — not a peer-reviewed meta-score. LQ rankings are modeled synthesis, not clinical recommendations. See{' '}
        <Link href="/trust/methodology" className="text-accent-cyan underline underline-offset-2">
          evidence tier grading
        </Link>{' '}
        for study-level analysis.
      </p>
    </div>
  );
}

function CompareTool({ scored }: { scored: ScoredLQCompound[] }) {
  const [aId, setAId] = useState(scored[0]?.id ?? '');
  const [bId, setBId] = useState(scored[1]?.id ?? scored[0]?.id ?? '');

  const pickAlternate = (currentId: string, otherId: string) =>
    scored.find((p) => p.id !== currentId && p.id !== otherId)?.id ??
    scored.find((p) => p.id !== currentId)?.id ??
    currentId;

  const handleAChange = (id: string) => {
    setAId(id);
    if (id === bId) setBId(pickAlternate(id, id));
  };

  const handleBChange = (id: string) => {
    if (id === aId) setBId(pickAlternate(id, aId));
    else setBId(id);
  };

  const pA = scored.find((p) => p.id === aId) ?? scored[0];
  const pB = scored.find((p) => p.id === bId) ?? scored[1] ?? scored[0];
  if (!pA || !pB) return null;

  return (
    <div className="glass-deep glass-plane-mid border border-border/60 rounded-2xl p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <p className="text-label">Head-to-head comparison</p>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <select
            value={aId}
            onChange={(e) => handleAChange(e.target.value)}
            className="glass rounded-xl px-3 py-2 text-sm font-medium focus-ring"
            aria-label="Compare compound A"
          >
            {scored.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <span className="text-muted-foreground">vs</span>
          <select
            value={bId}
            onChange={(e) => handleBChange(e.target.value)}
            className="glass rounded-xl px-3 py-2 text-sm font-medium focus-ring"
            aria-label="Compare compound B"
          >
            {scored.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {LQ_DIMENSIONS.map((d) => {
        const va = pA[d.key];
        const vb = pB[d.key];
        const winner = d.penalty ? (va < vb ? 'A' : 'B') : va > vb ? 'A' : 'B';
        return (
          <div key={d.key} className="mb-4">
            <div className="flex justify-between text-xs mb-1.5 text-muted-foreground">
              <span className={winner === 'A' ? 'font-semibold text-foreground' : ''} style={{ color: winner === 'A' ? pA.color : undefined }}>
                {va.toFixed(1)}
              </span>
              <span className="font-medium tracking-wider">{d.label}</span>
              <span className={winner === 'B' ? 'font-semibold text-foreground' : ''} style={{ color: winner === 'B' ? pB.color : undefined }}>
                {vb.toFixed(1)}
              </span>
            </div>
            <div className="flex h-2 gap-1">
              <div className="rounded-l-full transition-all" style={{ flex: va, background: pA.color, opacity: winner === 'A' ? 1 : 0.35 }} />
              <div className="rounded-r-full transition-all" style={{ flex: vb, background: pB.color, opacity: winner === 'B' ? 1 : 0.35 }} />
            </div>
          </div>
        );
      })}
      <div className="mt-8 pt-6 border-t border-border/50 flex items-end justify-between text-center gap-4">
        <div>
          <div className="font-mono text-3xl font-black" style={{ color: pA.color }}>
            {pA.score.toFixed(1)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{pA.name} LQ</p>
        </div>
        <p className="text-sm text-muted-foreground pb-2 flex-1">
          {pA.score > pB.score ? (
            <>
              <span className="font-semibold" style={{ color: pA.color }}>
                {pA.name}
              </span>{' '}
              leads by {(pA.score - pB.score).toFixed(1)}
            </>
          ) : (
            <>
              <span className="font-semibold" style={{ color: pB.color }}>
                {pB.name}
              </span>{' '}
              leads by {(pB.score - pA.score).toFixed(1)}
            </>
          )}
        </p>
        <div>
          <div className="font-mono text-3xl font-black" style={{ color: pB.color }}>
            {pB.score.toFixed(1)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{pB.name} LQ</p>
        </div>
      </div>
    </div>
  );
}

function WeightTuner() {
  const [weights, setWeights] = useState({ ...LQ_WEIGHTS });
  const ranking = useMemo(() => getScoredCompounds(weights), [weights]);

  const setW = (k: LQDimensionKey, v: number) => {
    setWeights((prev) => ({ ...prev, [k]: v }));
  };

  return (
    <div className="glass-deep glass-plane-mid border border-border/60 rounded-2xl p-6 md:p-8">
      <p className="text-label mb-1">Weight tuner — customize priorities</p>
      <p className="text-sm text-muted-foreground mb-6">
        Drag sliders to re-weight the Longevity Quotient. Custom weights are for exploration only — default weights reflect TNiC editorial consensus.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {LQ_DIMENSIONS.map((d) => (
          <div key={d.key}>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">
                {d.key} {d.penalty && <span className="text-accent-rose/70 text-xs">(penalty)</span>}
              </span>
              <span className="font-mono font-semibold tabular-nums">{(weights[d.key] * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={0.4}
              step={0.005}
              value={weights[d.key]}
              onChange={(e) => setW(d.key, parseFloat(e.target.value))}
              className="w-full accent-accent-emerald"
              aria-label={`Weight for ${d.label}`}
            />
            <p className="text-caption mt-1">{d.desc}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 pt-6 border-t border-border/50">
        <p className="text-label mb-4">Your custom ranking</p>
        {ranking.map((p, i) => (
          <div key={p.id} className="flex items-center gap-3 py-2.5 border-b border-border/40 last:border-none text-sm">
            <div className="w-6 font-mono text-lg font-black" style={{ color: p.color }}>
              {i + 1}
            </div>
            <div className="flex-1 font-medium">{p.name}</div>
            <div className="w-32 hidden sm:block">
              <ScoreBar value={p.score} color={p.color} />
            </div>
            <div className="w-12 text-right font-mono font-semibold tabular-nums" style={{ color: p.color }}>
              {p.score.toFixed(1)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type TabKey = 'ranking' | 'compare' | 'tune';

export function Elite8Hub() {
  const scored = useMemo(() => getScoredCompounds(), []);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [tab, setTab] = useState<TabKey>('ranking');
  const top3 = scored.slice(0, 3);

  return (
    <div className="pb-20">
      <section className="relative hero-mesh section-glow-emerald border-b border-border py-16 md:py-20 overflow-hidden">
        <div className="container-page relative text-center">
          <p className="text-label text-accent-emerald mb-4">EVIDENCE-BASED · MODELED RANKING</p>
          <h1 className="text-display mb-4">
            The Elite <span className="shimmer-text">8</span>
          </h1>
          <p className="text-body text-lg max-w-2xl mx-auto text-muted-foreground">
            Eight premier longevity interventions ranked by the{' '}
            <strong className="text-foreground">Longevity Quotient</strong> — a calibrated synthesis of clinical rigor, epigenetic signals, evolutionary conservation, and safety.
          </p>
          <p className="mt-6 inline-flex items-center gap-2 text-caption font-mono bg-card/50 border border-border/60 px-4 py-2 rounded-full">
            For research & educational use only · Not medical advice
          </p>
        </div>
      </section>

      <div className="container-page -mt-6 relative z-10">
        <div className="glass-deep glass-plane-mid border border-border/60 rounded-2xl p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-label text-accent-amber flex items-center gap-2">
                <Trophy className="w-4 h-4" /> Leaderboard snapshot
              </p>
              <p className="text-sm text-muted-foreground">Default Longevity Quotient weights</p>
            </div>
            <button
              type="button"
              onClick={() => setTab('ranking')}
              className="focus-ring text-xs px-4 py-2 rounded-full border border-border glass glass-hover font-semibold"
            >
              View full ranking
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {top3.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setTab('ranking');
                  setExpanded(p.id);
                }}
                className="focus-ring glass-deep glass-plane-mid border border-border/50 rounded-xl p-5 text-center hover:border-accent-emerald/40 transition group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className="font-mono text-xs font-black tracking-widest opacity-50"
                    style={{ color: p.color }}
                  >
                    #{i + 1}
                  </span>
                  <span
                    className="inline-flex px-2 py-0.5 rounded-full text-micro font-semibold tracking-wider uppercase border"
                    style={{ borderColor: `${p.color}44`, color: p.color, background: `${p.color}18` }}
                  >
                    {p.category}
                  </span>
                </div>
                <div className="mx-auto w-28">
                  <LongevityGaugeArc
                    score={p.score}
                    color={p.color}
                    label="LQ SCORE"
                    size={112}
                    immediate
                  />
                </div>
                <p className="mt-2 font-semibold text-base leading-snug group-hover:text-foreground transition">{p.name}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <EquationBlock />
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex glass rounded-2xl p-1 border border-border/60" role="tablist" aria-label="Elite 8 views">
            {(
              [
                { k: 'ranking', l: 'Full Ranking' },
                { k: 'compare', l: 'Head-to-Head' },
                { k: 'tune', l: 'Customize Weights' },
              ] as const
            ).map((t) => (
              <button
                key={t.k}
                type="button"
                role="tab"
                aria-selected={tab === t.k}
                onClick={() => setTab(t.k)}
                className={`px-5 md:px-8 py-2.5 rounded-xl text-sm font-semibold transition ${
                  tab === t.k ? 'bg-accent-emerald/20 text-accent-emerald border border-accent-emerald/30' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t.l}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          {tab === 'ranking' && (
            <div className="space-y-4" role="tabpanel">
              {scored.map((p, i) => (
                <CompoundCard
                  key={p.id}
                  product={p}
                  rank={i + 1}
                  expanded={expanded === p.id}
                  onToggle={() => setExpanded(expanded === p.id ? null : p.id)}
                />
              ))}
            </div>
          )}
          {tab === 'compare' && <CompareTool scored={scored} />}
          {tab === 'tune' && <WeightTuner />}
        </div>

        <p className="text-center text-caption mt-16 max-w-2xl mx-auto leading-relaxed">
          Scores synthesized from peer-reviewed literature. This tool is for educational and research purposes only. Rx compounds require physician oversight. Part of the{' '}
          <Link href="/trust" className="text-accent-cyan underline underline-offset-2">
            TNiC Trust Center
          </Link>
          .
        </p>
      </div>
    </div>
  );
}