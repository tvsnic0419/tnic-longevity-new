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

  // Canonical evidence-tier colors (A emerald / B cyan / C amber) — the same
  // mapping EvidenceTag and tierColor() use site-wide, so the letter inside
  // each node reads as the same grade a user sees on the compound module.
  const tierFill: Record<string, string> = {
    A: 'var(--accent-emerald)',
    B: 'var(--accent-cyan)',
    C: 'var(--accent-amber)',
  };

  const RING_R = 165;
  const CX = 240;
  const CY = 240;

  return (
    <div className={cn('relative w-full', className)}>
      <svg
        viewBox="0 0 480 480"
        className="w-full h-auto max-h-[520px]"
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

        {/* Guide ring — the orbit the pathway clusters are laid out on. */}
        <circle
          cx={CX}
          cy={CY}
          r={RING_R}
          fill="none"
          stroke="var(--color-border-subtle)"
          strokeWidth="1"
          strokeDasharray="1 5"
        />

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
          // Degree-sized nodes: a compound with ten documented interactions
          // reads bigger than one with two. Focus/selection raise it further.
          const baseR = 9 + Math.min(node.degree ?? 1, 8) * 1.2;
          const r = isFocused ? baseR + 5 : isSelected ? baseR + 2.5 : baseR;

          // Radial label outside the ring — rotated to follow the orbit,
          // flipped on the left half so text never reads upside-down.
          const angleDeg = ((node.angle ?? 0) * 180) / Math.PI;
          const onRight = Math.cos(node.angle ?? 0) >= 0;
          const labelR = RING_R + r + 12;
          const lx = CX + labelR * Math.cos(node.angle ?? 0);
          const ly = CY + labelR * Math.sin(node.angle ?? 0);

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
                stroke={isFocused ? 'var(--accent-cyan)' : tierFill[node.evidence] ?? 'var(--color-border-strong)'}
                strokeWidth={isFocused ? 2.5 : 1.5}
                strokeOpacity={isSelected || isFocused ? 1 : 0.55}
                opacity={isSelected || isFocused ? 1 : 0.9}
              />
              {/* Tier letter inside the node — the ring color above already
                  carries the grade, this makes it explicit at a glance. */}
              <text
                x={node.x}
                y={node.y + 0.5}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={isSelected ? 'var(--color-bg-base)' : tierFill[node.evidence] ?? 'var(--color-text-primary)'}
                fontSize="8"
                fontWeight="700"
                fontFamily="var(--font-mono)"
              >
                {node.evidence}
              </text>
              <text
                x={lx}
                y={ly}
                textAnchor={onRight ? 'start' : 'end'}
                dominantBaseline="middle"
                transform={`rotate(${onRight ? angleDeg : angleDeg + 180} ${lx} ${ly})`}
                fill={isFocused ? 'var(--color-text-primary)' : 'var(--color-text-muted)'}
                fontSize="7.5"
                fontWeight={isFocused || isSelected ? 600 : 400}
                fontFamily="var(--font-sans)"
              >
                {node.shortLabel}
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

      {/* Honest omission note — zero-degree catalogued compounds are excluded
          from the map (they'd render as an illegible label band with no
          edges), and the caption says so rather than dropping them silently. */}
      {graph.stats.isolatedCount > 0 && (
        <p className="mt-2 text-center text-micro text-muted-foreground/70">
          {graph.stats.isolatedCount} catalogued compounds have no documented pair interaction yet
          and are omitted from the map.
        </p>
      )}

      {/* Always-visible fallback table — the graph above only surfaces edge
          data on hover/focus; this gives the same data to anyone who doesn't
          want the interaction (or can't use it). Matches
          ConnectionMatrix.tsx's established idiom. */}
      {visibleEdges.length > 0 && (
        <div className="mt-4 scroll-region rounded-2xl border border-border/70 bg-card/30">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">
              All {visibleEdges.length} interactions in this stack&apos;s network, with type and detail.
            </caption>
            <thead>
              <tr className="border-b border-border/60">
                <th scope="col" className="px-3 py-2 text-label text-muted-foreground">Compound A</th>
                <th scope="col" className="px-3 py-2 text-label text-muted-foreground">Compound B</th>
                <th scope="col" className="px-3 py-2 text-label text-muted-foreground">Type</th>
                <th scope="col" className="px-3 py-2 text-label text-muted-foreground">Detail</th>
              </tr>
            </thead>
            <tbody>
              {visibleEdges.map((edge) => {
                const source = nodeMap.get(edge.source);
                const target = nodeMap.get(edge.target);
                return (
                  <tr key={edge.id} className="border-t border-border/50">
                    <td className="px-3 py-2 text-body-sm">{source?.label ?? edge.source}</td>
                    <td className="px-3 py-2 text-body-sm">{target?.label ?? edge.target}</td>
                    <td className="px-3 py-2 text-caption capitalize" style={{ color: edgeColors[edge.type] }}>
                      {edge.type}
                    </td>
                    <td className="px-3 py-2 text-body-sm text-muted-foreground">{edge.detail}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
