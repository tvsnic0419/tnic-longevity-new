import { Workflow } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PathwayNode {
  id: string;
  label: string;
  sublabel?: string;
  accent?: 'cyan' | 'emerald' | 'violet' | 'amber' | 'rose';
  /** Grid column (0-based). Providing `col` on any node switches the whole
   *  diagram from the linear left-to-right flow to a branched 2D layout. */
  col?: number;
  /** Grid row within the column (0-based, default 0). */
  row?: number;
}

export interface PathwayEdge {
  from: string;
  to: string;
  label?: string;
  /** Render as a feedback/crosstalk arc routed below the nodes (for loops
   *  that point backward, e.g. AMPK↔SIRT1). */
  feedback?: boolean;
}

interface PathwayDiagramProps {
  title?: string;
  nodes: PathwayNode[];
  edges: PathwayEdge[];
  className?: string;
}

const ACCENTS: NonNullable<PathwayNode['accent']>[] = ['cyan', 'emerald', 'violet', 'amber', 'rose'];

const NODE_W = 132;
const NODE_H = 58;
const PAD_X = 28;
const PAD_TOP = 40;

interface NodePos {
  x: number;
  y: number;
  cx: number;
  cy: number;
}

/**
 * Mechanism-flow diagram — reused by every :::pathway MDX block across
 * hallmarks/compounds/peptides/synergies (40+ content pages) AND the pathway
 * detail pages. Two layouts share one renderer:
 *   • Linear (default): left-to-right chain, used by all MDX blocks.
 *   • Branched grid: opt-in when any node has a `col` — lets a flagship
 *     pathway show real fan-out and feedback loops instead of a straight line.
 * Native SVG + CSS only (no client hooks) so MdxRenderer can render it server-side.
 */
