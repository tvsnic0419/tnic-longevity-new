'use client';

import { CartesianGrid } from 'recharts';

/**
 * Shared chart aesthetics — one luminous instrument system across the site.
 * Depth bars, glassy tooltips, clean axes. Import these instead of restyling
 * each chart inline.
 */

export const axisTick = {
  fill: 'var(--color-text-muted)',
  fontSize: 12,
  fontFamily: 'var(--font-mono)',
} as const;

/** Spread into <XAxis>/<YAxis> — keeps dataKey/domain/orientation/width local. */
export const axisProps = {
  tick: axisTick,
  axisLine: false,
  tickLine: false,
} as const;

/** Subtle dashed horizontal grid — declutters vs. a full solid grid. */
export function ChartGrid() {
  return (
    <CartesianGrid
      strokeDasharray="3 3"
      stroke="var(--color-border-subtle)"
      strokeOpacity={0.45}
      vertical={false}
    />
  );
}

/** Hover cursor line for line/area charts. */
export const chartCursor = {
  stroke: 'var(--accent-cyan)',
  strokeOpacity: 0.3,
  strokeWidth: 1,
} as const;

/** Hover cursor fill for bar charts. */
export const barCursor = { fill: 'var(--accent-cyan)', fillOpacity: 0.08 } as const;

/**
 * Active dot for <Line>/<Area> — a larger point ringed in the surface color so
 * the hovered value lifts crisply off the line.
 */
export const chartActiveDot = {
  r: 5,
  strokeWidth: 2,
  stroke: 'var(--color-bg-elevated)',
} as const;

/**
 * Vertical area-fill gradient for recharts <Area>.
 */
export function ChartAreaGradient({
  id,
  color = 'var(--accent-cyan)',
  topOpacity = 0.28,
}: {
  id: string;
  color?: string;
  topOpacity?: number;
}) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={color} stopOpacity={topOpacity} />
      <stop offset="55%" stopColor={color} stopOpacity={topOpacity * 0.35} />
      <stop offset="100%" stopColor={color} stopOpacity={0} />
    </linearGradient>
  );
}

/**
 * Volumetric column fill — light from the upper-left, darker body, luminous
 * top lip. Reference as `fill={`url(#${id})`}` on a <Bar>/<Cell>.
 * Pair with ChartBarSideHighlight for a 3D instrument reading.
 */
export function ChartDepthBarGradient({
  id,
  color = 'var(--accent-cyan)',
}: {
  id: string;
  color?: string;
}) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#ffffff" stopOpacity={0.42} />
      <stop offset="12%" stopColor={color} stopOpacity={1} />
      <stop offset="55%" stopColor={color} stopOpacity={0.92} />
      <stop offset="100%" stopColor={color} stopOpacity={0.55} />
    </linearGradient>
  );
}

/** Soft horizontal sheen across a column — sells depth without fake perspective. */
export function ChartBarSideHighlight({
  id,
  color = 'var(--accent-cyan)',
}: {
  id: string;
  color?: string;
}) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#ffffff" stopOpacity={0.28} />
      <stop offset="35%" stopColor={color} stopOpacity={0} />
      <stop offset="100%" stopColor="#000000" stopOpacity={0.22} />
    </linearGradient>
  );
}

/** Drop both depth defs for a named series (e.g. score → score-depth + score-side). */
export function ChartDepthBarDefs({
  id,
  color = 'var(--accent-cyan)',
}: {
  id: string;
  color?: string;
}) {
  return (
    <>
      <ChartDepthBarGradient id={`${id}-depth`} color={color} />
      <ChartBarSideHighlight id={`${id}-side`} color={color} />
      <filter id={`${id}-glow`} x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="2.2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </>
  );
}

export const tooltipContentStyle = {
  background: 'rgba(8, 15, 28, 0.96)',
  border: '1px solid rgba(0, 224, 255, 0.28)',
  borderRadius: 14,
  padding: '12px 14px',
  boxShadow:
    '0 18px 40px -16px rgba(0, 0, 0, 0.75), inset 0 1px 0 rgba(255,255,255,0.06)',
  fontFamily: 'var(--font-mono)',
  fontSize: 12,
} as const;

export const tooltipItemStyle = { color: 'var(--color-text-secondary)', padding: 0 } as const;

export const tooltipLabelStyle = {
  color: 'var(--color-text-muted)',
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: 6,
} as const;

interface TooltipPayloadItem {
  name?: string;
  value?: number | string;
  color?: string;
  stroke?: string;
  unit?: string;
}

/** Branded, glassy tooltip. Pass as `content={<ChartTooltip />}` on <Tooltip>. */
export function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string | number;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div
      style={{
        background: 'rgba(8, 15, 28, 0.96)',
        border: '1px solid rgba(0, 224, 255, 0.28)',
        borderRadius: 14,
        padding: '12px 14px',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow:
          '0 18px 40px -16px rgba(0, 0, 0, 0.75), inset 0 1px 0 rgba(255,255,255,0.06)',
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        minWidth: 132,
      }}
    >
      {label != null && label !== '' && (
        <div
          style={{
            color: 'var(--color-text-muted)',
            marginBottom: 8,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontSize: 11,
          }}
        >
          {label}
        </div>
      )}
      {payload.map((p, i) => (
        <div
          key={i}
          style={{ display: 'flex', alignItems: 'center', gap: 8, lineHeight: 1.6 }}
        >
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: 9999,
              background: p.color || p.stroke || 'var(--accent-cyan)',
              flexShrink: 0,
              boxShadow: `0 0 10px ${p.color || p.stroke || 'var(--accent-cyan)'}`,
            }}
          />
          <span style={{ color: 'var(--color-text-secondary)' }}>{p.name}</span>
          <span
            style={{
              marginLeft: 'auto',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {p.value}
            {p.unit ?? ''}
          </span>
        </div>
      ))}
    </div>
  );
}
