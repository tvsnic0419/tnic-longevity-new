'use client';
/* eslint-disable react-hooks/set-state-in-effect --
   The mount/URL-driven effect(s) below set state from client-only sources
   (localStorage, window, or URL search params) or trigger entrance animations.
   These cannot run during SSR, so the initial setState is intentional and not a
   value derivable during render. Reviewed 2026-06-21; safe to keep. */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Scan, ArrowRight } from 'lucide-react';
import { CountUp } from '@/components/ui/CountUp';
import { cn } from '@/lib/utils';

export interface BiologicalAgeGaugeProps {
  chronoAge: number;
  bioAge: number;
  defenseScore: number;
  scanned: boolean;
  size?: 'sm' | 'md' | 'lg';
  showSliders?: boolean;
  onAgeChange?: (age: number) => void;
  onStressChange?: (v: number) => void;
  onSleepChange?: (v: number) => void;
  onExerciseChange?: (v: number) => void;
  stress?: number;
  sleep?: number;
  exercise?: number;
  onScan?: () => void;
  className?: string;
}

const SIZE = {
  sm: { box: 160, stroke: 8, fontSize: 'text-2xl', label: 'text-[10px]' },
  md: { box: 220, stroke: 10, fontSize: 'text-4xl', label: 'text-xs' },
  lg: { box: 280, stroke: 12, fontSize: 'text-5xl', label: 'text-sm' },
} as const;

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const x1 = cx + r * Math.cos(toRad(startDeg));
  const y1 = cy + r * Math.sin(toRad(startDeg));
  const x2 = cx + r * Math.cos(toRad(endDeg));
  const y2 = cy + r * Math.sin(toRad(endDeg));
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
}

function ageToProgress(age: number, min: number, max: number) {
  return Math.max(0, Math.min(1, (age - min) / (max - min)));
}

