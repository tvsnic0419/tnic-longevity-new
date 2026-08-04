import {
  HERO_NETWORK_EDGES,
  HERO_NETWORK_EDGE_COLOR,
  HERO_NETWORK_ELITE_COLOR,
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
 * fallback for reduced-motion, no-WebGL, and mobile. Purely decorative —
 * non-interactive by design, matching the 3D scene's own aria-hidden contract.
 */
export function HeroScenePoster() {
  const nodes = buildHeroNetworkPoster2D(WIDTH, HEIGHT);
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="h-full w-full"
      role="presentation"
      aria-hidden="true"
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
        const clash = e.kind === 'clash';
        return (
          <line
            key={`${e.a}-${e.b}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={clash ? HERO_NETWORK_EDGE_COLOR.clash : HERO_NETWORK_EDGE_COLOR.synergy}
            strokeOpacity={clash ? 0.6 : 0.32}
            strokeWidth={clash ? 1.3 : 1}
            strokeDasharray={clash ? '4 5' : undefined}
          />
        );
      })}
      {nodes.map((n) => {
        const color = HERO_NETWORK_TIER_COLOR[n.tier];
        const r = 7 + Math.min(n.degree, 6) * 1.15;
        return (
          <g key={n.id}>
            {/* Elite picks (the buildable product) carry a soft gold halo. */}
            {n.elite && (
              <circle cx={n.x} cy={n.y} r={r + 5} fill={HERO_NETWORK_ELITE_COLOR} fillOpacity={0.16} />
            )}
            <circle cx={n.x} cy={n.y} r={r + 6} fill={color} fillOpacity={0.1} />
            <circle
              cx={n.x}
              cy={n.y}
              r={r}
              fill={color}
              fillOpacity={0.18}
              stroke={n.elite ? HERO_NETWORK_ELITE_COLOR : color}
              strokeOpacity={n.elite ? 0.85 : 0.7}
              strokeWidth={n.elite ? 1.8 : 1.4}
            />
          </g>
        );
      })}
    </svg>
  );
}
