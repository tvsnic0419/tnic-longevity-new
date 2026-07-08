'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// ── SVG coordinate system ───────────────────────────────────────────────────
const W = 880, H = 340;
const PL = 60, PR = 76, PT = 32, PB = 48;
const X0 = PL;                  // 60
const X1 = W - PR;              // 804
const Y0 = PT;                  // 32
const Y1 = H - PB;              // 292

// Map year [0..10] → SVG x
function tx(year: number) { return X0 + (year / 10) * (X1 - X0); }
// Map biological age [44..60] → SVG y (inverted: higher age = lower on screen = larger SVG y)
function ty(age: number) { return Y1 - ((age - 44) / 16) * (Y1 - Y0); }
function f(n: number) { return n.toFixed(2); }

// ── Static path data ────────────────────────────────────────────────────────
// Standard trajectory: unoptimized aging, age 45 → 58 over 10 years
const STD_PATH =
  `M ${f(tx(0))},${f(ty(45))}` +
  ` C ${f(tx(3))},${f(ty(48))}` +
  ` ${f(tx(6.5))},${f(ty(53))}` +
  ` ${f(tx(10))},${f(ty(58))}`;

// Optimized trajectory: with full TNiC stack, age 45 → 48 over 10 years
const OPT_PATH =
  `M ${f(tx(0))},${f(ty(45))}` +
  ` C ${f(tx(3))},${f(ty(45.5))}` +
  ` ${f(tx(7))},${f(ty(46.6))}` +
  ` ${f(tx(10))},${f(ty(48))}`;

// Filled area between the two curves (standard forward + optimized reversed)
const AREA_PATH =
  `${STD_PATH}` +
  ` L ${f(tx(10))},${f(ty(48))}` +
  ` C ${f(tx(7))},${f(ty(46.6))}` +
  ` ${f(tx(3))},${f(ty(45.5))}` +
  ` ${f(tx(0))},${f(ty(45))} Z`;

const GRID_AGES  = [46, 48, 50, 52, 54, 56, 58];
const GRID_YEARS = [0, 2, 4, 6, 8, 10];

// Year 1 milestone on optimized line (visual approximation of 90-day signal zone)
const MILESTONE_X = tx(1);
const MILESTONE_Y = ty(45.2);

interface BiologicalAgeChartProps {
  className?: string;
}

