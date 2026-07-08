import { cn } from '@/lib/utils';

export interface PathwayNode {
  id: string;
  label: string;
  sublabel?: string;
  accent?: 'cyan' | 'emerald' | 'violet' | 'amber' | 'rose';
}

export interface PathwayEdge {
  from: string;
  to: string;
  label?: string;
}

interface PathwayDiagramProps {
  title?: string;
  nodes: PathwayNode[];
  edges: PathwayEdge[];
  className?: string;
}

const accentStroke: Record<NonNullable<PathwayNode['accent']>, string> = {
  cyan: 'var(--accent-cyan)',
  emerald: 'var(--accent-emerald)',
  violet: 'var(--accent-violet)',
  amber: 'var(--accent-amber)',
  rose: 'var(--accent-rose)',
};

/** Horizontal pathway flow — clarity-first, theme-aware SVG */
export function PathwayDiagram({ title, nodes, edges, className = '' }: PathwayDiagramProps) {
  const nodeW = 120;
  const nodeH = 52;
  const gap = 48;
  const padX = 24;
  const padY = 36;
  const width = padX * 2 + nodes.length * nodeW + (nodes.length - 1) * gap;
  const height = padY * 2 + nodeH + 40;

  const positions = new Map(
    nodes.map((n, i) => [
      n.id,
      { x: padX + i * (nodeW + gap), y: padY, cx: padX + i * (nodeW + gap) + nodeW / 2, cy: padY + nodeH / 2 },
    ]),
  );

  return (
    <figure className={cn('rounded-xl border border-border bg-card/50 p-4 md:p-5', className)}>
      {title && (
        <figcaption className="text-label mb-4 text-accent-cyan">{title}</figcaption>
      )}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        role="img"
        aria-label={title ?? 'Biological pathway diagram'}
      >
        {edges.map((edge, i) => {
          const from = positions.get(edge.from);
          const to = positions.get(edge.to);
          if (!from || !to) return null;
          const x1 = from.x + nodeW;
          const y1 = from.cy;
          const x2 = to.x;
          const y2 = to.cy;
          const midX = (x1 + x2) / 2;
          return (
            <g key={`${edge.from}-${edge.to}-${i}`}>
              <path
                d={`M${x1} ${y1} C${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
                className="pathway-edge"
                markerEnd="url(#pathway-arrow)"
              />
              {edge.label && (
                <text
                  x={midX}
                  y={(y1 + y2) / 2 - 8}
                  textAnchor="middle"
                  fill="var(--color-text-faint)"
                  fontSize="9"
                  fontFamily="var(--font-mono)"
                >
                  {edge.label}
                </text>
              )}
            </g>
          );
        })}

        <defs>
          <marker id="pathway-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="var(--accent-emerald)" opacity="0.7" />
          </marker>
        </defs>

        {nodes.map((node) => {
          const pos = positions.get(node.id);
          if (!pos) return null;
          const stroke = accentStroke[node.accent ?? 'cyan'];
          return (
            <g key={node.id}>
              <rect
                x={pos.x}
                y={pos.y}
                width={nodeW}
                height={nodeH}
                rx="10"
                className="pathway-node"
                style={{ stroke }}
              />
              <text
                x={pos.cx}
                y={pos.cy - (node.sublabel ? 4 : 0)}
                textAnchor="middle"
                fill="var(--color-text-primary)"
                fontSize="11"
                fontWeight="600"
              >
                {node.label}
              </text>
              {node.sublabel && (
                <text
                  x={pos.cx}
                  y={pos.cy + 12}
                  textAnchor="middle"
                  fill="var(--color-text-muted)"
                  fontSize="8"
                  fontFamily="var(--font-mono)"
                >
                  {node.sublabel}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </figure>
  );
}