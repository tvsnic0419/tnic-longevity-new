'use client';

import { biomarkers } from '@/lib/data';
import { getLabStatus, parseOptimalRange, type LabEntry } from '@/lib/labs';

interface MarkerChartProps {
  markerId: string;
  entries: LabEntry[];
  height?: number;
}

export function MarkerChart({ markerId, entries, height = 120 }: MarkerChartProps) {
  const b = biomarkers.find((x) => x.id === markerId);
  const sorted = entries
    .filter((e) => e.markerId === markerId)
    .sort((a, b) => a.date.localeCompare(b.date));

  if (sorted.length < 2 || !b) {
    return (
      <div className="h-[120px] flex items-center justify-center text-xs text-caption">
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

  const toX = (i: number) => pad + (i / (sorted.length - 1)) * (w - pad * 2);
  const toY = (v: number) => pad + chartH - ((v - minV) / span) * chartH;

  const points = sorted.map((e, i) => `${toX(i)},${toY(e.value)}`).join(' ');
  const latest = sorted[sorted.length - 1];
  const status = getLabStatus(markerId, latest.value);

  const statusStroke = {
    optimal: '#34d399',
    watch: '#fbbf24',
    critical: '#fb7185',
  }[status];

  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" aria-label={`${b.name} trend chart`}>
      {range && (
        <rect
          x={pad}
          y={toY(range.max)}
          width={w - pad * 2}
          height={Math.max(2, toY(range.min) - toY(range.max))}
          fill="rgba(52,211,153,0.08)"
          rx={2}
        />
      )}
      <polyline
        points={points}
        fill="none"
        stroke={statusStroke}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      {sorted.map((e, i) => (
        <circle key={e.id} cx={toX(i)} cy={toY(e.value)} r={3} fill={statusStroke} />
      ))}
    </svg>
  );
}