export function PathwayDiagram({ title, nodes, edges, className = '' }: PathwayDiagramProps) {
  const isGrid = nodes.some((n) => typeof n.col === 'number');
  const hasEdgeLabels = edges.some((e) => e.label);
  const hasFeedback = edges.some((e) => e.feedback);

  let width: number;
  let height: number;
  let baselineY: number;
  const positions = new Map<string, NodePos>();
  const terminalIds = new Set<string>();

  if (isGrid) {
    const gapX = hasEdgeLabels ? 70 : 56;
    const gapY = 30;
    const cols = Math.max(...nodes.map((n) => n.col ?? 0)) + 1;
    const rows = Math.max(...nodes.map((n) => n.row ?? 0)) + 1;
    const maxCol = cols - 1;
    const contentW = cols * NODE_W + (cols - 1) * gapX;
    const contentH = rows * NODE_H + (rows - 1) * gapY;
    const arcSpace = hasFeedback ? 44 : 0;
    width = PAD_X * 2 + contentW;
    height = PAD_TOP + contentH + 24 + arcSpace;
    baselineY = PAD_TOP + contentH + arcSpace - 6;
    for (const n of nodes) {
      const col = n.col ?? 0;
      const row = n.row ?? 0;
      const x = PAD_X + col * (NODE_W + gapX);
      const y = PAD_TOP + row * (NODE_H + gapY);
      positions.set(n.id, { x, y, cx: x + NODE_W / 2, cy: y + NODE_H / 2 });
      if (col === maxCol) terminalIds.add(n.id);
    }
  } else {
    const gap = hasEdgeLabels ? 68 : 52;
    width = PAD_X * 2 + nodes.length * NODE_W + (nodes.length - 1) * gap;
    height = PAD_TOP * 2 + NODE_H + 40;
    baselineY = height - 6;
    nodes.forEach((n, i) => {
      const x = PAD_X + i * (NODE_W + gap);
      positions.set(n.id, { x, y: PAD_TOP, cx: x + NODE_W / 2, cy: PAD_TOP + NODE_H / 2 });
    });
    if (nodes.length) terminalIds.add(nodes[nodes.length - 1].id);
  }

  const glowAccent =
    nodes.find((n) => terminalIds.has(n.id))?.accent ?? nodes[nodes.length - 1]?.accent ?? nodes[0]?.accent ?? 'cyan';

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

          <ellipse cx={width / 2} cy={height / 2} rx={width * 0.55} ry={height * 0.9} fill="url(#pw-ambient-glow)" />

          {edges.map((edge, i) => {
            const from = positions.get(edge.from);
            const to = positions.get(edge.to);
            if (!from || !to) return null;
            const fromNode = nodes.find((n) => n.id === edge.from);
            const accent = fromNode?.accent ?? 'cyan';

            if (edge.feedback) {
              // Return arc routed below the node band.
              const x1 = from.cx;
              const y1 = from.y + NODE_H;
              const x2 = to.cx;
              const y2 = to.y + NODE_H;
              const path = `M${x1} ${y1} C${x1} ${baselineY}, ${x2} ${baselineY}, ${x2} ${y2}`;
              const labelX = (x1 + x2) / 2;
              return (
                <g key={`${edge.from}-${edge.to}-${i}`}>
                  <path
                    d={path}
                    fill="none"
                    stroke={`var(--accent-${accent})`}
                    strokeWidth="1.25"
                    strokeDasharray="4 4"
                    strokeOpacity="0.55"
                    markerEnd="url(#pathway-arrow)"
                  />
                  {edge.label && (() => {
                    const pillW = edge.label.length * 5.3 + 14;
                    return (
                      <g>
                        <rect x={labelX - pillW / 2} y={baselineY - 7} width={pillW} height={13} rx="6" fill="var(--color-bg-elevated)" opacity="0.9" />
                        <text x={labelX} y={baselineY + 2} textAnchor="middle" fill={`var(--accent-${accent})`} fontSize="9" fontFamily="var(--font-mono)" opacity="0.9">
                          {edge.label}
                        </text>
                      </g>
                    );
                  })()}
                </g>
              );
            }

            // Forward edge: horizontal S-curve from right of `from` to left of `to`.
            const x1 = from.x + NODE_W;
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
                  const labelMidX = (x1 + x2) / 2;
                  const labelMidY = (y1 + y2) / 2;
                  const pillW = Math.min(NODE_W, edge.label.length * 5.3 + 14);
                  const textW = pillW - 8;
                  return (
                    <g>
                      <rect x={labelMidX - pillW / 2} y={labelMidY - 17} width={pillW} height={13} rx="6" fill="var(--color-bg-elevated)" opacity="0.88" />
                      <text
                        x={labelMidX}
                        y={labelMidY - 8}
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

          {nodes.map((node) => {
            const pos = positions.get(node.id);
            if (!pos) return null;
            const accent = node.accent ?? 'cyan';
            const isTerminal = terminalIds.has(node.id);
            return (
              <g
                key={node.id}
                style={{ filter: `drop-shadow(0 0 ${isTerminal ? 10 : 6}px color-mix(in srgb, var(--accent-${accent}) ${isTerminal ? 45 : 30}%, transparent))` }}
              >
                <rect
                  x={pos.x}
                  y={pos.y}
                  width={NODE_W}
                  height={NODE_H}
                  rx="12"
                  fill={`url(#pw-fill-${accent})`}
                  className="pathway-node"
                  style={{ stroke: `color-mix(in srgb, var(--accent-${accent}) ${isTerminal ? 60 : 42}%, transparent)`, strokeWidth: isTerminal ? 1.75 : 1.25 }}
                />
                <circle cx={pos.x + 12} cy={pos.y + 12} r="3" fill={`var(--accent-${accent})`} opacity="0.9" />
                <text x={pos.cx} y={pos.cy - (node.sublabel ? 5 : 0) + 3} textAnchor="middle" fill="var(--color-text-primary)" fontSize="11.5" fontWeight="600">
                  {node.label}
                </text>
                {node.sublabel && (
                  <text x={pos.cx} y={pos.cy + 15} textAnchor="middle" fill={`var(--accent-${accent})`} fontSize="8" fontFamily="var(--font-mono)" letterSpacing="0.02em" opacity="0.85">
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
