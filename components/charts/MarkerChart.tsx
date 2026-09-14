'use client';

import { useId, useEffect, useState } from 'react';
import { biomarkers } from '@/lib/data';
import { getLabStatus, parseOptimalRange, type LabEntry } from '@/lib/labs';
import { VizGlow, VizAreaGradient, VizBarDepth, VizBarSpecular, VizBarGroundShadow } from '@/components/ui/vizDefs';

interface MarkerChartProps {
  markerId: string;
  entries: LabEntry[];
  height?: number;
}

/**
 * Lab marker instrument — trend polyline with volumetric latest-value column.
 * Depth fills inherit from vizDefs so every chart shares one luminous system.
 * prefers-reduced-motion collapses the column to a flat fill.
 */
export function MarkerChart({ markerId, entries, height = 120 }: MarkerChartProps) {
  const uid = useId();
  const glowId = `mc-glow-${uid}`;
  const areaId = `mc-area-${uid}`;
  const barId = `mc-bar-${uid}`;
  const specId = `mc-spec-${uid}`;
  const groundId = `mc-ground-${uid}`;
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const b = biomarkers.find((x) => x.id === markerId);
  const sorted = entries
    .filter((e) => e.markerId === markerId)
    .sort((a, b) => a.date.localeCompare(b.date));

  if (sorted.length < 2 || !b) {
    return (
      <div className="h-[120px] flex items-center justify-center text-caption text-muted-foreground">
        Log 2+ readings to see trend
      </div>
    );
  }

  const values = sorted.map((e) => e.value);
  const range = parseOptimalRange(b.optimal);
  const allVals = [...values, ...(range ? [range.min, range.max] : [])];
  const minV = Math.min(...allVals) * 0.9;
  const maxV = Math.max(...allVals) * 1.1;
  const span = maxV - minV || 1;

  const w = 280;
  const pad = 12;
  const chartH = height - pad * 2;
  const barZone = 36;
  const plotW = w - pad * 2 - barZone;

  const toX = (i: number) => pad + (i / (sorted.length - 1)) * plotW;
  const toY = (v: number) => pad + chartH - ((v - minV) / span) * chartH;

  const points = sorted.map((e, i) => `${toX(i)},${toY(e.value)}`).join(' ');
  const latest = sorted[sorted.length - 1];
  const status = getLabStatus(markerId, latest.value);

  const statusStroke = {
    optimal: 'var(--status-optimal)',
    watch: 'var(--status-watch)',
    critical: 'var(--status-critical)',
  }[status];

  const baseY = pad + chartH;
  const areaPath =
    `M ${toX(0).toFixed(2)},${baseY.toFixed(2)} ` +
    sorted.map((e, i) => `L ${toX(i).toFixed(2)},${toY(e.value).toFixed(2)}`).join(' ') +
    ` L ${toX(sorted.length - 1).toFixed(2)},${baseY.toFixed(2)} Z`;

  const barX = w - pad - 22;
  const barW = 14;
  const barTop = toY(latest.value);
  const barH = Math.max(4, baseY - barTop);

  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" aria-label={`${b.name} trend chart`}>
      <defs>
        <VizGlow id={glowId} blur={2.4} />
        <VizAreaGradient id={areaId} color={statusStroke} topOpacity={0.32} />
        <VizBarDepth id={barId} color={statusStroke} />
        <VizBarSpecular id={specId} />
        <VizBarGroundShadow id={groundId} />
      </defs>

      {/* Micro-grid ticks — instrument chrome */}
      {[0.25, 0.5, 0.75].map((t) => {
        const y = pad + chartH * (1 - t);
        return (
          <line
            key={t}
            x1={pad}
            y1={y}
            x2={pad + plotW}
            y2={y}
            stroke="var(--color-border-subtle)"
            strokeOpacity={0.55}
            strokeDasharray="2 4"
          />
        );
      })}

      {range && (
        <rect
          x={pad}
          y={toY(range.max)}
          width={plotW}
          height={Math.max(2, toY(range.min) - toY(range.max))}
          fill="var(--status-optimal)"
          fillOpacity={0.1}
          rx={3}
        />
      )}
      <path d={areaPath} fill={`url(#${areaId})`} stroke="none" />
      <polyline
        points={points}
        fill="none"
        stroke={statusStroke}
        strokeWidth={2.25}
        strokeLinejoin="round"
        strokeLinecap="round"
        filter={`url(#${glowId})`}
      />
      {sorted.map((e, i) => {
        const isLatest = i === sorted.length - 1;
        return (
          <circle
            key={e.id}
            cx={toX(i)}
            cy={toY(e.value)}
            r={isLatest ? 4.5 : 2.5}
            fill={statusStroke}
            filter={isLatest ? `url(#${glowId})` : undefined}
          />
        );
      })}

      {/* Volumetric latest-value column — grounds the reading as an instrument */}
      <ellipse
        cx={barX + barW / 2}
        cy={baseY + 1}
        rx={barW * 0.85}
        ry={3.5}
        fill={`url(#${groundId})`}
        opacity={reduceMotion ? 0.25 : 0.7}
      />
      <rect
        x={barX}
        y={barTop}
        width={barW}
        height={barH}
        rx={3}
        fill={reduceMotion ? statusStroke : `url(#${barId})`}
        filter={reduceMotion ? undefined : `url(#${glowId})`}
      />
      {!reduceMotion && (
        <rect
          x={barX}
          y={barTop}
          width={Math.max(3, barW * 0.35)}
          height={barH}
          rx={2}
          fill={`url(#${specId})`}
          style={{ pointerEvents: 'none' }}
        />
      )}
      {/* Top specular cap */}
      <rect
        x={barX + 1}
        y={barTop}
        width={barW - 2}
        height={2.5}
        rx={1}
        fill="#ffffff"
        fillOpacity={reduceMotion ? 0.15 : 0.45}
      />
    </svg>
  );
}
