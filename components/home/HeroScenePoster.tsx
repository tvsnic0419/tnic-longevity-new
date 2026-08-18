import { buildPathwayPoster2D } from '@/lib/hero-pathways';

const WIDTH = 900;
const HEIGHT = 520;

/**
 * Static SVG rendition of the hero Pathway Flow. Serves three roles: the
 * server-rendered first paint (before HeroSceneMount checks
 * WebGL/motion/viewport eligibility), the next/dynamic `loading` placeholder
 * while the 3D chunk downloads, and the permanent fallback for reduced-motion,
 * no-WebGL, and mobile. This is the *only* version those visitors ever see, so
 * it carries the same three-column flow as real, labelled content — compounds
 * link to their pages, everything else is a legible diagram.
 */
export function HeroScenePoster() {
  const { nodes, edges } = buildPathwayPoster2D(WIDTH, HEIGHT);

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="h-full w-full"
      aria-label="Pathway flow — compounds act through molecules on the hallmarks of aging"
    >
      {/* column captions */}
      <text x={96} y={30} fill="#94a3b8" fontSize={12} fontWeight={600} letterSpacing="0.08em">
        COMPOUNDS
      </text>
      <text x={WIDTH / 2} y={30} fill="#94a3b8" fontSize={12} fontWeight={600} letterSpacing="0.08em" textAnchor="middle">
        MECHANISM
      </text>
      <text x={WIDTH - 96} y={30} fill="#94a3b8" fontSize={12} fontWeight={600} letterSpacing="0.08em" textAnchor="end">
        HALLMARKS
      </text>

      {edges.map((e) => (
        <path
          key={e.id}
          d={`M ${e.x1} ${e.y1} C ${(e.x1 + e.x2) / 2} ${e.y1}, ${(e.x1 + e.x2) / 2} ${e.y2}, ${e.x2} ${e.y2}`}
          fill="none"
          stroke={e.color}
          strokeOpacity={0.32}
          strokeWidth={1.4}
        />
      ))}

      {nodes.map((n) => {
        if (n.kind === 'molecule') {
          return (
            <g key={n.id}>
              <circle cx={n.x} cy={n.y} r={9} fill={n.color} fillOpacity={0.22} stroke={n.color} strokeOpacity={0.9} strokeWidth={1.5} />
              <text x={n.x} y={n.y - 15} fill={n.color} fontSize={12} fontWeight={600} textAnchor="middle">
                {n.label}
              </text>
            </g>
          );
        }
        const isCompound = n.kind === 'compound';
        const href = isCompound ? `/library/compounds/${n.id.slice(4)}` : '/hallmarks';
        const anchor = isCompound ? 'end' : 'start';
        const dx = isCompound ? -12 : 12;
        return (
          <a
            key={n.id}
            href={href}
            className="cursor-pointer outline-none transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            <title>{n.label}</title>
            <circle cx={n.x} cy={n.y} r={6} fill={n.color} fillOpacity={0.28} stroke={n.color} strokeOpacity={0.75} strokeWidth={1.3} />
            <text x={n.x + dx} y={n.y + 4} fill="#cbd5e1" fontSize={12} textAnchor={anchor}>
              {n.label}
            </text>
          </a>
        );
      })}
    </svg>
  );
}
