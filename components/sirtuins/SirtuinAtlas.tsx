'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  ArrowUpDown,
  Atom,
  Beaker,
  BookOpenCheck,
  CheckCircle2,
  ChevronDown,
  CircleDot,
  Dna,
  ExternalLink,
  FlaskConical,
  Gauge,
  GitCompareArrows,
  Info,
  Layers3,
  Microscope,
  Network,
  Orbit,
  Radar,
  ScanLine,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  TriangleAlert,
  X,
  Zap,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import {
  CORE_SOURCES,
  EVIDENCE_STAGE_META,
  MODE_LABELS,
  SIRTUIN_CANDIDATES,
  SIRTUINS,
  type Availability,
  type EvidenceStage,
  type SirtuinCandidate,
  type SirtuinId,
  type TargetMode,
} from '@/lib/sirtuin-atlas-data';

const modeStyles: Record<TargetMode, string> = {
  direct: 'border-accent-emerald/35 bg-accent-emerald/10 text-accent-emerald',
  nad: 'border-accent-cyan/35 bg-accent-cyan/10 text-accent-cyan',
  expression: 'border-accent-violet/35 bg-accent-violet/10 text-accent-violet',
  uncertain: 'border-accent-amber/35 bg-accent-amber/10 text-accent-amber',
};

const stageStyles: Record<EvidenceStage, string> = {
  'human-target': 'border-accent-emerald/35 bg-accent-emerald/10 text-accent-emerald',
  'human-pathway': 'border-accent-violet/35 bg-accent-violet/10 text-accent-violet',
  'human-nad': 'border-accent-cyan/35 bg-accent-cyan/10 text-accent-cyan',
  'preclinical-direct': 'border-blue-400/30 bg-blue-400/10 text-blue-300',
  'preclinical-indirect': 'border-zinc-400/25 bg-zinc-400/8 text-zinc-300',
};

const availabilityStyles: Record<Availability, string> = {
  consumer: 'border-accent-cyan/25 bg-accent-cyan/8 text-accent-cyan',
  rx: 'border-accent-amber/25 bg-accent-amber/8 text-accent-amber',
  research: 'border-accent-rose/25 bg-accent-rose/8 text-accent-rose',
};

const confidenceDot: Record<'high' | 'moderate' | 'low', string> = {
  high: 'bg-accent-emerald',
  moderate: 'bg-accent-cyan',
  low: 'bg-accent-amber',
};

function uniqueTargetCount(candidate: SirtuinCandidate) {
  return new Set(candidate.targets.map((target) => target.sirtuin)).size;
}

function strongestMode(candidate: SirtuinCandidate): TargetMode {
  const order: TargetMode[] = ['direct', 'nad', 'expression', 'uncertain'];
  return order.find((mode) => candidate.targets.some((target) => target.mode === mode)) ?? 'uncertain';
}

function EvidenceBar({ value, label = 'Target evidence' }: { value: number; label?: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-micro font-medium uppercase tracking-[0.18em] text-muted-foreground">
        <span>{label}</span>
        <span className="font-mono text-foreground/80">{value}/100</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/50" aria-label={`${label} ${value} out of 100`}>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="h-full rounded-full bg-gradient-to-r from-accent-violet via-accent-cyan to-accent-emerald shadow-[0_0_16px_rgba(34,211,238,0.28)]"
        />
      </div>
    </div>
  );
}

