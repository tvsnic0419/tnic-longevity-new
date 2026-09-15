'use client';
import type { ReactElement } from 'react';

import { useId, useMemo } from 'react';
import type { ToolId } from '@/lib/registry';
import { VizGlow, VizAreaGradient, VizBarDepth } from '@/components/ui/vizDefs';
import { cn } from '@/lib/utils';

/**
 * Mini premium instrument previews for ToolsHub cards.
 * Shapes are educational/demo SVG derived from real tool roles —
 * not clinical readings. Labeled as such in aria + caption.
 */

const ACCENT: Record<ToolId, string> = {
  simulator: 'var(--accent-violet)',
  network: 'var(--accent-cyan)',
  protocol: 'var(--accent-emerald)',
  biomarker: 'var(--accent-amber)',
  impact: 'var(--accent-rose)',
  healthspan: 'var(--accent-emerald)',
  inventory: 'var(--accent-cyan)',
};

/** Deterministic demo series shaped like each tool's typical output. */
function demoSeries(id: ToolId): number[] {
  switch (id) {
    case 'simulator':
      return [42, 55, 48, 68, 72, 81];
    case 'network':
      return [30, 45, 38, 60, 52, 70];
    case 'protocol':
      return [55, 62, 70, 78, 74, 88];
    case 'biomarker':
      return [64, 61, 58, 55, 52, 49];
    case 'impact':
      return [88, 76, 64, 58, 45, 38];
    case 'healthspan':
      return [48, 52, 58, 63, 68, 74];
    case 'inventory':
      return [90, 78, 66, 54, 42, 30];
  }
}

function SparkInstrument({ color, values }: { color: string; values: number[] }) {
  const uid = useId().replace(/:/g, '');
  const glowId = `tip-glow-${uid}`;
  const areaId = `tip-area-${uid}`;
  const w = 120;
  const h = 44;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const span = max - min || 1;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * (w - 8) + 4;
    const y = h - 6 - ((v - min) / span) * (h - 14);
    return { x, y };
  });
  const line = pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const area =
    `M ${pts[0].x.toFixed(1)},${(h - 4).toFixed(1)} ` +
    pts.map((p) => `L ${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') +
    ` L ${pts[pts.length - 1].x.toFixed(1)},${(h - 4).toFixed(1)} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-11" aria-hidden="true">
      <defs>
        <VizGlow id={glowId} blur={2} />
        <VizAreaGradient id={areaId} color={color} topOpacity={0.35} />
      </defs>
      <path d={area} fill={`url(#${areaId})`} />
      <polyline
        points={line}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
        filter={`url(#${glowId})`}
      />
      <circle
        cx={pts[pts.length - 1].x}
        cy={pts[pts.length - 1].y}
        r={3}
        fill={color}
        filter={`url(#${glowId})`}
      />
    </svg>
  );
}

function GaugeInstrument({ color, value }: { color: string; value: number }) {
  const uid = useId().replace(/:/g, '');
  const glowId = `tip-g-${uid}`;
  const r = 28;
  const cx = 40;
  const cy = 36;
  const start = Math.PI * 0.85;
  const end = Math.PI * 0.15;
  const t = Math.max(0, Math.min(1, value / 100));
  const angle = start + (end - start + 2 * Math.PI) * t;
  const arc = (a0: number, a1: number) => {
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const large = a1 - a0 > Math.PI ? 1 : 0;
    return `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1}`;
  };
  // Sweep from start toward end through the bottom of the semicircle.
  const sweepEnd = start + (2 * Math.PI - (start - end)) * t;

  return (
    <svg viewBox="0 0 80 52" className="w-full h-12" aria-hidden="true">
      <defs>
        <VizGlow id={glowId} blur={2.2} />
      </defs>
      <path
        d={arc(start, end + 2 * Math.PI)}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.12}
        strokeWidth={7}
        strokeLinecap="round"
      />
      <path
        d={arc(start, sweepEnd)}
        fill="none"
        stroke={color}
        strokeWidth={7}
        strokeLinecap="round"
        filter={`url(#${glowId})`}
      />
      <circle
        cx={cx + r * Math.cos(sweepEnd)}
        cy={cy + r * Math.sin(sweepEnd)}
        r={3.5}
        fill={color}
        filter={`url(#${glowId})`}
      />
      <text
        x={cx}
        y={cy + 6}
        textAnchor="middle"
        fill={color}
        fontSize="11"
        fontFamily="var(--font-mono)"
        fontWeight="700"
      >
        {Math.round(value)}
      </text>
    </svg>
  );
}

