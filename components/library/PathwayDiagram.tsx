import { Workflow } from 'lucide-react';
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

const ACCENTS: NonNullable<PathwayNode['accent']>[] = ['cyan', 'emerald', 'violet', 'amber', 'rose'];

/**
 * Horizontal pathway flow — reused by every :::pathway MDX block across
 * hallmarks/compounds/peptides/synergies (40+ content pages), so upgrading
 * this one component lifts mechanism-diagram quality sitewide. Native SVG +
 * CSS only (no client hooks) — MdxRenderer renders this server-side.
 */
export function PathwayDiagram({ title, nodes, edges, className = '' }: PathwayDiagramProps) {
  const nodeW = 132;
  const nodeH = 60;
  const hasEdgeLabels = edges.some((e) => e.label);
  const gap = hasEdgeLabels ? 68 : 52;
  const padX = 28;
  const padY = 40;
  const width = padX * 2 + nodes.length * nodeW + (nodes.length - 1) * gap;
  const height = padY * 2 + nodeH + 40;

  const positions = new Map(
    nodes.map((n, i) => [
      n.id,
      { x: padX + i * (nodeW + gap), y: padY, cx: padX + i * (nodeW + gap) + nodeW / 2, cy: padY + nodeH / 2 },
    ]),
  );

  const glowAccent = nodes[nodes.length - 1]?.accent ?? nodes[0]?.accent ?? 'cyan';

  return (
    <figure className={cn('card-premium p-5 md:p-6 my-6', className)}>
      {title && (
        <figcaption className="flex items-center gap-2 mb-4">
          <Workflow className="w-3.5 h-3.5 text-accent-cyan shrink-0" aria-hidden="true" />
          <span className="text-label text-accent-cyan">{title}</span>
        </figcaption>
      )}
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto"
          role="img"
          aria-label={title ?? 'Biological pathway diagram'}
        >
          <defs>
            {ACCENTS.map((accent) => (
              <linearGradient key={accent} id={`pw-fill-${accent}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" style={{ stopColor: `var(--accent-${accent})`, stopOpacity: 0.16 }} />
                <stop offset="100%" style={{ stopColor: 'var(--color-bg-elevated)', stopOpacity: 0 }} />
              </linearGradient>
            ))}
            <radialGradient id="pw-ambient-glow">
              <stop offset="0%" style={{ stopColor: `var(--accent-${glowAccent})`, stopOpacity: 0.1 }} />
              <stop offset="100%" style={{ stopColor: `var(--accent-${glowAccent})`, stopOpacity: 0 }} />
            </radialGradient>
            <marker id="pathway-arrow" markerWidth="9" markerHeight="9" refX="7.5" refY="4.5" orient="auto">
              <path d="M0,0.5 L8,4.5 L0,8.5 Z" fill="var(--accent-emerald)" opacity="0.85" />
            </marker>
          </defs>

          <ellipse
            cx={width / 2}
            cy={height / 2}
            rx={width * 0.55}
            ry={height * 0.9}
            fill="url(#pw-ambient-glow)"
          />

          {edges.map((edge, i) => {
            const from = positions.get(edge.from);
            const to = positions.get(edge.to);
            if (!from || !to) return null;
            const x1 = from.x + nodeW;
            const y1 = from.cy;
            const x2 = to.x;
            const y2 = to.cy;
            const midX = (x1 + x2) / 2;
            const path = `M${x1} ${y1} C${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
            return (
              <g key={`${edge.from}-${edge.to}-${i}`}>
                <path d={path} className="pathway-edge" markerEnd="url(#pathway-arrow)" />
                <path d={path} className="pathway-edge-flow" />
                {edge.label && (() => {
                  const pillW = Math.min(gap - 8, edge.label.length * 5.5 + 12);
                  const textW = pillW - 8;
                  return (
                    <g>
                      <rect
                        x={midX - pillW / 2}
                        y={(y1 + y2) / 2 - 17}
                        width={pillW}
                        height={13}
                        rx="6"
                        fill="var(--color-bg-elevated)"
                        opacity="0.85"
                      />
                      <text
                        x={midX}
                        y={(y1 + y2) / 2 - 8}
                        textAnchor="middle"
                        fill="var(--color-text-faint)"
                        fontSize="9"
                        fontFamily="var(--font-mono)"
                        textLength={textW}
                        lengthAdjust="spacingAndGlyphs"
                      >
                        {edge.label}
                      </text>
                    </g>
                  );
                })()}
              </g>
            );
          })}

          {nodes.map((node, i) => {
            const pos = positions.get(node.id);
            if (!pos) return null;
            const accent = node.accent ?? 'cyan';
            const isTerminal = i === nodes.length - 1;
            return (
              <g
                key={node.id}
                style={{ filter: `drop-shadow(0 0 ${isTerminal ? 10 : 6}px color-mix(in srgb, var(--accent-${accent}) ${isTerminal ? 45 : 30}%, transparent))` }}
              >
                <rect
                  x={pos.x}
                  y={pos.y}
                  width={nodeW}
                  height={nodeH}
                  rx="12"
                  fill={`url(#pw-fill-${accent})`}
                  className="pathway-node"
                  style={{ stroke: `color-mix(in srgb, var(--accent-${accent}) ${isTerminal ? 60 : 42}%, transparent)`, strokeWidth: isTerminal ? 1.75 : 1.25 }}
                />
                <circle cx={pos.x + 12} cy={pos.y + 12} r="3" fill={`var(--accent-${accent})`} opacity="0.9" />
                <text
                  x={pos.cx}
                  y={pos.cy - (node.sublabel ? 5 : 0) + 3}
                  textAnchor="middle"
                  fill="var(--color-text-primary)"
                  fontSize="11.5"
                  fontWeight="600"
                >
                  {node.label}
                </text>
                {node.sublabel && (
                  <text
                    x={pos.cx}
                    y={pos.cy + 15}
                    textAnchor="middle"
                    fill={`var(--accent-${accent})`}
                    fontSize="8"
                    fontFamily="var(--font-mono)"
                    letterSpacing="0.02em"
                    opacity="0.85"
                  >
                    {node.sublabel.toUpperCase()}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </figure>
  );
}
