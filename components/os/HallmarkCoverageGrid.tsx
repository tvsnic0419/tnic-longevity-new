'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { HallmarkIcon } from '@/components/library/HallmarkIcon';
import { hallmarkLibrary } from '@/lib/hallmarks-library';
import { getHallmarkVisual } from '@/lib/hallmark-visuals';
import { themes } from '@/lib/design-system';
import { compounds } from '@/lib/data';
import { cn } from '@/lib/utils';

interface HallmarkCoverageGridProps {
  coveredIds: string[];
  className?: string;
}

const TOTAL = 12;

function CoverageSegmentRing({
  coveredIds,
  size = 120,
}: {
  coveredIds: Set<string>;
  size?: number;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const outer = size / 2 - 4;
  const inner = outer - 14;
  const coveredCount = hallmarkLibrary.filter((h) => coveredIds.has(h.id)).length;
  const pct = Math.round((coveredCount / TOTAL) * 100);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute inset-0">
        <defs>
          <linearGradient id="coverage-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent-cyan)" />
            <stop offset="50%" stopColor="var(--accent-emerald)" />
            <stop offset="100%" stopColor="var(--accent-violet)" />
          </linearGradient>
        </defs>
        {hallmarkLibrary.map((h, i) => {
          const startAngle = (i / TOTAL) * 360 - 90;
          const endAngle = ((i + 1) / TOTAL) * 360 - 90;
          const covered = coveredIds.has(h.id);
          const meta = getHallmarkVisual(h.visual);
          const toRad = (deg: number) => (deg * Math.PI) / 180;
          const x1 = cx + outer * Math.cos(toRad(startAngle));
          const y1 = cy + outer * Math.sin(toRad(startAngle));
          const x2 = cx + outer * Math.cos(toRad(endAngle));
          const y2 = cy + outer * Math.sin(toRad(endAngle));
          const x3 = cx + inner * Math.cos(toRad(endAngle));
          const y3 = cy + inner * Math.sin(toRad(endAngle));
          const x4 = cx + inner * Math.cos(toRad(startAngle));
          const y4 = cy + inner * Math.sin(toRad(startAngle));
          const largeArc = endAngle - startAngle > 180 ? 1 : 0;

          return (
            <path
              key={h.id}
              d={`M ${x1} ${y1} A ${outer} ${outer} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${inner} ${inner} 0 ${largeArc} 0 ${x4} ${y4} Z`}
              fill={covered ? meta.colorVar : 'transparent'}
              stroke={covered ? meta.colorVar : 'var(--border)'}
              strokeWidth={covered ? 0 : 1}
              opacity={covered ? 0.85 : 0.25}
              className="transition-opacity duration-300"
            />
          );
        })}
        <circle
          cx={cx}
          cy={cy}
          r={inner - 6}
          fill="none"
          stroke="url(#coverage-ring-grad)"
          strokeWidth="1"
          opacity="0.2"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold font-mono tabular-nums bg-gradient-to-br from-accent-cyan via-accent-emerald to-accent-violet bg-clip-text text-transparent">
          {pct}%
        </span>
        <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">
          {coveredCount}/{TOTAL}
        </span>
      </div>
    </div>
  );
}