export function BiologicalAgeChart({ className = '' }: BiologicalAgeChartProps) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <figure
      className={`relative ${className}`}
      role="img"
      aria-label="Biological age projection: optimized TNiC stack vs no protocol over 10 years"
    >
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ overflow: 'visible' }}
        aria-hidden="true"
      >
        <defs>
          {/* Area fill — subtle green gradient */}
          <linearGradient id="bio-area-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent-emerald)" stopOpacity="0.20" />
            <stop offset="100%" stopColor="var(--accent-emerald)" stopOpacity="0.03" />
          </linearGradient>
          {/* Standard line — amber → rose */}
          <linearGradient id="bio-std-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--accent-amber)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--accent-rose)" />
          </linearGradient>
          {/* Optimized line — cyan → emerald */}
          <linearGradient id="bio-opt-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--accent-cyan)" />
            <stop offset="100%" stopColor="var(--accent-emerald)" />
          </linearGradient>
        </defs>

        {/* ── Grid ─────────────────────────────────────────────────────────── */}
        {GRID_AGES.map((age) => {
          const y = ty(age);
          return (
            <g key={age}>
              <line
                x1={X0} y1={y} x2={X1} y2={y}
                stroke="currentColor" strokeOpacity="0.06" strokeWidth="1"
              />
              <text
                x={X0 - 8} y={y + 4}
                textAnchor="end" fontSize="10.5" fontFamily="monospace"
                fill="currentColor" fillOpacity="0.38"
              >
                {age}
              </text>
            </g>
          );
        })}

        {GRID_YEARS.map((yr) => {
          const x = tx(yr);
          return (
            <g key={yr}>
              <line
                x1={x} y1={Y0} x2={x} y2={Y1 + 5}
                stroke="currentColor" strokeOpacity="0.05" strokeWidth="1"
              />
              <text
                x={x} y={Y1 + 18}
                textAnchor="middle" fontSize="10" fontFamily="monospace"
                fill="currentColor" fillOpacity="0.38"
              >
                {yr === 0 ? 'Now' : `+${yr}yr`}
              </text>
            </g>
          );
        })}

        {/* ── Area fill ────────────────────────────────────────────────────── */}
        <motion.path
          d={AREA_PATH}
          fill="url(#bio-area-fill)"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 1.9 }}
        />

        {/* ── Standard trajectory (without protocol) ───────────────────────── */}
        <motion.path
          d={STD_PATH}
          fill="none"
          stroke="url(#bio-std-line)"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 2.2, delay: 0.2, ease: 'easeInOut' }}
        />

        {/* ── Optimized trajectory (with stack) ───────────────────────────── */}
        <motion.path
          d={OPT_PATH}
          fill="none"
          stroke="url(#bio-opt-line)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 1.8, delay: 0.5, ease: 'easeInOut' }}
        />

        {/* ── Endpoint dots ─────────────────────────────────────────────────── */}
        <motion.circle
          cx={tx(10)} cy={ty(58)} r={5.5}
          fill="var(--accent-rose)"
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : { scale: 0 }}
          style={{ transformOrigin: `${f(tx(10))}px ${f(ty(58))}px` }}
          transition={{ delay: 2.4, type: 'spring', stiffness: 200 }}
        />
        <motion.circle
          cx={tx(10)} cy={ty(48)} r={5.5}
          fill="var(--accent-emerald)"
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : { scale: 0 }}
          style={{ transformOrigin: `${f(tx(10))}px ${f(ty(48))}px` }}
          transition={{ delay: 2.5, type: 'spring', stiffness: 200 }}
        />

        {/* ── Gap bracket at year 10 ────────────────────────────────────────── */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 2.7 }}
        >
          {/* Dashed bracket line */}
          <line
            x1={X1 + 12} y1={ty(58)} x2={X1 + 12} y2={ty(48)}
            stroke="white" strokeOpacity="0.22" strokeWidth="1" strokeDasharray="4 3"
          />
          {/* End ticks */}
          <line x1={X1 + 8}  y1={ty(58)} x2={X1 + 16} y2={ty(58)} stroke="white" strokeOpacity="0.35" strokeWidth="1" />
          <line x1={X1 + 8}  y1={ty(48)} x2={X1 + 16} y2={ty(48)} stroke="white" strokeOpacity="0.35" strokeWidth="1" />
          {/* Gap label */}
          <text
            x={X1 + 22}
            y={(ty(58) + ty(48)) / 2 - 7}
            fontSize="12" fontWeight="800" fontFamily="monospace"
            fill="var(--accent-emerald)"
          >
            10 yrs
          </text>
          <text
            x={X1 + 22}
            y={(ty(58) + ty(48)) / 2 + 9}
            fontSize="10" fontFamily="monospace"
            fill="white" fillOpacity="0.42"
          >
            younger
          </text>
        </motion.g>

        {/* ── 90-day first signal milestone ─────────────────────────────────── */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 2.8 }}
        >
          <circle cx={MILESTONE_X} cy={MILESTONE_Y} r={4} fill="var(--accent-cyan)" fillOpacity="0.9" />
          <circle cx={MILESTONE_X} cy={MILESTONE_Y} r={8} fill="var(--accent-cyan)" fillOpacity="0.12" />
          <line
            x1={MILESTONE_X} y1={MILESTONE_Y - 10}
            x2={MILESTONE_X} y2={MILESTONE_Y - 34}
            stroke="var(--accent-cyan)" strokeWidth="1" strokeOpacity="0.45" strokeDasharray="3 2"
          />
          <text
            x={MILESTONE_X} y={MILESTONE_Y - 40}
            textAnchor="middle" fontSize="9.5" fontFamily="monospace"
            fill="var(--accent-cyan)" fillOpacity="0.8"
          >
            90d signal
          </text>
        </motion.g>

        {/* ── Axis labels ───────────────────────────────────────────────────── */}
        <text
          transform={`rotate(-90) translate(${-((Y0 + Y1) / 2)}, 16)`}
          textAnchor="middle" fontSize="9.5" fontFamily="monospace"
          fill="currentColor" fillOpacity="0.3" letterSpacing="2"
        >
          BIOLOGICAL AGE
        </text>
        <text
          x={(X0 + X1) / 2} y={H - 4}
          textAnchor="middle" fontSize="9.5" fontFamily="monospace"
          fill="currentColor" fillOpacity="0.3" letterSpacing="2"
        >
          YEARS FROM PROTOCOL START
        </text>

        {/* ── Legend ────────────────────────────────────────────────────────── */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 2.2 }}
        >
          {/* Standard legend */}
          <line x1={X0} y1={Y0 - 14} x2={X0 + 28} y2={Y0 - 14}
            stroke="var(--accent-rose)" strokeWidth="2.5" strokeDasharray="5 3" />
          <text
            x={X0 + 34} y={Y0 - 10}
            fontSize="11" fontFamily="monospace"
            fill="var(--accent-rose)" fillOpacity="0.85"
          >
            Without protocol
          </text>
          {/* Optimized legend */}
          <line x1={X0 + 210} y1={Y0 - 14} x2={X0 + 238} y2={Y0 - 14}
            stroke="var(--accent-emerald)" strokeWidth="3" />
          <text
            x={X0 + 244} y={Y0 - 10}
            fontSize="11" fontFamily="monospace"
            fill="var(--accent-emerald)" fillOpacity="0.9"
          >
            TNiC Optimized Stack
          </text>
        </motion.g>
      </svg>
    </figure>
  );
}