function EvidenceRing({ value, size = 74 }: { value: number; size?: number }) {
  const radius = 27;
  const circumference = 2 * Math.PI * radius;
  const dash = (value / 100) * circumference;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} aria-label={`Evidence confidence ${value} out of 100`}>
      <svg viewBox="0 0 72 72" className="h-full w-full -rotate-90" aria-hidden="true">
        <defs>
          <linearGradient id={`evidence-ring-${value}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#a78bfa" />
            <stop offset="0.5" stopColor="#22d3ee" />
            <stop offset="1" stopColor="#34d399" />
          </linearGradient>
        </defs>
        <circle cx="36" cy="36" r={radius} fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="5" />
        <motion.circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          stroke={`url(#evidence-ring-${value})`}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
          initial={{ strokeDasharray: `0 ${circumference}` }}
          whileInView={{ strokeDasharray: `${dash} ${circumference - dash}` }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <span className="font-mono text-lg font-black leading-none">{value}</span>
      </div>
    </div>
  );
}

function ModeBadge({ mode, compact = false }: { mode: TargetMode; compact?: boolean }) {
  const item = MODE_LABELS[mode];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-semibold uppercase tracking-wider ${compact ? 'px-1.5 py-0.5 text-micro' : 'px-2 py-1 text-micro'} ${modeStyles[mode]}`}>
      <span className="font-mono">{item.short}</span>
      {!compact && item.label}
    </span>
  );
}

function StageBadge({ stage, compact = false }: { stage: EvidenceStage; compact?: boolean }) {
  const item = EVIDENCE_STAGE_META[stage];
  return (
    <span title={item.description} className={`inline-flex items-center gap-1.5 rounded-full border font-semibold uppercase tracking-wider ${compact ? 'px-2 py-0.5 text-micro' : 'px-2.5 py-1 text-micro'} ${stageStyles[stage]}`}>
      <span className="font-mono">{item.short}</span>
      {!compact && item.label}
    </span>
  );
}

function AvailabilityBadge({ availability }: { availability: Availability }) {
  return (
    <span className={`rounded-full border px-2.5 py-1 text-micro font-semibold uppercase tracking-wider ${availabilityStyles[availability]}`}>
      {availability === 'consumer' ? 'Consumer' : availability === 'rx' ? 'Rx / drug' : 'Research only'}
    </span>
  );
}

function TargetSpectrum({ candidate, dense = false }: { candidate: SirtuinCandidate; dense?: boolean }) {
  return (
    <div className="grid grid-cols-7 gap-1" aria-label={`${candidate.name} target spectrum`}>
      {SIRTUINS.map((sirtuin) => {
        const targets = candidate.targets.filter((target) => target.sirtuin === sirtuin.id);
        const primary = targets.find((target) => target.mode === 'direct') ?? targets[0];
        return (
          <div key={sirtuin.id} className="group relative text-center">
            <div
              className={`mx-auto rounded-md border transition-all ${dense ? 'h-5 w-full' : 'h-7 w-full'} ${primary ? modeStyles[primary.mode] : 'border-border/50 bg-muted/10 text-muted-foreground/30'}`}
              title={primary ? `${sirtuin.id}: ${primary.note}` : `${sirtuin.id}: no mapped claim`}
            >
              <span className="sr-only">{primary ? `${sirtuin.id} ${MODE_LABELS[primary.mode].label}` : `${sirtuin.id} no mapped target`}</span>
            </div>
            {!dense && <span className="mt-1 block font-mono text-micro text-muted-foreground">{sirtuin.id.replace('SIRT', 'S')}</span>}
          </div>
        );
      })}
    </div>
  );
}

function AtlasNetwork({ selected, onSelect }: { selected: SirtuinId; onSelect: (id: SirtuinId) => void }) {
  const width = 760;
  const height = 470;
  const cx = width / 2;
  const cy = height / 2;
  const rx = 276;
  const ry = 158;

  const positions = SIRTUINS.map((s, i) => {
    const angle = -Math.PI / 2 + (i * Math.PI * 2) / SIRTUINS.length;
    return { ...s, x: cx + Math.cos(angle) * rx, y: cy + Math.sin(angle) * ry };
  });

  return (
    <div className="relative isolate overflow-hidden rounded-[2rem] border border-accent-cyan/15 bg-[#030712]/75 p-2 shadow-[0_30px_80px_-40px_rgba(34,211,238,0.36)] md:p-4">
      <div className="pointer-events-none absolute inset-0 opacity-70 [background-image:linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_47%,rgba(34,211,238,0.14),transparent_30%),radial-gradient(circle_at_20%_15%,rgba(167,139,250,0.10),transparent_28%),radial-gradient(circle_at_84%_78%,rgba(52,211,153,0.08),transparent_28%)]" />
      <div className="absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-3 py-1.5 backdrop-blur-xl">
        <ScanLine className="h-3.5 w-3.5 text-accent-cyan" />
        <span className="font-mono text-micro uppercase tracking-[0.22em] text-foreground/70">Live target topology</span>
      </div>
      <div className="absolute right-4 top-4 z-20 hidden items-center gap-3 rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-micro uppercase tracking-[0.16em] text-muted-foreground backdrop-blur-xl sm:flex">
        <span>Vector-native</span><span className="h-1 w-1 rounded-full bg-accent-emerald" /><span>Hi-DPI</span>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="relative z-10 h-auto w-full" role="img" aria-label="Interactive map of SIRT1 through SIRT7 around NAD plus">
        <defs>
          <radialGradient id="nadGlow" cx="50%" cy="42%">
            <stop offset="0%" stopColor="#cffafe" stopOpacity="0.95" />
            <stop offset="34%" stopColor="#67e8f9" stopOpacity="0.66" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.05" />
          </radialGradient>
          <linearGradient id="orbitStroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#a78bfa" stopOpacity="0.16" />
            <stop offset="0.5" stopColor="#22d3ee" stopOpacity="0.34" />
            <stop offset="1" stopColor="#34d399" stopOpacity="0.12" />
          </linearGradient>
          <filter id="softGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <ellipse cx={cx} cy={cy} rx={rx + 32} ry={ry + 22} fill="none" stroke="url(#orbitStroke)" strokeWidth="1" strokeDasharray="4 10" />
        <ellipse cx={cx} cy={cy} rx={rx - 28} ry={ry - 18} fill="none" stroke="currentColor" strokeOpacity="0.06" strokeWidth="1" />

        {positions.map((p) => {
          const active = p.id === selected;
          return (
            <g key={`line-${p.id}`}>
              <line x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={p.color} strokeOpacity={active ? 0.54 : 0.17} strokeWidth={active ? 2.2 : 1} />
              <circle cx={(cx + p.x) / 2} cy={(cy + p.y) / 2} r={active ? 2.8 : 1.5} fill={p.color} fillOpacity={active ? 0.9 : 0.32} />
            </g>
          );
        })}

        <motion.circle
          cx={cx}
          cy={cy}
          r="76"
          fill="url(#nadGlow)"
          stroke="#22d3ee"
          strokeOpacity="0.42"
          filter="url(#softGlow)"
          animate={{ r: [74, 78, 74], opacity: [0.88, 1, 0.88] }}
          transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <circle cx={cx} cy={cy} r="58" fill="#06131d" fillOpacity="0.72" stroke="#67e8f9" strokeOpacity="0.24" />
        <text x={cx} y={cy - 7} textAnchor="middle" fill="white" fontSize="30" fontWeight="900">NAD+</text>
        <text x={cx} y={cy + 16} textAnchor="middle" fill="#a1a1aa" fontSize="10" letterSpacing="1.5">SHARED COSUBSTRATE</text>
        <text x={cx} y={cy + 34} textAnchor="middle" fill="#67e8f9" fontSize="9" letterSpacing="1">FAMILY-WIDE SUPPORT</text>

        {positions.map((p) => {
          const active = p.id === selected;
          return (
            <g
              key={p.id}
              role="button"
              tabIndex={0}
              aria-label={`${p.id}: ${p.shorthand}`}
              onClick={() => onSelect(p.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onSelect(p.id);
                }
              }}
              className="cursor-pointer outline-none"
            >
              {active && (
                <motion.circle
                  cx={p.x}
                  cy={p.y}
                  r="53"
                  fill="none"
                  stroke={p.color}
                  strokeOpacity="0.18"
                  strokeWidth="7"
                  initial={{ r: 45, opacity: 0 }}
                  animate={{ r: 53, opacity: 1 }}
                />
              )}
              <circle cx={p.x} cy={p.y} r={active ? 44 : 38} fill="#030712" fillOpacity="0.78" stroke={p.color} strokeWidth={active ? 2.7 : 1.35} />
              <circle cx={p.x} cy={p.y} r={active ? 38 : 33} fill={p.color} fillOpacity={active ? 0.16 : 0.07} />
              <text x={p.x} y={p.y + 4} textAnchor="middle" fill={active ? '#ffffff' : '#e4e4e7'} fontSize={active ? 16 : 14} fontWeight="900">{p.id}</text>
              <text x={p.x} y={p.y + 19} textAnchor="middle" fill={active ? p.color : '#71717a'} fontSize="7.5" fontWeight="700" letterSpacing="0.6">{p.location.toUpperCase().slice(0, 18)}</text>
            </g>
          );
        })}
      </svg>
      <div className="relative z-10 grid grid-cols-2 gap-2 border-t border-white/5 px-3 py-3 text-micro text-muted-foreground sm:grid-cols-4">
        <div><span className="font-mono text-accent-cyan">01</span> Select isoform</div>
        <div><span className="font-mono text-accent-cyan">02</span> Inspect biology</div>
        <div><span className="font-mono text-accent-cyan">03</span> Compare target mode</div>
        <div><span className="font-mono text-accent-cyan">04</span> Read primary evidence</div>
      </div>
    </div>
  );
}

function SignalConsole() {
  const directConsumer = SIRTUIN_CANDIDATES.filter((candidate) =>
    candidate.availability === 'consumer' && candidate.targets.some((target) => target.mode === 'direct'),
  ).length;
  const highConfidenceTargets = SIRTUIN_CANDIDATES.flatMap((candidate) => candidate.targets).filter((target) => target.confidence === 'high').length;
  const humanStage = SIRTUIN_CANDIDATES.filter((candidate) => candidate.evidenceStage.startsWith('human-')).length;

  const stats = [
    { label: 'Human sirtuins', value: '7', detail: 'SIRT1 → SIRT7', icon: Dna, accent: 'text-accent-cyan' },
    { label: 'Mapped candidates', value: String(SIRTUIN_CANDIDATES.length), detail: 'Consumer + Rx + research', icon: Layers3, accent: 'text-accent-violet' },
    { label: 'Human-stage candidates', value: String(humanStage), detail: 'Target, pathway or NAD+ data', icon: Activity, accent: 'text-accent-emerald' },
    { label: 'Consumer direct leads', value: String(directConsumer), detail: 'Direct ≠ proven anti-aging', icon: Zap, accent: 'text-accent-amber' },
    { label: 'High-confidence mappings', value: String(highConfidenceTargets), detail: 'Target-level confidence flags', icon: Radar, accent: 'text-accent-cyan' },
  ];

  return (
    <section className="mb-10 overflow-hidden rounded-[2rem] border border-border/60 bg-gradient-to-br from-white/[0.045] via-transparent to-accent-cyan/[0.035] p-4 md:p-5" aria-label="Atlas signal console">
      <div className="mb-4 flex items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2">
          <Gauge className="h-4 w-4 text-accent-cyan" />
          <p className="text-label text-accent-cyan">Evidence signal console</p>
        </div>
        <span className="hidden font-mono text-micro uppercase tracking-[0.22em] text-muted-foreground sm:block">Resolution layer 01 / overview</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.label} className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-black/15 p-4 transition-colors hover:border-accent-cyan/20">
            <div className="absolute right-0 top-0 h-20 w-20 translate-x-7 -translate-y-7 rounded-full bg-white/[0.025] blur-xl" />
            <stat.icon className={`h-4 w-4 ${stat.accent}`} />
            <div className="mt-5 flex items-end justify-between gap-3">
              <div>
                <p className="font-mono text-3xl font-black tracking-tight">{stat.value}</p>
                <p className="mt-1 text-xs font-semibold">{stat.label}</p>
              </div>
              <CircleDot className="h-3.5 w-3.5 text-muted-foreground/40 transition-colors group-hover:text-accent-cyan" />
            </div>
            <p className="mt-2 text-micro leading-relaxed text-muted-foreground">{stat.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SirtuinDetail({ id }: { id: SirtuinId }) {
  const sirtuin = SIRTUINS.find((item) => item.id === id) ?? SIRTUINS[0];
  const candidates = SIRTUIN_CANDIDATES.filter((candidate) => candidate.targets.some((target) => target.sirtuin === id));
  const direct = candidates.filter((candidate) => candidate.targets.some((target) => target.sirtuin === id && target.mode === 'direct'));
  const human = candidates.filter((candidate) => candidate.evidenceStage.startsWith('human-'));

  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="premium-card relative overflow-hidden rounded-[2rem] border border-border/60 p-6 md:p-8"
    >
      <div className="pointer-events-none absolute right-0 top-0 h-44 w-44 translate-x-16 -translate-y-16 rounded-full blur-3xl" style={{ background: `${sirtuin.color}18` }} />
      <div className="relative">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <span className="font-mono text-4xl font-black" style={{ color: sirtuin.color }}>{sirtuin.id}</span>
              <span className="rounded-full border border-border/70 bg-muted/20 px-3 py-1 text-xs text-muted-foreground">{sirtuin.location}</span>
            </div>
            <h3 className="text-xl font-semibold">{sirtuin.shorthand}</h3>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center md:min-w-[250px]">
            <div className="rounded-xl border border-border/60 bg-muted/10 p-3"><p className="font-mono text-xl font-black">{candidates.length}</p><p className="text-micro uppercase tracking-wider text-muted-foreground">mapped</p></div>
            <div className="rounded-xl border border-border/60 bg-muted/10 p-3"><p className="font-mono text-xl font-black text-accent-emerald">{direct.length}</p><p className="text-micro uppercase tracking-wider text-muted-foreground">direct</p></div>
            <div className="rounded-xl border border-border/60 bg-muted/10 p-3"><p className="font-mono text-xl font-black text-accent-cyan">{human.length}</p><p className="text-micro uppercase tracking-wider text-muted-foreground">human-stage</p></div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-accent-cyan/20 bg-accent-cyan/[0.045] px-4 py-4">
          <div className="flex items-center gap-2"><Zap className="h-4 w-4 text-accent-cyan" /><p className="text-label text-accent-cyan">Current best lever</p></div>
          <p className="mt-2 text-body-sm leading-relaxed">{sirtuin.strongestLever}</p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="glass rounded-2xl p-5">
            <p className="text-label mb-3">Core biological jobs</p>
            <ul className="space-y-2.5 text-body-sm">
              {sirtuin.jobs.map((job) => (
                <li key={job} className="flex gap-2.5"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-emerald" />{job}</li>
              ))}
            </ul>
          </div>
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2"><TriangleAlert className="h-4 w-4 text-accent-amber" /><p className="text-label text-accent-amber">Evidence boundary</p></div>
            <p className="mt-3 text-body-sm leading-relaxed">{sirtuin.evidenceBoundary}</p>
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-label">Mapped candidates</p>
            <span className="font-mono text-micro uppercase tracking-wider text-muted-foreground">mode · confidence</span>
          </div>
          <div className="space-y-2">
            {candidates
              .sort((a, b) => b.score - a.score)
              .slice(0, 7)
              .map((candidate) => {
                const targets = candidate.targets.filter((item) => item.sirtuin === id);
                return (
                  <div key={candidate.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/60 bg-muted/10 px-3 py-2.5">
                    <div className="min-w-0"><p className="truncate text-xs font-semibold">{candidate.name}</p><p className="text-micro text-muted-foreground">Score {candidate.score} · {EVIDENCE_STAGE_META[candidate.evidenceStage].label}</p></div>
                    <div className="flex items-center gap-1.5">
                      {targets.map((target, index) => <ModeBadge key={`${target.mode}-${index}`} mode={target.mode} compact />)}
                      <span className={`h-2 w-2 rounded-full ${confidenceDot[targets[0]?.confidence ?? 'low']}`} title={`${targets[0]?.confidence ?? 'low'} confidence`} />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CandidateCard({
  candidate,
  compared,
  onToggleCompare,
}: {
  candidate: SirtuinCandidate;
  compared: boolean;
  onToggleCompare: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const targetCount = uniqueTargetCount(candidate);
  const primaryMode = strongestMode(candidate);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`premium-card group relative overflow-hidden rounded-2xl border transition-colors ${compared ? 'border-accent-violet/45 shadow-[0_0_0_1px_rgba(167,139,250,0.12),0_18px_50px_-30px_rgba(167,139,250,0.4)]' : 'border-border/60 hover:border-accent-cyan/25'}`}
    >
      <div className="absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-transparent via-accent-cyan/55 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="p-5 md:p-6">
        <div className="flex items-start gap-4">
          <EvidenceRing value={candidate.score} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold leading-tight">{candidate.name}</h3>
              <AvailabilityBadge availability={candidate.availability} />
              <StageBadge stage={candidate.evidenceStage} compact />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{candidate.category}</p>
            <p className="mt-3 text-body-sm text-foreground/90">{candidate.verdict}</p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <TargetSpectrum candidate={candidate} />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onToggleCompare}
              className={`focus-ring inline-flex min-h-10 items-center gap-2 rounded-xl border px-3 text-xs font-semibold transition-colors ${compared ? 'border-accent-violet/40 bg-accent-violet/12 text-accent-violet' : 'border-border/70 bg-muted/10 text-muted-foreground hover:text-foreground'}`}
              aria-pressed={compared}
            >
              <GitCompareArrows className="h-3.5 w-3.5" />
              {compared ? 'Comparing' : 'Compare'}
            </button>
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-xl border border-border/70 bg-muted/10 px-3 text-xs font-semibold text-muted-foreground hover:text-foreground"
              aria-expanded={expanded}
            >
              Evidence
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border/40 pt-4">
          <div><p className="font-mono text-sm font-bold">{targetCount}/7</p><p className="text-micro uppercase tracking-wider text-muted-foreground">coverage</p></div>
          <div><ModeBadge mode={primaryMode} compact /><p className="mt-1 text-micro uppercase tracking-wider text-muted-foreground">strongest mode</p></div>
          <div><p className="font-mono text-sm font-bold">{candidate.citations.length}</p><p className="text-micro uppercase tracking-wider text-muted-foreground">primary reads</p></div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="border-t border-border/50 px-5 pb-6 pt-5 md:px-6">
              <div className="mb-4"><EvidenceBar value={candidate.score} /></div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center gap-2"><BookOpenCheck className="h-4 w-4 text-accent-emerald" /><p className="text-label text-accent-emerald">What the evidence actually shows</p></div>
                  <p className="mt-2 text-body-sm leading-relaxed">{candidate.humanEvidence}</p>
                </div>
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center gap-2"><TriangleAlert className="h-4 w-4 text-accent-amber" /><p className="text-label text-accent-amber">Do not over-interpret</p></div>
                  <p className="mt-2 text-body-sm leading-relaxed">{candidate.caveat}</p>
                </div>
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {candidate.targets.map((target, index) => (
                  <div key={`${candidate.id}-${target.sirtuin}-${target.mode}-${index}`} className="rounded-xl border border-border/60 bg-muted/10 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold">{target.sirtuin}</span>
                      <div className="flex items-center gap-1.5"><ModeBadge mode={target.mode} compact /><span className={`h-2 w-2 rounded-full ${confidenceDot[target.confidence]}`} /></div>
                    </div>
                    <p className="mt-2 text-micro leading-relaxed text-muted-foreground">{target.note}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {candidate.citations.map((citation) => (
                  <a
                    key={`${candidate.id}-${citation.pmid}`}
                    href={citation.url}
                    target="_blank"
                    rel="noreferrer"
                    className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-border/60 px-3 py-2 text-xs text-accent-cyan hover:bg-accent-cyan/8"
                  >
                    PMID {citation.pmid} · {citation.year}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

function MatrixCell({ candidate, sirtuin }: { candidate: SirtuinCandidate; sirtuin: SirtuinId }) {
  const targets = candidate.targets.filter((item) => item.sirtuin === sirtuin);
  if (!targets.length) return <span className="text-muted-foreground/25">—</span>;
  const sorted = [...targets].sort((a, b) => ['direct', 'nad', 'expression', 'uncertain'].indexOf(a.mode) - ['direct', 'nad', 'expression', 'uncertain'].indexOf(b.mode));
  return (
    <div className="flex items-center justify-center gap-1">
      {sorted.slice(0, 2).map((target, index) => {
        const item = MODE_LABELS[target.mode];
        return (
          <span
            key={`${target.mode}-${index}`}
            title={`${item.label}: ${target.note} · ${target.confidence} confidence`}
            className={`inline-flex h-7 w-7 items-center justify-center rounded-lg border font-mono text-xs font-bold ${modeStyles[target.mode]}`}
          >
            {item.short}
          </span>
        );
      })}
    </div>
  );
}

function CompareConsole({ candidates, onRemove }: { candidates: SirtuinCandidate[]; onRemove: (id: string) => void }) {
  if (!candidates.length) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-14 overflow-hidden rounded-[2rem] border border-accent-violet/25 bg-gradient-to-br from-accent-violet/[0.07] via-transparent to-accent-cyan/[0.04] p-5 md:p-7"
      aria-labelledby="compare-console-title"
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2"><GitCompareArrows className="h-5 w-5 text-accent-violet" /><h2 id="compare-console-title" className="text-xl font-semibold">Comparison console</h2></div>
        <span className="font-mono text-micro uppercase tracking-[0.2em] text-muted-foreground">Select up to two candidates</span>
      </div>
      <div className={`grid gap-4 ${candidates.length === 2 ? 'lg:grid-cols-2' : ''}`}>
        {candidates.map((candidate) => (
          <div key={candidate.id} className="rounded-2xl border border-white/[0.08] bg-black/15 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2"><h3 className="text-lg font-semibold">{candidate.name}</h3><StageBadge stage={candidate.evidenceStage} compact /></div>
                <p className="mt-1 text-xs text-muted-foreground">{candidate.category}</p>
              </div>
              <button type="button" onClick={() => onRemove(candidate.id)} className="focus-ring grid h-9 w-9 place-items-center rounded-xl border border-border/60 text-muted-foreground hover:text-foreground" aria-label={`Remove ${candidate.name} from comparison`}><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-5 grid grid-cols-[auto_1fr] items-center gap-4">
              <EvidenceRing value={candidate.score} size={64} />
              <div>
                <TargetSpectrum candidate={candidate} dense />
                <p className="mt-2 text-micro text-muted-foreground">{uniqueTargetCount(candidate)}/7 unique isoforms · {candidate.citations.length} primary reads</p>
              </div>
            </div>
            <p className="mt-4 text-body-sm">{candidate.verdict}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {Array.from(new Set(candidate.targets.map((target) => target.mode))).map((mode) => <ModeBadge key={mode} mode={mode} />)}
            </div>
          </div>
        ))}
        {candidates.length === 1 && (
          <div className="grid min-h-48 place-items-center rounded-2xl border border-dashed border-border/70 bg-muted/[0.06] p-6 text-center">
            <div><GitCompareArrows className="mx-auto h-6 w-6 text-muted-foreground/60" /><p className="mt-3 text-sm font-semibold">Select one more candidate</p><p className="mt-1 text-xs text-muted-foreground">The comparison console will align mechanism, maturity, coverage, and evidence score.</p></div>
          </div>
        )}
      </div>
    </motion.section>
  );
}

function EvidenceMaturityLadder() {
  const stages: EvidenceStage[] = ['human-target', 'human-pathway', 'human-nad', 'preclinical-direct', 'preclinical-indirect'];
  return (
    <section className="mb-14" aria-labelledby="maturity-title">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div><div className="flex items-center gap-2"><Radar className="h-5 w-5 text-accent-emerald" /><p className="text-label text-accent-emerald">Translation resolution</p></div><h2 id="maturity-title" className="heading-section mt-2">Evidence maturity ladder</h2></div>
        <span className="hidden max-w-sm text-right text-xs text-muted-foreground md:block">Mechanism confidence and clinical relevance are separate dimensions. This ladder describes translation stage, not benefit.</span>
      </div>
      <div className="relative grid gap-3 lg:grid-cols-5">
        <div className="pointer-events-none absolute left-[10%] right-[10%] top-8 hidden h-px bg-gradient-to-r from-accent-emerald/40 via-accent-cyan/35 to-zinc-500/20 lg:block" />
        {stages.map((stage, index) => {
          const meta = EVIDENCE_STAGE_META[stage];
          const count = SIRTUIN_CANDIDATES.filter((candidate) => candidate.evidenceStage === stage).length;
          return (
            <div key={stage} className="relative rounded-2xl border border-border/60 bg-muted/[0.07] p-4">
              <div className="relative z-10 mb-4 flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-background font-mono text-xs font-black">{String(index + 1).padStart(2, '0')}</div>
              <StageBadge stage={stage} compact />
              <p className="mt-3 text-sm font-semibold">{meta.label}</p>
              <p className="mt-2 text-micro leading-relaxed text-muted-foreground">{meta.description}</p>
              <p className="mt-4 font-mono text-xs text-foreground/80">{count} mapped candidate{count === 1 ? '' : 's'}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function SirtuinAtlas() {
  const [selected, setSelected] = useState<SirtuinId>('SIRT1');
  const [availability, setAvailability] = useState<'all' | Availability>('consumer');
  const [modeFilter, setModeFilter] = useState<'all' | TargetMode>('all');
  const [sortBy, setSortBy] = useState<'score' | 'coverage' | 'name'>('score');
  const [query, setQuery] = useState('');
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const candidates = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return SIRTUIN_CANDIDATES
      .filter((candidate) => availability === 'all' || candidate.availability === availability)
      .filter((candidate) => modeFilter === 'all' || candidate.targets.some((target) => target.mode === modeFilter))
      .filter((candidate) => {
        if (!normalized) return true;
        const haystack = [candidate.name, candidate.category, candidate.verdict, candidate.humanEvidence, ...candidate.targets.map((target) => `${target.sirtuin} ${target.note}`)].join(' ').toLowerCase();
        return haystack.includes(normalized);
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'coverage') return uniqueTargetCount(b) - uniqueTargetCount(a) || b.score - a.score;
        return b.score - a.score;
      });
  }, [availability, modeFilter, query, sortBy]);

  const comparedCandidates = compareIds.map((id) => SIRTUIN_CANDIDATES.find((candidate) => candidate.id === id)).filter(Boolean) as SirtuinCandidate[];

  const toggleCompare = (id: string) => {
    setCompareIds((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length < 2) return [...current, id];
      return [current[1], id];
    });
  };

  return (
    <div className="container-page py-14 md:py-20 lg:py-24">
      <PageHeader
        icon={Orbit}
        eyebrow="TNiC Molecular Atlas · SIRT1–SIRT7"
        title="The Sirtuin Atlas"
        description="A high-resolution map of what actually activates, supports, or merely correlates with the seven human sirtuins — separating human target engagement from animal, cell, and marketing claims."
        meta="Evidence reviewed through August 2026 · Vector-native interactive edition · Educational, not medical advice"
        theme="cyan"
        context={{
          what: 'Seven NAD+-dependent regulatory enzymes tied to metabolism, stress response, genome maintenance, inflammation, proteostasis, and mitochondrial function.',
          why: '“Sirtuin activator” is often used too loosely. The useful question is whether a compound directly activates an isoform, raises NAD+, changes expression, or only has a plausible association.',
          next: 'Explore the network, inspect translation maturity, then use the evidence explorer and comparison console.',
        }}
      />

      <SignalConsole />

      <section aria-labelledby="atlas-answer" className="mb-10 grid gap-4 md:grid-cols-4">
        <div className="premium-card relative overflow-hidden rounded-2xl border border-accent-cyan/20 p-5 md:col-span-2">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(34,211,238,0.10),transparent_42%)]" />
          <div className="relative">
            <div className="flex items-center gap-2 text-accent-cyan"><ShieldCheck className="h-5 w-5" /><p id="atlas-answer" className="text-label">Direct answer</p></div>
            <p className="mt-3 text-xl font-semibold">There is no OTC supplement proven to selectively activate SIRT1–SIRT7 in humans.</p>
            <p className="mt-2 text-body-sm">The most defensible consumer strategy is <strong>NAD+ restoration</strong> for family-wide substrate support, then isoform-specific candidates only where the evidence earns it.</p>
          </div>
        </div>
        <div className="premium-card rounded-2xl border border-border/60 p-5">
          <p className="text-label text-accent-emerald">Best broad lever</p>
          <p className="mt-2 text-2xl font-black">NR / NMN</p>
          <p className="mt-1 text-body-sm">Human NAD+ restoration. Not selective direct activation.</p>
        </div>
        <div className="premium-card rounded-2xl border border-border/60 p-5">
          <p className="text-label text-accent-violet">Best direct natural lead</p>
          <p className="mt-2 text-2xl font-black">Honokiol → SIRT3</p>
          <p className="mt-1 text-body-sm">Compelling direct/preclinical signal; human target engagement still missing.</p>
        </div>
      </section>

      <section className="mb-14 grid gap-6 xl:grid-cols-[1.22fr_0.78fr]" aria-label="Interactive sirtuin map">
        <AtlasNetwork selected={selected} onSelect={setSelected} />
        <SirtuinDetail id={selected} />
      </section>

      <EvidenceMaturityLadder />

      <section className="mb-14" aria-labelledby="myth-audit-title">
        <div className="mb-5 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent-violet" />
          <h2 id="myth-audit-title" className="heading-section">Three claims worth fixing</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {[
            { label: 'NMN + resveratrol', title: 'Complementary ≠ required', body: 'NMN raises NAD+, which sirtuins consume. Resveratrol is a separate STAC/signaling candidate. NMN does not “activate resveratrol,” and NMN does not require resveratrol to restore NAD+.', tone: 'text-accent-cyan' },
            { label: 'Metformin', title: 'Indirect, not a SIRT1 agonist', body: 'Metformin can influence AMPK–NAD–SIRT1 signaling, but that is fundamentally different from binding SIRT1 and directly increasing catalytic activity.', tone: 'text-accent-amber' },
            { label: 'Resveratrol', title: 'Substrate-dependent + clinically mixed', body: 'The mechanistic story is real but not universal. Human trials do not consistently show increased SIRT1, and direct activation depends on assay/substrate context.', tone: 'text-accent-emerald' },
          ].map((item, index) => (
            <div key={item.label} className="glass group relative overflow-hidden rounded-2xl p-5">
              <span className="absolute right-4 top-3 font-mono text-3xl font-black text-foreground/[0.035]">0{index + 1}</span>
              <p className={`text-label ${item.tone}`}>{item.label}</p>
              <p className="mt-2 text-lg font-semibold">{item.title}</p>
              <p className="mt-2 text-body-sm leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <CompareConsole candidates={comparedCandidates} onRemove={(id) => setCompareIds((items) => items.filter((item) => item !== id))} />

      <section className="mb-14" aria-labelledby="candidate-title">
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2"><FlaskConical className="h-5 w-5 text-accent-cyan" /><p className="text-label text-accent-cyan">Ranked target-engagement map</p></div>
          <h2 id="candidate-title" className="heading-section">Evidence explorer</h2>
          <p className="mt-2 max-w-3xl text-body">Search, filter, sort, inspect, and compare. Scores rank confidence in the claimed <em>sirtuin mechanism</em>, not overall longevity benefit, safety, or product quality.</p>
        </div>

        <div className="mb-5 rounded-2xl border border-border/60 bg-muted/[0.07] p-3 md:p-4">
          <div className="grid gap-3 lg:grid-cols-[1.4fr_auto_auto_auto]">
            <label className="relative block">
              <span className="sr-only">Search sirtuin candidates</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search compound, SIRT target, mechanism…"
                className="focus-ring min-h-11 w-full rounded-xl border border-border/70 bg-background/55 pl-10 pr-10 text-sm outline-none placeholder:text-muted-foreground/60"
              />
              {query && <button type="button" onClick={() => setQuery('')} className="focus-ring absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground hover:text-foreground" aria-label="Clear search"><X className="h-3.5 w-3.5" /></button>}
            </label>

            <div className="flex min-h-11 items-center gap-1 rounded-xl border border-border/70 bg-background/40 p-1" role="group" aria-label="Filter candidate availability">
              {(['consumer', 'rx', 'research', 'all'] as const).map((item) => (
                <button key={item} type="button" onClick={() => setAvailability(item)} className={`focus-ring rounded-lg px-3 py-2 text-micro font-semibold capitalize ${availability === item ? 'bg-accent-cyan/15 text-accent-cyan' : 'text-muted-foreground hover:text-foreground'}`}>
                  {item === 'all' ? 'All' : item === 'rx' ? 'Rx' : item}
                </button>
              ))}
            </div>

            <label className="relative">
              <span className="sr-only">Filter by target mode</span>
              <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <select value={modeFilter} onChange={(event) => setModeFilter(event.target.value as 'all' | TargetMode)} className="focus-ring min-h-11 appearance-none rounded-xl border border-border/70 bg-background/40 pl-9 pr-8 text-xs font-semibold outline-none">
                <option value="all">All modes</option>
                <option value="direct">Direct</option>
                <option value="nad">NAD+ support</option>
                <option value="expression">Expression / signaling</option>
                <option value="uncertain">Uncertain</option>
              </select>
            </label>

            <label className="relative">
              <span className="sr-only">Sort candidates</span>
              <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value as 'score' | 'coverage' | 'name')} className="focus-ring min-h-11 appearance-none rounded-xl border border-border/70 bg-background/40 pl-9 pr-8 text-xs font-semibold outline-none">
                <option value="score">Evidence score</option>
                <option value="coverage">Target coverage</option>
                <option value="name">Name</option>
              </select>
            </label>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1">
            <p className="font-mono text-micro uppercase tracking-wider text-muted-foreground">{candidates.length} result{candidates.length === 1 ? '' : 's'} · {compareIds.length}/2 comparison slots</p>
            <div className="flex flex-wrap gap-1.5">{(Object.keys(MODE_LABELS) as TargetMode[]).map((mode) => <ModeBadge key={mode} mode={mode} compact />)}</div>
          </div>
        </div>

        {candidates.length ? (
          <motion.div layout className="grid gap-4 lg:grid-cols-2">
            {candidates.map((candidate) => (
              <CandidateCard key={candidate.id} candidate={candidate} compared={compareIds.includes(candidate.id)} onToggleCompare={() => toggleCompare(candidate.id)} />
            ))}
          </motion.div>
        ) : (
          <div className="grid min-h-52 place-items-center rounded-2xl border border-dashed border-border/70 bg-muted/[0.05] p-6 text-center">
            <div><Search className="mx-auto h-6 w-6 text-muted-foreground/50" /><p className="mt-3 font-semibold">No mapped candidates match these filters</p><button type="button" onClick={() => { setQuery(''); setAvailability('all'); setModeFilter('all'); }} className="focus-ring mt-3 rounded-xl border border-border/70 px-4 py-2 text-xs text-accent-cyan">Reset explorer</button></div>
          </div>
        )}
      </section>

      <section className="mb-14" aria-labelledby="matrix-title">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div><div className="flex items-center gap-2"><Atom className="h-5 w-5 text-accent-violet" /><p className="text-label text-accent-violet">Cross-isoform resolution</p></div><h2 id="matrix-title" className="heading-section mt-2">SIRT1–SIRT7 mechanism matrix</h2></div>
          <p className="max-w-lg text-xs text-muted-foreground">A cell can contain more than one badge because the same candidate may provide NAD+ support while also carrying a separate direct or signaling claim for that isoform.</p>
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
          {(Object.keys(MODE_LABELS) as TargetMode[]).map((mode) => (
            <div key={mode} className="flex items-center gap-2 rounded-xl border border-border/60 px-3 py-2 text-xs">
              <ModeBadge mode={mode} />
              <span className="text-muted-foreground">{MODE_LABELS[mode].description}</span>
            </div>
          ))}
        </div>
        <div className="scroll-region overflow-x-auto rounded-2xl border border-border/60 bg-black/10 shadow-[0_24px_60px_-45px_rgba(34,211,238,0.35)]">
          <table className="w-full min-w-[980px] border-collapse text-sm">
            <caption className="sr-only">Matrix showing direct activation, NAD support, expression signaling, or uncertain effects for candidate compounds across SIRT1 through SIRT7.</caption>
            <thead className="bg-muted/25 backdrop-blur-xl">
              <tr>
                <th scope="col" className="sticky left-0 z-10 bg-background/95 px-4 py-3 text-left text-label">Candidate</th>
                <th scope="col" className="px-3 py-3 text-center text-label">Stage</th>
                {SIRTUINS.map((sirtuin) => <th key={sirtuin.id} scope="col" className="px-3 py-3 text-center font-mono text-xs" style={{ color: sirtuin.color }}>{sirtuin.id}</th>)}
              </tr>
            </thead>
            <tbody>
              {SIRTUIN_CANDIDATES.map((candidate) => (
                <tr key={candidate.id} className="border-t border-border/50 transition-colors hover:bg-white/[0.018]">
                  <th scope="row" className="sticky left-0 z-10 bg-background/95 px-4 py-3 text-left font-medium"><div>{candidate.name}</div><div className="mt-0.5 text-micro font-normal text-muted-foreground">{candidate.availability}</div></th>
                  <td className="px-3 py-3 text-center"><StageBadge stage={candidate.evidenceStage} compact /></td>
                  {SIRTUINS.map((sirtuin) => <td key={sirtuin.id} className="px-3 py-3 text-center"><MatrixCell candidate={candidate} sirtuin={sirtuin.id} /></td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]" aria-labelledby="interpretation-title">
        <div className="premium-card rounded-2xl border border-accent-amber/25 p-6">
          <TriangleAlert className="h-6 w-6 text-accent-amber" />
          <h2 id="interpretation-title" className="mt-3 text-xl font-semibold">Important interpretation rule</h2>
          <p className="mt-3 text-body-sm leading-relaxed">Sirtuins are not universally “more is better.” Their effects are tissue-, substrate-, disease-, dose-, and context-dependent. Several family members can be protective in one setting and harmful in another, especially in cancer biology.</p>
        </div>
        <div className="premium-card rounded-2xl border border-border/60 p-6">
          <div className="flex items-center gap-2"><Microscope className="h-5 w-5 text-accent-emerald" /><p className="text-label text-accent-emerald">The practical hierarchy</p></div>
          <ol className="mt-4 grid gap-3 sm:grid-cols-2">
            <li className="glass rounded-xl p-4"><span className="font-mono text-accent-cyan">01</span><p className="mt-1 font-semibold">Restore the substrate</p><p className="text-body-sm">NR/NMN → NAD+ availability across the family.</p></li>
            <li className="glass rounded-xl p-4"><span className="font-mono text-accent-cyan">02</span><p className="mt-1 font-semibold">Demand isoform evidence</p><p className="text-body-sm">Direct binding/activity beats pathway storytelling.</p></li>
            <li className="glass rounded-xl p-4"><span className="font-mono text-accent-cyan">03</span><p className="mt-1 font-semibold">Demand human engagement</p><p className="text-body-sm">Blood/tissue target data beat cell-culture potency.</p></li>
            <li className="glass rounded-xl p-4"><span className="font-mono text-accent-cyan">04</span><p className="mt-1 font-semibold">Separate mechanism from outcome</p><p className="text-body-sm">Activating a sirtuin is not proof of slower human aging.</p></li>
          </ol>
        </div>
      </section>

      <section aria-labelledby="sources-title" className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-muted/10 p-6 md:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(34,211,238,0.07),transparent_36%)]" />
        <div className="relative">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2"><Beaker className="h-5 w-5 text-accent-cyan" /><h2 id="sources-title" className="text-xl font-semibold">Primary reading set</h2></div>
            <span className="hidden items-center gap-2 rounded-full border border-accent-emerald/20 bg-accent-emerald/5 px-3 py-1.5 text-micro font-semibold uppercase tracking-wider text-accent-emerald sm:inline-flex"><ShieldCheck className="h-3 w-3" /> Evidence visible</span>
          </div>
          <p className="mt-2 text-body-sm">Core sources used to calibrate the atlas. Candidate cards contain additional study-level citations.</p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {CORE_SOURCES.map((citation) => (
              <a key={citation.pmid} href={citation.url} target="_blank" rel="noreferrer" className="focus-ring glass glass-hover group flex items-start justify-between gap-3 rounded-xl p-4">
                <div><p className="font-medium group-hover:text-accent-cyan">{citation.label}</p><p className="mt-1 text-xs text-muted-foreground">PMID {citation.pmid} · {citation.year}</p></div>
                <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-accent-cyan" />
              </a>
            ))}
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
            <div className="flex items-start gap-2 rounded-xl border border-accent-cyan/15 bg-accent-cyan/5 p-4 text-body-sm">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent-cyan" />
              <p><strong>TNiC evidence rule:</strong> “Direct activator,” “NAD+ support,” “expression/signaling,” and “translation stage” are intentionally separate. A compound only moves up the hierarchy when target engagement is demonstrated in increasingly relevant systems.</p>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-border/60 px-4 py-3 text-micro text-muted-foreground"><Network className="h-4 w-4 text-accent-violet" /><span>Mechanism → target → translation → outcome</span></div>
          </div>
        </div>
      </section>
    </div>
  );
}
