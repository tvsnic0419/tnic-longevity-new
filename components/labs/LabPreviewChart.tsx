/**
 * Static illustrative preview of what a logged biomarker trend looks like —
 * shown on the Labs hub before the visitor has entered any real readings.
 * Not wired to platform state on purpose: it's a promise of the feature, not
 * a chart of anything real, so the numbers never need to reconcile with
 * MarkerChart's live-data rendering.
 */

const MOCK_POINTS = [
  { label: 'Baseline', value: 4.8 },
  { label: 'Wk 4', value: 4.1 },
  { label: 'Wk 8', value: 3.2 },
  { label: 'Wk 12', value: 2.1 },
  { label: 'Wk 16', value: 1.4 },
  { label: 'Wk 20', value: 0.9 },
];

const OPTIMAL_MAX = 1.5;

export function LabPreviewChart() {
  const w = 400;
  const h = 140;
  const pad = 16;
  const chartH = h - pad * 2;

  const values = MOCK_POINTS.map((p) => p.value);
  const minV = 0;
  const maxV = Math.max(...values, OPTIMAL_MAX) * 1.15;
  const span = maxV - minV || 1;

  const toX = (i: number) => pad + (i / (MOCK_POINTS.length - 1)) * (w - pad * 2);
  const toY = (v: number) => pad + chartH - ((v - minV) / span) * chartH;

  const points = MOCK_POINTS.map((p, i) => `${toX(i)},${toY(p.value)}`).join(' ');
  const zoneTop = toY(OPTIMAL_MAX);

  return (
    <div className="rounded-2xl glass p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-label text-accent-rose">Example: hs-CRP trend</p>
        <span className="text-caption">Preview — log a lab to see your own</span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" aria-hidden="true" role="presentation">
        <rect
          x={pad}
          y={zoneTop}
          width={w - pad * 2}
          height={Math.max(2, h - pad - zoneTop)}
          fill="var(--accent-emerald)"
          fillOpacity={0.08}
          rx={2}
        />
        <text x={w - pad} y={zoneTop - 5} textAnchor="end" className="fill-accent-emerald" fontSize={9} fontFamily="var(--font-geist-mono)">
          optimal zone
        </text>
        <polyline points={points} fill="none" stroke="var(--accent-rose)" strokeWidth={2} strokeLinejoin="round" />
        {MOCK_POINTS.map((p, i) => (
          <circle
            key={p.label}
            cx={toX(i)}
            cy={toY(p.value)}
            r={3}
            fill={p.value <= OPTIMAL_MAX ? 'var(--accent-emerald)' : 'var(--accent-rose)'}
          />
        ))}
      </svg>
      <div className="flex justify-between mt-1">
        {MOCK_POINTS.map((p) => (
          <span key={p.label} className="text-[9px] font-mono text-muted-foreground">
            {p.label}
          </span>
        ))}
      </div>
    </div>
  );
}