function DepthBarsInstrument({ color, values }: { color: string; values: number[] }) {
  const uid = useId().replace(/:/g, '');
  const top = values.slice(0, 5);
  const max = Math.max(...top, 1);
  return (
    <svg viewBox="0 0 120 44" className="w-full h-11" aria-hidden="true">
      <defs>
        {top.map((_, i) => (
          <VizBarDepth key={i} id={`tip-bar-${uid}-${i}`} color={color} />
        ))}
        <VizGlow id={`tip-bar-glow-${uid}`} blur={1.6} />
      </defs>
      {top.map((v, i) => {
        const barH = Math.max(4, (v / max) * 32);
        const x = 8 + i * 22;
        const y = 40 - barH;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={14}
            height={barH}
            rx={3}
            fill={`url(#tip-bar-${uid}-${i})`}
            filter={`url(#tip-bar-glow-${uid})`}
          />
        );
      })}
    </svg>
  );
}

function NetworkInstrument({ color }: { color: string }) {
  const uid = useId().replace(/:/g, '');
  const glowId = `tip-net-${uid}`;
  const nodes = [
    { x: 20, y: 22 },
    { x: 55, y: 10 },
    { x: 90, y: 18 },
    { x: 48, y: 34 },
    { x: 78, y: 36 },
  ];
  const edges: [number, number][] = [
    [0, 1],
    [1, 2],
    [0, 3],
    [1, 3],
    [1, 4],
    [2, 4],
    [3, 4],
  ];
  return (
    <svg viewBox="0 0 110 46" className="w-full h-11" aria-hidden="true">
      <defs>
        <VizGlow id={glowId} blur={2} />
      </defs>
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke={color}
          strokeOpacity={0.35}
          strokeWidth={1.25}
        />
      ))}
      {nodes.map((n, i) => (
        <circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={i === 1 ? 5 : 3.5}
          fill={color}
          filter={i === 1 ? `url(#${glowId})` : undefined}
          opacity={i === 1 ? 1 : 0.75}
        />
      ))}
    </svg>
  );
}

const CAPTION: Record<ToolId, string> = {
  simulator: 'Demo synergy spark',
  network: 'Demo conflict graph',
  protocol: 'Demo priority gauge',
  biomarker: 'Demo trend spark',
  impact: 'Demo impact bars',
  healthspan: 'Demo projection spark',
  inventory: 'Demo supply bars',
};

export function ToolInstrumentPreview({
  toolId,
  className,
}: {
  toolId: ToolId;
  className?: string;
}) {
  const color = ACCENT[toolId];
  const series = useMemo(() => demoSeries(toolId), [toolId]);
  const peak = series[series.length - 1] ?? 50;

  let body: ReactElement;
  switch (toolId) {
    case 'network':
      body = <NetworkInstrument color={color} />;
      break;
    case 'protocol':
    case 'simulator':
      body = <GaugeInstrument color={color} value={peak} />;
      break;
    case 'impact':
    case 'inventory':
      body = <DepthBarsInstrument color={color} values={series} />;
      break;
    default:
      body = <SparkInstrument color={color} values={series} />;
  }

  return (
    <div
      className={cn(
        'tool-instrument-preview relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-white/[0.04] to-transparent p-2.5',
        className,
      )}
      aria-label={`${CAPTION[toolId]} — educational preview, not a clinical reading`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-3 top-1.5 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
      />
      {body}
      <p className="mt-1 text-[10px] font-mono uppercase tracking-[0.12em] text-muted-foreground/80">
        {CAPTION[toolId]} · demo
      </p>
    </div>
  );
}
