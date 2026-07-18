'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { pathways } from '@/lib/pathways';

const SHORT_CODE: Record<string, string> = {
  'ampk-activation': 'AMPK',
  'nrf2-keap1-antioxidant-response': 'NRF2',
  'sirtuin-nad-axis': 'SIRT',
  'mtor-nutrient-sensing': 'mTOR',
  'mitochondrial-quality-control': 'MITO',
  'senescence-clearance': 'SEN',
};

/**
 * Orbital map of the 6 molecular pathways — same visual language as
 * HallmarksConstellation (shared .hallmarks-constellation/.constellation-*
 * CSS: it's a generic radial-layout primitive, not hallmark-specific, so
 * this reuses it rather than forking a parallel stylesheet) but themed per
 * pathway instead of per hallmark, and the tooltip surfaces lever count
 * instead of coverage %.
 */
export function PathwayConstellation() {
  const [active, setActive] = useState<string | null>(null);
  const count = pathways.length;
  const radius = 42;

  return (
    <div className="hallmarks-constellation" role="img" aria-label="Interactive map of the 6 molecular pathways">
      <svg viewBox="0 0 100 100" className="constellation-svg" aria-hidden="true">
        <defs>
          <radialGradient id="pathway-core-glow">
            <stop offset="0%" stopColor="var(--accent-violet)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--accent-violet)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="50" cy="50" r="18" fill="url(#pathway-core-glow)" className="constellation-core" />
        <circle cx="50" cy="50" r="6" fill="none" stroke="var(--accent-violet)" strokeOpacity="0.4" strokeWidth="0.3" />
        <circle cx="50" cy="50" r="12" fill="none" stroke="var(--accent-cyan)" strokeOpacity="0.2" strokeWidth="0.2" className="constellation-orbit" />
        <circle cx="50" cy="50" r={radius * 0.55} fill="none" stroke="var(--accent-emerald)" strokeOpacity="0.15" strokeWidth="0.2" className="constellation-orbit constellation-orbit-2" />

        {pathways.map((p, i) => {
          const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
          const cx = +(50 + Math.cos(angle) * radius * 0.55).toFixed(4);
          const cy = +(50 + Math.sin(angle) * radius * 0.55).toFixed(4);
          const stroke = `var(--accent-${p.theme})`;
          const isActive = active === p.slug;

          return (
            <g key={p.slug}>
              <line
                x1="50"
                y1="50"
                x2={cx}
                y2={cy}
                stroke={stroke}
                strokeOpacity={isActive ? 0.5 : 0.12}
                strokeWidth={isActive ? 0.4 : 0.2}
                className="constellation-spoke"
              />
              <circle
                cx={cx}
                cy={cy}
                r={isActive ? 2.8 : 2}
                fill={stroke}
                fillOpacity={isActive ? 1 : 0.65}
                className="constellation-node-dot"
              />
            </g>
          );
        })}
      </svg>

      <div className="constellation-nodes">
        {pathways.map((p, i) => {
          // Same trig as the SVG dots above and as HallmarksConstellation —
          // left/top percentages (containing-block-relative), not the
          // rotate()/translateX()/rotate() custom-property trick: percentages
          // inside translate() resolve against the translated element's own
          // ~36px box, not the container, so that put every node ~8px from
          // center regardless of the intended radius.
          const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
          const cx = +(50 + Math.cos(angle) * radius * 0.55).toFixed(4);
          const cy = +(50 + Math.sin(angle) * radius * 0.55).toFixed(4);
          const isActive = active === p.slug;

          return (
            <motion.div
              key={p.slug}
              className="constellation-node"
              style={{
                '--cx': `${cx}%`,
                '--cy': `${cy}%`,
              } as React.CSSProperties}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
            >
              <Link
                href={`/library/pathways/${p.slug}`}
                className={`constellation-node-btn focus-ring ${isActive ? 'is-active' : ''}`}
                onMouseEnter={() => setActive(p.slug)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(p.slug)}
                onBlur={() => setActive(null)}
                title={p.name}
              >
                <span className={`constellation-node-num constellation-theme-${p.theme}`}>
                  {SHORT_CODE[p.slug] ?? p.name.slice(0, 4)}
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {active && (
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="constellation-tooltip card-premium"
        >
          {(() => {
            const p = pathways.find((x) => x.slug === active);
            if (!p) return null;
            return (
              <>
                <p className={`text-label mb-1 constellation-theme-${p.theme}`}>{SHORT_CODE[p.slug]}</p>
                <p className="heading-card">{p.name}</p>
                <p className="text-body-sm mt-1 line-clamp-2">{p.tagline}</p>
                <p className="text-caption font-mono mt-2">
                  {p.levers.length} levers · {p.relatedHallmarkIds.length} hallmarks addressed
                </p>
              </>
            );
          })()}
        </motion.div>
      )}
    </div>
  );
}