/** Animated semicircular biological age gauge with defense score ring */
export function BiologicalAgeGauge({
  chronoAge,
  bioAge,
  defenseScore,
  scanned,
  size = 'md',
  showSliders = false,
  onAgeChange,
  onStressChange,
  onSleepChange,
  onExerciseChange,
  stress = 50,
  sleep = 60,
  exercise = 45,
  onScan,
  className,
}: BiologicalAgeGaugeProps) {
  const s = SIZE[size];
  const viewBox = 120;
  const cx = 60;
  const cy = 62;
  const r = 44;
  const startDeg = 200;
  const endDeg = -20;
  const arcLen = Math.PI * r * ((360 - (startDeg - endDeg)) / 360);

  const minAge = chronoAge - 12;
  const maxAge = chronoAge + 18;
  const chronoProgress = ageToProgress(chronoAge, minAge, maxAge);

  const [animatedBio, setAnimatedBio] = useState(scanned ? bioAge : chronoAge);
  const [animatedDefense, setAnimatedDefense] = useState(scanned ? defenseScore : 0);

  useEffect(() => {
    if (!scanned) {
      setAnimatedBio(chronoAge);
      setAnimatedDefense(0);
      return;
    }

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      setAnimatedBio(bioAge);
      setAnimatedDefense(defenseScore);
      return;
    }

    const start = performance.now();
    const fromBio = animatedBio;
    const fromDef = animatedDefense;
    let frame: number;

    const tick = (now: number) => {
      const t = Math.min((now - start) / 1400, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimatedBio(Math.round(fromBio + (bioAge - fromBio) * eased));
      setAnimatedDefense(Math.round(fromDef + (defenseScore - fromDef) * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanned, bioAge, defenseScore, chronoAge]);

  const displayProgress = ageToProgress(animatedBio, minAge, maxAge);
  const ageDelta = chronoAge - animatedBio;
  const tone =
    ageDelta > 2 ? 'emerald' : ageDelta < -2 ? 'rose' : 'cyan';

  const toneColor = {
    emerald: 'var(--accent-emerald)',
    cyan: 'var(--accent-cyan)',
    rose: 'var(--accent-rose)',
  }[tone];

  const bioOffset = arcLen * (1 - displayProgress);
  const chronoAngle = startDeg + (endDeg - startDeg) * chronoProgress;
  const chronoRad = (chronoAngle * Math.PI) / 180;
  const tickX = cx + r * Math.cos(chronoRad);
  const tickY = cy + r * Math.sin(chronoRad);

  return (
    <div className={cn('bio-age-gauge', className)}>
      <div className="relative mx-auto" style={{ width: s.box, height: s.box * 0.72 }}>
        <svg
          viewBox={`0 0 ${viewBox} ${viewBox}`}
          className="w-full h-full bio-age-gauge-svg"
          role="img"
          aria-label={
            scanned
              ? `Biological age ${animatedBio}, chronological age ${chronoAge}, defense score ${animatedDefense}`
              : `Biological age not scanned. Chronological age ${chronoAge}.`
          }
        >
          <defs>
            <linearGradient id="bio-gauge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--accent-cyan)" />
              <stop offset="50%" stopColor="var(--accent-emerald)" />
              <stop offset="100%" stopColor="var(--accent-violet)" />
            </linearGradient>
            <filter id="bio-gauge-glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Track */}
          <path
            d={arcPath(cx, cy, r, startDeg, endDeg)}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.12}
            strokeWidth={s.stroke}
            strokeLinecap="round"
          />

          {/* Defense inner ring */}
          <circle
            cx={cx}
            cy={cy}
            r={r - s.stroke - 6}
            fill="none"
            stroke="var(--accent-violet)"
            strokeOpacity={0.15}
            strokeWidth={3}
          />
          <circle
            cx={cx}
            cy={cy}
            r={r - s.stroke - 6}
            fill="none"
            stroke="var(--accent-violet)"
            strokeWidth={3}
            strokeDasharray={`${2 * Math.PI * (r - s.stroke - 6)}`}
            strokeDashoffset={`${2 * Math.PI * (r - s.stroke - 6) * (1 - animatedDefense / 100)}`}
            strokeLinecap="round"
            transform={`rotate(-90 ${cx} ${cy})`}
            className="bio-age-defense-ring"
          />

          {/* Bio age arc */}
          <motion.path
            d={arcPath(cx, cy, r, startDeg, endDeg)}
            fill="none"
            stroke={scanned ? toneColor : 'var(--accent-cyan)'}
            strokeWidth={s.stroke}
            strokeLinecap="round"
            strokeDasharray={arcLen}
            initial={{ strokeDashoffset: arcLen }}
            animate={{ strokeDashoffset: scanned ? bioOffset : arcLen * 0.7 }}
            transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1] }}
            filter="url(#bio-gauge-glow)"
            opacity={scanned ? 1 : 0.35}
          />

          {/* Chrono age tick */}
          <circle
            cx={tickX}
            cy={tickY}
            r={3.5}
            fill="var(--color-text-faint)"
            stroke="var(--color-bg-base)"
            strokeWidth={1.5}
          />

          {/* Center glow */}
          <circle cx={cx} cy={cy} r={22} fill="url(#bio-gauge-grad)" opacity={0.06} />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1 pointer-events-none">
          <p className={cn('text-label text-accent-rose mb-0.5', s.label)}>Biological age</p>
          {scanned ? (
            <p className={cn('font-bold font-mono tabular-nums', s.fontSize)} style={{ color: toneColor }}>
              <CountUp value={animatedBio} duration={1.2} />
            </p>
          ) : (
            <p className={cn('font-bold font-mono text-muted-foreground', s.fontSize)}>—</p>
          )}
          <p className={cn('text-caption font-mono mt-1', s.label)}>
            Chrono {chronoAge}
            {scanned && (
              <span className={cn('ml-2', tone === 'emerald' ? 'text-accent-emerald' : tone === 'rose' ? 'text-accent-rose' : 'text-accent-cyan')}>
                {ageDelta > 0 ? `−${ageDelta}` : ageDelta < 0 ? `+${Math.abs(ageDelta)}` : '±0'} yr
              </span>
            )}
          </p>
        </div>
      </div>

      {scanned && (
        <div className="flex justify-center gap-4 mt-3">
          <div className="text-center">
            <p className="text-label">Defense</p>
            <p className="font-mono font-bold text-accent-violet text-sm">
              <CountUp value={animatedDefense} duration={1.2} />
            </p>
          </div>
        </div>
      )}

      {showSliders && (
        <div className="mt-5 space-y-3">
          <GaugeSlider label="Age" value={chronoAge} min={25} max={80} onChange={onAgeChange} />
          <GaugeSlider label="Stress" value={stress} min={0} max={100} unit="%" onChange={onStressChange} />
          <GaugeSlider label="Sleep" value={sleep} min={0} max={100} unit="%" onChange={onSleepChange} />
          <GaugeSlider label="Exercise" value={exercise} min={0} max={100} unit="%" onChange={onExerciseChange} />
          {!scanned && onScan && (
            <button type="button" onClick={onScan} className="focus-ring btn-gradient w-full text-sm !py-3">
              <Scan className="w-4 h-4" aria-hidden="true" />
              Run defense scan
            </button>
          )}
          {scanned && (
            <Link href="/tools?tab=healthspan" className="focus-ring btn-ghost-premium w-full text-sm !py-3 justify-center">
              Full healthspan projection
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

function GaugeSlider({
  label,
  value,
  min,
  max,
  unit = '',
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  unit?: string;
  onChange?: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-caption">{label}</span>
        <span className="text-caption font-mono">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange?.(Number(e.target.value))}
        className="w-full age-slider"
        aria-label={label}
      />
    </div>
  );
}