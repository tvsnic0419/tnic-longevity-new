'use client';

import { useMemo } from 'react';
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
  const nodeMap = useMemo(
    () => new Map(graph.nodes.map((n) => [n.id, n])),
    [graph.nodes],
  );

  const visibleEdges = graph.edges.filter((e) => {
    const s = nodeMap.get(e.source);
    const t = nodeMap.get(e.target);
    return s && t;
  });

  return (
    <div className={cn('relative w-full', className)}>
      <svg
        viewBox="0 0 400 400"
        className="w-full h-auto max-h-[420px]"
        role="img"
        aria-label="Supplement interaction network graph"
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
          const opacity = edge.active ? 0.85 : 0.2;
          const strokeWidth = edge.active ? (edge.type === 'contraindication' ? 2.5 : 2) : 1;

          return (
            <g key={edge.id}>
              <path
                d={edgePath(source, target)}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeOpacity={opacity}
                strokeDasharray={edge.type === 'potential' ? '4 3' : edge.active ? undefined : '2 4'}
                markerEnd={edge.active ? `url(#arrow-${edge.type})` : undefined}
              />
            </g>
          );
        })}

        {graph.nodes.map((node) => {
          const isHighlighted = highlightNodeId === node.id;
          const isSelected = node.selected;
          const r = isHighlighted ? 22 : isSelected ? 18 : 14;

          return (
            <g
              key={node.id}
              className={onNodeClick ? 'cursor-pointer' : undefined}
              onClick={() => onNodeClick?.(node.id)}
              role="button"
              tabIndex={onNodeClick ? 0 : undefined}
              aria-label={`${node.label}${isSelected ? ', selected' : ''}`}
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
                stroke={isHighlighted ? 'var(--accent-cyan)' : 'var(--color-border-strong)'}
                strokeWidth={isHighlighted ? 2.5 : 1.5}
                opacity={isSelected || isHighlighted ? 1 : 0.75}
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

      <div className="flex flex-wrap gap-3 mt-3 justify-center text-[10px] font-mono">
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