function HallmarkCell({
  covered,
  number,
  title,
  slug,
  visual,
  suggestLabel,
  index,
  reducedMotion,
}: {
  covered: boolean;
  number: number;
  title: string;
  slug: string;
  visual: (typeof hallmarkLibrary)[0]['visual'];
  suggestLabel?: string;
  index: number;
  reducedMotion: boolean;
}) {
  const meta = getHallmarkVisual(visual);
  const theme = themes[meta.theme];

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: reducedMotion ? 0 : index * 0.04, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/library/${slug}`}
        className={cn(
          'group focus-ring interactive relative flex flex-col h-full min-h-[132px] rounded-2xl overflow-hidden transition-all duration-300',
          covered
            ? cn('border', theme.border, theme.bg)
            : 'border border-dashed border-border/80 bg-muted/15 hover:border-accent-cyan/40 hover:bg-muted/25',
        )}
        style={
          covered
            ? ({ '--cell-glow': meta.colorVar } as React.CSSProperties)
            : undefined
        }
        aria-label={`${title}${covered ? ' — covered by your stack' : ' — gap in coverage'}`}
      >
        {covered && (
          <div
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(ellipse 80% 60% at 50% 0%, color-mix(in srgb, var(--cell-glow) 22%, transparent), transparent 70%)`,
            }}
          />
        )}

        <div className="relative p-3.5 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-2 mb-2">
            <span
              className={cn(
                'text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md border',
                covered ? cn(theme.text, theme.border, theme.bg) : 'text-muted-foreground border-border',
              )}
            >
              H{number}
            </span>
            {covered ? (
              <span
                className={cn(
                  'flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold',
                  theme.bgSolid,
                  'text-primary-foreground shadow-sm',
                )}
                aria-hidden="true"
              >
                ✓
              </span>
            ) : (
              <span className="text-[10px] font-mono text-muted-foreground opacity-60">—</span>
            )}
          </div>

          <div className="flex items-center gap-2.5 mb-2">
            <div
              className={cn(
                'relative rounded-xl p-1.5 transition-transform duration-300 group-hover:scale-105',
                covered ? theme.bg : 'bg-muted/30 opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-80',
              )}
            >
              {covered && (
                <span
                  className="absolute inset-0 rounded-xl blur-md opacity-40"
                  style={{ background: meta.colorVar }}
                  aria-hidden="true"
                />
              )}
              <HallmarkIcon type={visual} size={28} ring={covered} className="relative" />
            </div>
          </div>

          <p
            className={cn(
              'text-xs font-semibold leading-snug line-clamp-2 flex-1',
              covered ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground/90',
            )}
          >
            {title}
          </p>

          {!covered && suggestLabel && (
            <p className={cn('text-[10px] font-mono mt-2 truncate', theme.text, 'opacity-80')}>
              + {suggestLabel}
            </p>
          )}

          {covered && (
            <p className={cn('text-[9px] font-mono mt-2 opacity-0 group-hover:opacity-100 transition-opacity', theme.text)}>
              Active in stack →
            </p>
          )}
        </div>

        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left',
            covered ? theme.bgSolid : 'bg-accent-cyan/50',
          )}
          aria-hidden="true"
        />
      </Link>
    </motion.div>
  );
}

export function HallmarkCoverageGrid({ coveredIds, className }: HallmarkCoverageGridProps) {
  const coveredSet = new Set(coveredIds);
  const reducedMotion = useReducedMotion() ?? false;
  const coveredCount = hallmarkLibrary.filter((h) => coveredSet.has(h.id)).length;
  const gaps = hallmarkLibrary.filter((h) => !coveredSet.has(h.id));

  return (
    <section className={cn('relative', className)} aria-labelledby="hallmark-coverage-heading">
      <div
        className="pointer-events-none absolute -inset-4 rounded-3xl opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 0%, color-mix(in srgb, var(--accent-violet) 12%, transparent), transparent 65%)',
        }}
        aria-hidden="true"
      />

      <div className="relative gradient-border rounded-2xl p-5 md:p-7">
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-7">
          <CoverageSegmentRing coveredIds={coveredSet} size={128} />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-accent-violet shrink-0" aria-hidden="true" />
              <h3 id="hallmark-coverage-heading" className="heading-card text-lg md:text-xl">
                Hallmark coverage map
              </h3>
            </div>
            <p className="text-body-sm text-muted-foreground max-w-xl">
              Twelve aging hallmarks from López-Otín — lit segments show what your stack addresses.
              {gaps.length > 0
                ? ` ${gaps.length} gap${gaps.length === 1 ? '' : 's'} remain.`
                : ' Full-spectrum coverage.'}
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1 rounded-full border border-accent-emerald/30 bg-accent-emerald/10 text-accent-emerald">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald" />
                {coveredCount} active
              </span>
              {gaps.length > 0 && (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1 rounded-full border border-border bg-muted/30 text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                  {gaps.length} open
                </span>
              )}
              {gaps.length > 0 && (
                <Link
                  href="/stacks"
                  className="inline-flex items-center gap-1 text-[10px] font-semibold text-accent-violet hover:text-accent-cyan focus-ring rounded-full px-2.5 py-1 transition-colors"
                >
                  Close gaps
                  <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </Link>
              )}
            </div>
          </div>
        </div>

        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-3"
          role="list"
          aria-label="Twelve hallmarks of aging"
        >
          {hallmarkLibrary.map((h, i) => {
            const covered = coveredSet.has(h.id);
            const suggestCompound = !covered
              ? compounds.find((c) => h.relatedCompoundIds.includes(c.id))
              : null;

            return (
              <div key={h.id} role="listitem">
                <HallmarkCell
                  covered={covered}
                  number={h.number}
                  title={h.title}
                  slug={h.slug}
                  visual={h.visual}
                  suggestLabel={suggestCompound?.name.split(' ')[0]}
                  index={i}
                  reducedMotion={reducedMotion}
                />
              </div>
            );
          })}
        </div>

        {gaps.length > 0 && (
          <p className="text-caption text-muted-foreground mt-5 pt-4 border-t border-border/60">
            Lifestyle foundations (sleep, Zone 2) address multiple open hallmarks before adding
            compounds — tap any cell to read the evidence guide.
          </p>
        )}
      </div>
    </section>
  );
}