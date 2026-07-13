'use client';

import { useRef, type ReactNode, type PointerEvent } from 'react';
import { cn } from '@/lib/utils';

/**
 * Pointer-reactive tilt for a single hero glass moment. Weighted spring easing
 * lives in CSS (`.dg-tilt`); this only feeds it --dg-rx/--dg-ry from the mouse.
 *
 * - Mouse only: touch pointers are ignored, and CSS zeroes the tilt on mobile.
 * - Reduced motion: CSS forces `transform: none`, so this stays inert visually.
 */
export function HeroTilt({
  children,
  max = 5,
  className,
}: {
  children: ReactNode;
  max?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--dg-ry', `${(px * max).toFixed(2)}deg`);
    el.style.setProperty('--dg-rx', `${(-py * max).toFixed(2)}deg`);
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--dg-rx', '0deg');
    el.style.setProperty('--dg-ry', '0deg');
  };

  return (
    <div
      ref={ref}
      className={cn('dg-tilt', className)}
      onPointerMove={handleMove}
      onPointerLeave={reset}
    >
      {children}
    </div>
  );
}
