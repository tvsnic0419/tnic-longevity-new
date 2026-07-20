'use client';

import { CartesianGrid } from 'recharts';

/**
 * Shared chart aesthetics so every recharts surface on the site reads as one
 * system: clean axes (no heavy axis/tick lines), a subtle dashed horizontal
 * grid, and one branded glassy tooltip. Import these instead of restyling each
 * chart inline.
 */

export const axisTick = {
  fill: 'var(--color-text-muted)',
  fontSize: 10,
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
export const chartCursor = { stroke: 'var(--accent-cyan)', strokeOpacity: 0.3, strokeWidth: 1 } as const;

/** Hover cursor fill for bar charts. */
export const barCursor = { fill: 'var(--accent-cyan)', fillOpacity: 0.06 } as const;

/* Branded tooltip styling for charts that rely on recharts `formatter` /
   `labelFormatter` (where a custom content component can't be used). Matches
   the <ChartTooltip> look so every tooltip on the site is identical. */
export const tooltipContentStyle = {
  background: 'rgba(8, 15, 28, 0.94)',
  border: '1px solid rgba(0, 224, 255, 0.22)',
  borderRadius: 12,
  padding: '10px 12px',
  boxShadow: '0 14px 34px -14px rgba(0, 0, 0, 0.7)',
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
} as const;

export const tooltipItemStyle = { color: 'var(--color-text-secondary)', padding: 0 } as const;

export const tooltipLabelStyle = {
  color: 'var(--color-text-muted)',
  fontSize: 9.5,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: 4,
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
        background: 'rgba(8, 15, 28, 0.94)',
        border: '1px solid rgba(0, 224, 255, 0.22)',
        borderRadius: 12,
        padding: '10px 12px',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: '0 14px 34px -14px rgba(0, 0, 0, 0.7)',
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        minWidth: 120,
      }}
    >
      {label != null && label !== '' && (
        <div
          style={{
            color: 'var(--color-text-muted)',
            marginBottom: 6,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            fontSize: 9.5,
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
              width: 8,
              height: 8,
              borderRadius: 9999,
              background: p.color || p.stroke || 'var(--accent-cyan)',
              flexShrink: 0,
              boxShadow: `0 0 8px ${p.color || p.stroke || 'var(--accent-cyan)'}`,
            }}
          />
          <span style={{ color: 'var(--color-text-secondary)' }}>{p.name}</span>
          <span style={{ marginLeft: 'auto', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            {p.value}
            {p.unit ?? ''}
          </span>
        </div>
      ))}
    </div>
  );
}
