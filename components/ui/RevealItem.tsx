'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

interface RevealItemProps {
  /** Position within its grid — drives the stagger delay, capped so long lists don't feel sluggish. */
  index?: number;
  children: ReactNode;
  className?: string;
}

/**
 * Restrained scroll-reveal stagger for homepage card grids — fades/lifts in
 * once, the first time the item scrolls into view. Mirrors the entrance
 * pattern already used in HallmarkCoverageGrid.tsx, generalized into one
 * reusable primitive instead of repeating the same motion.div boilerplate
 * across every section.
 */
export function RevealItem({ index = 0, children, className }: RevealItemProps) {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        delay: reducedMotion ? 0 : Math.min(index, 6) * 0.06,
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
