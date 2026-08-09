'use client';

import { useMemo, useState } from 'react';
import type { NetworkEdge, NetworkNode, StackNetworkGraph as Graph } from '@/lib/tools/types';
import { edgeColors } from '@/lib/tools/stack-network';
import { cn } from '@/lib/utils';

interface StackNetworkGraphProps {
  graph: Graph;
  highlightNodeId?: string | null;
  onNodeClick?: (nodeId: string) => void;
  className?: string;
}

function edgePath(source: NetworkNode, target: NetworkNode): string {
  const mx = (source.x + target.x) / 2;
  const my = (source.y + target.y) / 2;
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const curve = 0.15;
  const cx = mx - dy * curve;
  const cy = my + dx * curve;
  return `M${source.x},${source.y} Q${cx},${cy} ${target.x},${target.y}`;
}

export function StackNetworkGraph({
  graph,
  highlightNodeId,
  onNodeClick,
  className = '',
}: StackNetworkGraphProps) {
  // Local hover state drives the "intersecting network" highlight. It layers on
  // top of the click-driven `highlightNodeId` without replacing it — hover wins
  // when present, otherwise the externally-selected node stays focused.
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const focusId = hoveredId ?? highlightNodeId ?? null;

  const nodeMap = useMemo(
    () => new Map(graph.nodes.map((n) => [n.id, n])),
    [graph.nodes],
  );

  const visibleEdges = useMemo(
    () =>
      graph.edges.filter((e) => nodeMap.has(e.source) && nodeMap.has(e.target)),
    [graph.edges, nodeMap],
  );

  // The focused node's "intersecting network": itself, every node it shares an
  // edge with, and every node on the same physiological pathway. Empty when
  // nothing is focused, in which case the graph renders at full contrast.
  const relatedIds = useMemo(() => {
    if (!focusId) return null;
    const focusNode = nodeMap.get(focusId);
    if (!focusNode) return null;
    const related = new Set<string>([focusId]);
    visibleEdges.forEach((e) => {
      if (e.source === focusId) related.add(e.target);
      if (e.target === focusId) related.add(e.source);
    });
    graph.nodes.forEach((n) => {
      if (n.pathway === focusNode.pathway) related.add(n.id);
    });
    return related;
  }, [focusId, nodeMap, visibleEdges, graph.nodes]);

  const isDimmed = (id: string) => relatedIds !== null && !relatedIds.has(id);

  return (
    <div className={cn('relative w-full', className)}>
      <svg
        viewBox="0 0 400 400"
        className="w-full h-auto max-h-[420px]"
        role="img"
        aria-label="Supplement interaction network graph — hover a compound to highlight its intersecting pathway network"
      >
        <defs>
          {(['synergy', 'potential', 'caution', 'contraindication'] as const).map((type) => (
            <marker
              key={type}
              id={`arrow-${type}`}
              markerWidth="6"
              markerHeight="6"
              refX="5"
              refY="3"
              orient="auto"
            >
              <path d="M0,0 L6,3 L0,6" fill={edgeColors[type]} opacity="0.8" />
            </marker>
          ))}
        </defs>

        {visibleEdges.map((edge: NetworkEdge) => {
          const source = nodeMap.get(edge.source)!;
          const target = nodeMap.get(edge.target)!;
          const color = edgeColors[edge.type];
          // An edge is "in focus" when it touches the focused node directly.
          const touchesFocus =
            focusId !== null && (edge.source === focusId || edge.target === focusId);
          const dimmed =
            relatedIds !== null && !touchesFocus && (isDimmed(edge.source) || isDimmed(edge.target));

          const baseOpacity = edge.active ? 0.85 : 0.2;
          const opacity = touchesFocus ? 0.95 : dimmed ? 0.05 : baseOpacity;
          const strokeWidth =
            (touchesFocus ? 2.5 : edge.active ? (edge.type === 'contraindication' ? 2.5 : 2) : 1);

          return (
            <g key={edge.id}>
              <path
                d={edgePath(source, target)}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeOpacity={opacity}
                strokeDasharray={
                  edge.type === 'potential' ? '4 3' : edge.active || touchesFocus ? undefined : '2 4'
                }
                markerEnd={edge.active || touchesFocus ? `url(#arrow-${edge.type})` : undefined}
              />
            </g>
          );
        })}

        {graph.nodes.map((node) => {
          const isFocused = focusId === node.id;
          const isSelected = node.selected;
          const dimmed = isDimmed(node.id);
          const r = isFocused ? 22 : isSelected ? 18 : 14;

          return (
            <g
              key={node.id}
              className={onNodeClick ? 'cursor-pointer' : undefined}
              onClick={() => onNodeClick?.(node.id)}
              onMouseEnter={() => setHoveredId(node.id)}
              onMouseLeave={() => setHoveredId(null)}
              onFocus={() => setHoveredId(node.id)}
              onBlur={() => setHoveredId(null)}
              role="button"
              tabIndex={onNodeClick ? 0 : undefined}
              aria-label={`${node.label}, ${node.pathway} pathway${isSelected ? ', selected' : ''}`}
              style={{ opacity: dimmed ? 0.3 : 1, transition: 'opacity 150ms ease' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onNodeClick?.(node.id);
              }}
            >
              {isSelected && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={r + 6}
                  fill="none"
                  stroke="var(--accent-violet)"
                  strokeWidth="1.5"
                  opacity="0.4"
                />
              )}
              <circle
                cx={node.x}
                cy={node.y}
                r={r}
                fill={isSelected ? 'var(--accent-violet)' : 'var(--color-bg-elevated)'}
                stroke={isFocused ? 'var(--accent-cyan)' : 'var(--color-border-strong)'}
                strokeWidth={isFocused ? 2.5 : 1.5}
                opacity={isSelected || isFocused ? 1 : 0.75}
              />
              <text
                x={node.x}
                y={node.y + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={isSelected ? 'var(--color-bg-base)' : 'var(--color-text-primary)'}
                fontSize={isSelected ? 8 : 7}
                fontWeight="600"
              >
                {node.shortLabel.slice(0, 8)}
              </text>
              <text
                x={node.x}
                y={node.y + r + 12}
                textAnchor="middle"
                fill="var(--color-text-faint)"
                fontSize="6"
                fontFamily="var(--font-mono)"
              >
                {node.evidence}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="flex flex-wrap gap-3 mt-3 justify-center text-micro font-mono">
        {(['synergy', 'potential', 'caution', 'contraindication'] as const).map((type) => (
          <span key={type} className="flex items-center gap-1.5 text-muted-foreground">
            <span
              className="w-3 h-0.5 rounded-full"
              style={{ background: edgeColors[type] }}
            />
            {type}
          </span>
        ))}
      </div>
    </div>
  );
}
