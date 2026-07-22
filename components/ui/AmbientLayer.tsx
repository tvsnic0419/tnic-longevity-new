import { MoleculeCascade } from './MoleculeCascade';

/** Site-wide ambient canvas — aurora gradient orbs + a drifting field of
 *  authentic molecular structures. Pure CSS/SVG, no client JS, respects
 *  reduced motion. */
export function AmbientLayer() {
  return (
    <div className="ambient-layer" aria-hidden="true">
      <div className="ambient-orb ambient-orb-1" />
      <div className="ambient-orb ambient-orb-2" />
      <div className="ambient-orb ambient-orb-3" />
      <MoleculeCascade />
    </div>
  );
}
