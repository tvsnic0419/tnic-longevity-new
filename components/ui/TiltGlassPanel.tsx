'use client';

import { useRef, type PointerEvent, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { GlassDepth } from './GlassPanel';

const TILT_MAX = 5; // degrees — matches --glass-tilt-max in globals.css
const TILT_SPRING = { stiffness: 150, damping: 18, mass: 0.7 };

interface TiltGlassPanelProps {
  depth?: GlassDepth;
  /** Contrast scrim behind children so text over the glass clears WCAG AA. */
  scrim?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * GlassPanel with pointer-reactive tilt (desktop mouse only — off on touch,
 * off for reduced motion via MotionConfig). Split out from the plain
 * GlassPanel so every other glass surface on the site isn't paying for
 * motion-value/spring machinery it never uses — reserve this for the one
 * hero glass moment per page.
 */
export function TiltGlassPanel({ depth = 'content', scrim = false, className, children }: TiltGlassPanelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, TILT_SPRING);
  const sy = useSpring(py, TILT_SPRING);
  const rotateX = useTransform(sy, [0, 1], [TILT_MAX, -TILT_MAX]);
  const rotateY = useTransform(sx, [0, 1], [-TILT_MAX, TILT_MAX]);

  const handleMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
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
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className={cn('glass-deep', `glass-plane-${depth}`, className)}
    >
      {scrim && <div className="glass-scrim" aria-hidden="true" />}
      {children}
    </motion.div>
  );
}
