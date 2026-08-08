import {
  HERO_NETWORK_EDGES,
  HERO_NETWORK_TIER_COLOR,
  buildHeroNetworkPoster2D,
} from '@/lib/hero-network';

const WIDTH = 700;
const HEIGHT = 490;

/**
 * Static SVG rendition of the hero's compound-synergy network. Serves three
 * roles: the server-rendered first paint (before HeroSceneMount's client
 * effect can check WebGL/motion/viewport eligibility), the next/dynamic
 * `loading` placeholder while the 3D chunk downloads, and the permanent
 * fallback for reduced-motion, no-WebGL, and mobile. This is the *only*
 * version those visitors ever see of what's now a real widget, so nodes are
 * real links to their compound pages rather than purely decorative —
 * everything else (edges, glow) stays non-interactive.
 */
export function HeroScenePoster() {
  const nodes = buildHeroNetworkPoster2D(WIDTH, HEIGHT);
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="h-full w-full"
      aria-label="Compound synergy network — select a compound to view its profile"
    >
      <defs>
        <radialGradient id="hero-network-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx={WIDTH / 2} cy={HEIGHT / 2} rx={230} ry={170} fill="url(#hero-network-glow)" />
      {HERO_NETWORK_EDGES.map((e) => {
        const a = nodeMap.get(e.a);
        const b = nodeMap.get(e.b);
        if (!a || !b) return null;
        return (
          <line
            key={`${e.a}-${e.b}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="#475569"
            strokeOpacity={0.35}
            strokeWidth={1}
          />
        );
      })}
      {nodes.map((n) => {
        const color = HERO_NETWORK_TIER_COLOR[n.tier];
        const r = 7 + Math.min(n.degree, 6) * 1.15;
        return (
          <a
            key={n.id}
            href={`/library/compounds/${n.id}`}
            className="cursor-pointer outline-none transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            <title>{n.name}</title>
            <circle cx={n.x} cy={n.y} r={r + 6} fill={color} fillOpacity={0.1} />
            <circle
              cx={n.x}
              cy={n.y}
              r={r}
              fill={color}
              fillOpacity={0.18}
              stroke={color}
              strokeOpacity={0.7}
              strokeWidth={1.4}
            />
          </a>
        );
      })}
    </svg>
  );
}
