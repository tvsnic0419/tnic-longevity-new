'use client';

import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Deep Glass System — depth via layered planes, not blur alone.
 * See app/globals.css "Design System v8 — Deep Glass" for the token bundle
 * each plane draws from. Reserve `content`/`tilt` for the one hero glass
 * moment per page — most surfaces on the site should stay non-glass.
 */
export type GlassDepth = 'field' | 'mid' | 'content' | 'float';

const TILT_MAX = 5; // degrees — matches --glass-tilt-max in globals.css
const TILT_SPRING = { stiffness: 150, damping: 18, mass: 0.7 };

interface GlassPanelProps {
  depth?: GlassDepth;
  /** Pointer-reactive tilt (desktop mouse only — off on touch, off for reduced motion via MotionConfig). */
  tilt?: boolean;
  /** Contrast scrim behind children so text over the glass clears WCAG AA. */
  scrim?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

export function GlassPanel({ depth = 'content', tilt = false, scrim = false, className, style, children }: GlassPanelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, TILT_SPRING);
  const sy = useSpring(py, TILT_SPRING);
  const rotateX = useTransform(sy, [0, 1], [TILT_MAX, -TILT_MAX]);
  const rotateY = useTransform(sx, [0, 1], [-TILT_MAX, TILT_MAX]);

  const handleMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!tilt || e.pointerType !== 'mouse') return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };

  const handleLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={tilt ? handleMove : undefined}
      onPointerLeave={tilt ? handleLeave : undefined}
      style={tilt ? { rotateX, rotateY, transformPerspective: 1000, ...style } : style}
      className={cn('glass-deep', `glass-plane-${depth}`, className)}
    >
      {scrim && <div className="glass-scrim" aria-hidden="true" />}
      {children}
    </motion.div>
  );
}

interface GlassCardProps extends GlassPanelProps {
  rounded?: string;
}

/** GlassPanel with card-shaped defaults — padding + rounding — for Phase 2 use across cards/sections. */
export function GlassCard({ depth = 'mid', tilt, scrim, rounded = 'rounded-2xl', className, children }: GlassCardProps) {
  return (
    <GlassPanel depth={depth} tilt={tilt} scrim={scrim} className={cn(rounded, 'p-6', className)}>
      {children}
    </GlassPanel>
  );
}
