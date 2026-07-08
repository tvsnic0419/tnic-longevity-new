'use client';

import type { HallmarkLibraryEntry } from '@/lib/types';
import { getHallmarkVisual } from '@/lib/hallmark-visuals';
import { HallmarkIcon } from './HallmarkIcon';

export function HallmarkVisual({
  visual,
  coverage,
  number,
}: {
  visual: HallmarkLibraryEntry['visual'];
  coverage: number;
  number: number;
}) {
  const meta = getHallmarkVisual(visual);
  const r = 70;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (coverage / 100) * circumference;

  return (
    <div className="relative w-full max-w-[280px] mx-auto">
      <svg viewBox="0 0 200 200" className="w-full" aria-label={`${meta.label} visual`}>
        <circle
          cx="100"
          cy="100"
          r={r}
          fill="none"
          stroke="var(--color-border-subtle)"
          strokeWidth="8"
        />
        <circle
          cx="100"
          cy="100"
          r={r}
          fill="none"
          stroke={meta.colorVar}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 100 100)"
          opacity="0.9"
        />
        <foreignObject x="76" y="72" width="48" height="48">
          <div className="flex items-center justify-center w-full h-full">
            <HallmarkIcon type={visual} size={36} ring={false} />
          </div>
        </foreignObject>
        <text x="100" y="118" textAnchor="middle" fill={meta.colorVar} fontSize="22" fontWeight="bold">
          {coverage}%
        </text>
        <text x="100" y="134" textAnchor="middle" fill="var(--color-text-faint)" fontSize="9" fontFamily="var(--font-mono)">
          TNiC COVERAGE
        </text>
        <text x="100" y="168" textAnchor="middle" fill="var(--color-text-faint)" fontSize="10">
          Hallmark {number}
        </text>
      </svg>
      <p className="text-center text-caption mt-2">{meta.label}</p>
    </div>
  );
}