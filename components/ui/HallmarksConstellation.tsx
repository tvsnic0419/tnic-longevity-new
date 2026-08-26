'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { hallmarkLibrary } from '@/lib/hallmarks-library';
import { hallmarkVisualRegistry } from '@/lib/hallmark-visuals';
import type { ThemeAccent } from '@/lib/design-system';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const themeStroke: Record<ThemeAccent, string> = {
  cyan: 'var(--accent-cyan)',
  emerald: 'var(--accent-emerald)',
  violet: 'var(--accent-violet)',
  rose: 'var(--accent-rose)',
  amber: 'var(--accent-amber)',
};

/** Interactive orbital map of all 12 Hallmarks of Aging */
export function HallmarksConstellation() {
  const [active, setActive] = useState<string | null>(null);
  // The 12-node entrance stagger ran unconditionally — the one animated
  // surface in the viz family that never checked. RevealItem next to it does.
  const reduced = useReducedMotion();
  const count = hallmarkLibrary.length;
  const radius = 42;

  return (
    <div className="hallmarks-constellation" role="group" aria-label="Interactive map of the 12 Hallmarks of Aging">
      <svg viewBox="0 0 100 100" className="constellation-svg" aria-hidden="true">
        <defs>
          <radialGradient id="core-glow">
            <stop offset="0%" stopColor="var(--accent-cyan)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--accent-cyan)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="50" cy="50" r="18" fill="url(#core-glow)" className="constellation-core" />
        <circle cx="50" cy="50" r="6" fill="none" stroke="var(--accent-cyan)" strokeOpacity="0.4" strokeWidth="0.3" />
        <circle cx="50" cy="50" r="12" fill="none" stroke="var(--accent-emerald)" strokeOpacity="0.2" strokeWidth="0.2" className="constellation-orbit" />
        <circle cx="50" cy="50" r={radius * 0.55} fill="none" stroke="var(--accent-violet)" strokeOpacity="0.15" strokeWidth="0.2" className="constellation-orbit constellation-orbit-2" />

        {hallmarkLibrary.map((h, i) => {
          const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
          const cx = +(50 + Math.cos(angle) * radius * 0.55).toFixed(4);
          const cy = +(50 + Math.sin(angle) * radius * 0.55).toFixed(4);
          const visual = hallmarkVisualRegistry[h.visual];
          const stroke = themeStroke[visual.theme];
          const isActive = active === h.id;

          return (
            <g key={h.id}>
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
        {hallmarkLibrary.map((h, i) => {
          const angle = (i / count) * 360 - 90;
          const visual = hallmarkVisualRegistry[h.visual];
          const isActive = active === h.id;

          return (
            <motion.div
              key={h.id}
              className="constellation-node"
              style={{
                '--angle': `${angle}deg`,
                '--radius': `${radius}%`,
              } as React.CSSProperties}
              initial={reduced ? false : { opacity: 0, scale: 0.8 }}
              whileInView={reduced ? undefined : { opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={reduced ? { duration: 0 } : { delay: i * 0.04, duration: 0.4 }}
            >
              <Link
                // Was /library/{slug} while the grid immediately beside it linked
                // to /hallmarks/{slug} — two destinations for the same hallmark
                // on one screen. Both routes are real; the deep dive is the one
                // this section is about, and the library module is reachable
                // from the detail panel.
                href={`/hallmarks/${h.slug}`}
                className={`constellation-node-btn focus-ring ${isActive ? 'is-active' : ''}`}
                onMouseEnter={() => setActive(h.id)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(h.id)}
                onBlur={() => setActive(null)}
                title={h.title}
                aria-label={`Hallmark ${h.number}: ${h.title}`}
              >
                <span aria-hidden="true" className={`constellation-node-num constellation-theme-${visual.theme}`}>{h.number}</span>
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
          className="constellation-tooltip glass-deep glass-plane-float rounded-2xl"
        >
          {(() => {
            const h = hallmarkLibrary.find((x) => x.id === active);
            if (!h) return null;
            const visual = hallmarkVisualRegistry[h.visual];
            return (
              <>
                <p className="text-label text-accent-cyan mb-1">Hallmark {h.number}</p>
                <p className="heading-card">{h.title}</p>
                <p className="text-body-sm mt-1 line-clamp-2">{h.tagline}</p>
                <p className="text-caption font-mono mt-2">
                  {h.coverage}% TNiC coverage · {visual.shortLabel}
                </p>
              </>
            );
          })()}
        </motion.div>
      )}
    </div>
  );
}