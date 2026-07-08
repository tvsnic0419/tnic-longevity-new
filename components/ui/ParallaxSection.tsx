'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { ThemeAccent } from '@/lib/design-system';
import { cn } from '@/lib/utils';

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  /** 1 = subtle, 2 = medium, 3 = pronounced */
  depth?: 1 | 2 | 3;
  theme?: ThemeAccent;
  id?: string;
}

const themeGlow: Record<ThemeAccent, string> = {
  cyan: 'parallax-glow-cyan',
  emerald: 'parallax-glow-emerald',
  violet: 'parallax-glow-violet',
  rose: 'parallax-glow-rose',
  amber: 'parallax-glow-amber',
};

/** Scroll-driven parallax fade + depth for homepage and hub sections */
export function ParallaxSection({
  children,
  className = '',
  depth = 1,
  theme,
  id,
}: ParallaxSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [`${8 * depth}%`, `${-8 * depth}%`]);
  const contentY = useTransform(scrollYProgress, [0, 1], [28 * depth, -28 * depth]);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.5, 1, 1, 0.5]);
  const scale = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.98, 1, 1, 0.98]);

  return (
    <section
      ref={ref}
      id={id}
      className={cn('parallax-section relative overflow-hidden', className)}
    >
      <motion.div
        className={cn('parallax-section-bg', theme && themeGlow[theme])}
        style={{ y: bgY }}
        aria-hidden="true"
      />
      <motion.div
        className="parallax-section-content relative z-[1]"
        style={{ y: contentY, opacity, scale }}
      >
        {children}
      </motion.div>
    </section>
  );
}