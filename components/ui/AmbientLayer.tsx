'use client';

import { usePathname } from 'next/navigation';
import { MoleculeCascade } from './MoleculeCascade';
import { ambientForPathname } from '@/lib/route-context';

/** Site-wide ambient canvas — aurora gradient orbs + a drifting field of
 *  authentic molecular structures. SVG + CSS only (no canvas/JS animation
 *  loop); the one client hook just retints/dims the field per hub so the
 *  same brand element reads as "library" vs "labs" vs "stacks" instead of
 *  being identical on every page. Respects reduced motion via CSS. */
export function AmbientLayer() {
  const pathname = usePathname() ?? '/';
  const { accent, subtle } = ambientForPathname(pathname);

  return (
    <div
      className={`ambient-layer ambient-accent-${accent} ${subtle ? 'ambient-subtle' : ''}`}
      aria-hidden="true"
    >
      <div className="ambient-orb ambient-orb-1" />
      <div className="ambient-orb ambient-orb-2" />
      <div className="ambient-orb ambient-orb-3" />
      <MoleculeCascade />
    </div>
  );
}
