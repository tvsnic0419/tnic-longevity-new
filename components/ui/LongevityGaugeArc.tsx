'use client';

import { useId, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface LongevityGaugeArcProps {
  score: number;
  /** Override stroke color for the arc — defaults to animated gradient */
  color?: string;
  label?: string;
  sublabel?: string;
  size?: number;
  /** Disable scroll-triggered animation (e.g. in expanded cards already in view) */
  immediate?: boolean;
  className?: string;
}

export function LongevityGaugeArc({
  score,
  color,
  label = 'LQ SCORE',
  sublabel,
  size = 160,
  immediate = false,
  className = '',
}: LongevityGaugeArcProps) {
  const uid = useId();
  const gradId = `lq-grad-${uid}`;
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const shouldDraw = immediate || inView;

  // Geometry
  const r = size * 0.39;
  const cx = size / 2;
  const cy = size * 0.57;         // slightly below center so the arc reads well
  const sw = size * 0.055;        // stroke width

  // Semicircular arc: left → right through the top
  const lx = cx - r, rx = cx + r; // left and right endpoints
  const arcPath = `M ${lx.toFixed(2)},${cy.toFixed(2)} A ${r.toFixed(2)},${r.toFixed(2)} 0 0,1 ${rx.toFixed(2)},${cy.toFixed(2)}`;

  // Tick marks at 25 / 50 / 75 %
  const ticks = [25, 50, 75];

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${size} ${(cy + sw * 0.6).toFixed(2)}`}
      className={`w-full ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="var(--accent-amber)"   />
          <stop offset="48%"  stopColor="var(--accent-cyan)"    />
          <stop offset="100%" stopColor="var(--accent-emerald)" />
        </linearGradient>
      </defs>

      {/* Background track */}
      <path
        d={arcPath}
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.09"
        strokeWidth={sw}
        strokeLinecap="round"
      />

      {/* Tick marks at 25 / 50 / 75 */}
      {ticks.map((pct) => {
        const angle = Math.PI * (1 - pct / 100); // π=left, 0=right
        const innerR = r - sw * 0.65;
        const outerR = r + sw * 0.45;
        const tx1 = cx + innerR * Math.cos(angle);
        const ty1 = cy - innerR * Math.sin(angle);
        const tx2 = cx + outerR * Math.cos(angle);
        const ty2 = cy - outerR * Math.sin(angle);
        return (
          <line
            key={pct}
            x1={tx1.toFixed(2)} y1={ty1.toFixed(2)}
            x2={tx2.toFixed(2)} y2={ty2.toFixed(2)}
            stroke="currentColor" strokeOpacity="0.18" strokeWidth="1"
          />
        );
      })}

      {/* Scale labels at 0 / 100 */}
      <text x={lx - 2} y={cy + 12} textAnchor="middle" fontSize={size * 0.062}
        fill="currentColor" fillOpacity="0.28" fontFamily="monospace">0</text>
      <text x={rx + 2} y={cy + 12} textAnchor="middle" fontSize={size * 0.062}
        fill="currentColor" fillOpacity="0.28" fontFamily="monospace">100</text>

      {/* Animated foreground arc */}
      <motion.path
        d={arcPath}
        fill="none"
        stroke={color ?? `url(#${gradId})`}
        strokeWidth={sw}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={shouldDraw ? { pathLength: score / 100 } : { pathLength: 0 }}
        transition={{ duration: 1.4, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Score value — large, centered */}
      <text
        x={cx} y={cy - r * 0.16}
        textAnchor="middle"
        fontSize={size * 0.175}
        fontWeight="800"
        fill={color ?? 'var(--accent-emerald)'}
        fontFamily="monospace"
      >
        {score.toFixed(1)}
      </text>

      {/* Primary label */}
      <text
        x={cx} y={cy - r * 0.16 + size * 0.09}
        textAnchor="middle"
        fontSize={size * 0.065}
        fill="currentColor" fillOpacity="0.38"
        fontFamily="monospace" letterSpacing="1.5"
      >
        {label}
      </text>

      {/* Sublabel (optional) */}
      {sublabel && (
        <text
          x={cx} y={cy - r * 0.16 + size * 0.165}
          textAnchor="middle"
          fontSize={size * 0.058}
          fill="currentColor" fillOpacity="0.25"
          fontFamily="monospace"
        >
          {sublabel}
        </text>
      )}
    </svg>
  );
}
