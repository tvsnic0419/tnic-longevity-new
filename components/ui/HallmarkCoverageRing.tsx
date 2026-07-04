'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// 5 theme accent colors cycling around the ring for covered segments
const SEGMENT_COLORS = [
  'var(--accent-cyan)',
  'var(--accent-emerald)',
  'var(--accent-violet)',
  'var(--accent-rose)',
  'var(--accent-amber)',
];

const TOTAL_HALLMARKS = 12;
const GAP_DEG = 4;            // degrees of gap between each segment
const SEG_DEG = 360 / TOTAL_HALLMARKS - GAP_DEG;  // each segment arc degrees

/** Generate SVG donut-segment path */
function donutSegment(
  cx: number, cy: number,
  outerR: number, innerR: number,
  startDeg: number, spanDeg: number,
): string {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const endDeg = startDeg + spanDeg;
  const s = toRad(startDeg), e = toRad(endDeg);
  const large = spanDeg > 180 ? 1 : 0;
  const f = (n: number) => n.toFixed(3);

  const ox1 = cx + outerR * Math.cos(s), oy1 = cy + outerR * Math.sin(s);
  const ox2 = cx + outerR * Math.cos(e), oy2 = cy + outerR * Math.sin(e);
  const ix1 = cx + innerR * Math.cos(e), iy1 = cy + innerR * Math.sin(e);
  const ix2 = cx + innerR * Math.cos(s), iy2 = cy + innerR * Math.sin(s);

  return [
    `M ${f(ox1)},${f(oy1)}`,
    `A ${outerR},${outerR} 0 ${large},1 ${f(ox2)},${f(oy2)}`,
    `L ${f(ix1)},${f(iy1)}`,
    `A ${innerR},${innerR} 0 ${large},0 ${f(ix2)},${f(iy2)}`,
    'Z',
  ].join(' ');
}

interface HallmarkCoverageRingProps {
  count: number;              // number of hallmarks covered (0–12)
  coveredIds?: string[];      // optional: specific hallmark IDs covered
  size?: number;              // SVG viewBox size (default 120)
  showLabel?: boolean;
  className?: string;
}

export function HallmarkCoverageRing({
  count,
  size = 120,
  showLabel = true,
  className = '',
}: HallmarkCoverageRingProps) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: '-30px' });

  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.41;
  const innerR = size * 0.28;

  // Start angle: -90° so first segment is at top, going clockwise
  const startOffset = -90;

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${size} ${size}`}
      className={`w-full ${className}`}
      aria-label={`${count} of ${TOTAL_HALLMARKS} hallmarks covered`}
    >
      {/* Background ring (all segments muted) */}
      {Array.from({ length: TOTAL_HALLMARKS }, (_, i) => {
        const startDeg = startOffset + i * (360 / TOTAL_HALLMARKS) + GAP_DEG / 2;
        return (
          <path
            key={`bg-${i}`}
            d={donutSegment(cx, cy, outerR, innerR, startDeg, SEG_DEG)}
            fill="currentColor"
            fillOpacity="0.06"
          />
        );
      })}

      {/* Animated covered segments */}
      {Array.from({ length: TOTAL_HALLMARKS }, (_, i) => {
        const startDeg = startOffset + i * (360 / TOTAL_HALLMARKS) + GAP_DEG / 2;
        const isCovered = i < count;
        if (!isCovered) return null;

        const color = SEGMENT_COLORS[i % SEGMENT_COLORS.length];

        return (
          <motion.path
            key={`fg-${i}`}
            d={donutSegment(cx, cy, outerR, innerR, startDeg, SEG_DEG)}
            fill={color}
            fillOpacity="0.88"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={inView ? { opacity: 0.88, scale: 1 } : { opacity: 0, scale: 0.7 }}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
            transition={{ duration: 0.35, delay: 0.1 + i * 0.055, ease: [0.22, 1, 0.36, 1] }}
          />
        );
      })}

      {/* Center content */}
      {showLabel && (
        <>
          <text
            x={cx} y={cy - size * 0.04}
            textAnchor="middle"
            fontSize={size * 0.18}
            fontWeight="800"
            fontFamily="monospace"
            fill="var(--accent-cyan)"
          >
            {count}
          </text>
          <text
            x={cx} y={cy + size * 0.10}
            textAnchor="middle"
            fontSize={size * 0.075}
            fontFamily="monospace"
            fill="currentColor" fillOpacity="0.35"
          >
            / {TOTAL_HALLMARKS}
          </text>
          <text
            x={cx} y={cy + size * 0.225}
            textAnchor="middle"
            fontSize={size * 0.065}
            fontFamily="monospace"
            fill="currentColor" fillOpacity="0.28"
            letterSpacing="0.5"
          >
            hallmarks
          </text>
        </>
      )}
    </svg>
  );
}
