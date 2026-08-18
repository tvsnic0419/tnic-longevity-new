'use client';

import React, { useState } from 'react';
import { VIZ } from '@/components/viz/tokens';
import { getEdgeExplanation } from '@/lib/hero-network';

interface SynergyNetworkProps {
  className?: string;
  width?: number;
  height?: number;
  highlightedCompounds?: string[];
}

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string;
}

interface Edge {
  from: string;
  to: string;
  strength: number; // 1-3
  /** Short cluster label, shown as a compact subtitle — the full "why" text
   *  comes from getEdgeExplanation(from, to) at render time (see below), not
   *  from this field, so it can't silently drift from the canonical
   *  synergy-mechanism data. */
  pathway: string;
  color: string;
}

// Sourced from the canonical viz tokens, not restated, so this can't drift
// from EvidenceTag/tierColor() the way a second hardcoded copy could.
const nodes: Node[] = [
  { id: 'nmn', label: 'NMN', x: 200, y: 120, color: VIZ.cyan },
  { id: 'glynac', label: 'GlyNAC', x: 320, y: 80, color: VIZ.emerald },
  { id: 'sulforaphane', label: 'Sulforaphane', x: 320, y: 160, color: VIZ.amber },
  { id: 'resveratrol', label: 'Resveratrol', x: 120, y: 80, color: VIZ.violet },
  // 'cakg', not 'ca-akg' — the real compound id used everywhere else
  // (lib/data.ts, EmergentEffectsView's compoundHrefs); the old id was a
  // silent dead-end for any id-based lookup against this node.
  { id: 'cakg', label: 'Ca-AKG', x: 120, y: 160, color: VIZ.rose },
  { id: 'fisetin', label: 'Fisetin', x: 260, y: 200, color: VIZ.rose },
];

const edges: Edge[] = [
  { from: 'nmn', to: 'glynac', strength: 3, pathway: 'NAD+ + GSH', color: VIZ.cyan },
  { from: 'glynac', to: 'sulforaphane', strength: 3, pathway: 'NRF2 + GSH', color: VIZ.amber },
  { from: 'nmn', to: 'resveratrol', strength: 2, pathway: 'SIRT1', color: VIZ.violet },
  { from: 'nmn', to: 'cakg', strength: 2, pathway: 'NAD+ + TCA', color: VIZ.rose },
  { from: 'glynac', to: 'fisetin', strength: 2, pathway: 'Antioxidant + Senolytic', color: VIZ.rose },
  { from: 'sulforaphane', to: 'resveratrol', strength: 1, pathway: 'NRF2 + SIRT1', color: VIZ.violet },
];

export const SynergyNetworkVisual: React.FC<SynergyNetworkProps> = ({
  className = '',
  width = 420,
  height = 260,
  highlightedCompounds = []
}) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const isHighlighted = (id: string) => 
    highlightedCompounds.includes(id) || hoveredNode === id;

  const getConnectedEdges = (nodeId: string) => 
    edges.filter(e => e.from === nodeId || e.to === nodeId);

  return (
    <div className={`relative ${className}`}>
      <svg 
        width={width} 
        height={height} 
        viewBox={`0 0 ${width} ${height}`}
        className="rounded-2xl bg-[#0a0f1a] border border-white/10"
        aria-label="Synergy Network: Key compounds and their mechanistic connections"
      >
        {/* Background grid for scientific feel */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1f2937" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width={width} height={height} fill="url(#grid)" opacity="0.4" />

        {/* Edges */}
        {edges.map((edge, index) => {
          const fromNode = nodes.find(n => n.id === edge.from)!;
          const toNode = nodes.find(n => n.id === edge.to)!;
          const isActive = hoveredNode === edge.from || hoveredNode === edge.to;
          
          return (
            <g key={index}>
              <line
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke={edge.color}
                strokeWidth={edge.strength * 1.5 + (isActive ? 1.5 : 0)}
                strokeOpacity={isActive ? 0.95 : 0.65}
                strokeLinecap="round"
              />
              {/* Subtle glow on strong edges */}
              {edge.strength === 3 && (
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={edge.color}
                  strokeWidth={edge.strength * 3}
                  strokeOpacity={isActive ? 0.25 : 0.1}
                  strokeLinecap="round"
                />
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const isActive = isHighlighted(node.id);
          const connectedCount = getConnectedEdges(node.id).length;
          
          return (
            <g 
              key={node.id}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* Node circle */}
              <circle
                cx={node.x}
                cy={node.y}
                r={isActive ? 18 : 15}
                fill="#0a0f1a"
                stroke={node.color}
                strokeWidth={isActive ? 3 : 2}
                className="transition-all duration-150"
              />
              {/* Inner glow for active */}
              {isActive && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={22}
                  fill="none"
                  stroke={node.color}
                  strokeWidth={1.5}
                  strokeOpacity={0.3}
                />
              )}
              {/* Label */}
              <text
                x={node.x}
                y={node.y + 4}
                textAnchor="middle"
                fill="white"
                fontSize={isActive ? "11" : "10"}
                fontWeight={isActive ? "600" : "500"}
                className="pointer-events-none select-none"
              >
                {node.label}
              </text>
              {/* Connection count badge */}
              {connectedCount > 0 && (
                <g>
                  <circle
                    cx={node.x + 22}
                    cy={node.y - 18}
                    r="8"
                    fill="#111827"
                    stroke={node.color}
                    strokeWidth="1"
                  />
                  <text
                    x={node.x + 22}
                    y={node.y - 15}
                    textAnchor="middle"
                    fill={node.color}
                    fontSize="8"
                    fontWeight="600"
                  >
                    {connectedCount}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Legend */}
        <g transform="translate(20, 220)">
          <text x="0" y="0" fill="#9ca3af" fontSize="9" fontWeight="500">Synergy Strength</text>
          <line x1="0" y1="12" x2="25" y2="12" stroke="#00e0ff" strokeWidth="3" />
          <text x="30" y="15" fill="#9ca3af" fontSize="8">Strong</text>
          <line x1="70" y1="12" x2="95" y2="12" stroke="#00e0ff" strokeWidth="2" />
          <text x="100" y="15" fill="#9ca3af" fontSize="8">Medium</text>
          <line x1="140" y1="12" x2="155" y2="12" stroke="#00e0ff" strokeWidth="1.5" />
          <text x="160" y="15" fill="#9ca3af" fontSize="8">Additive</text>
        </g>
      </svg>

      {/* Hover info */}
      {hoveredNode && (
        <div className="absolute bottom-3 right-3 bg-[#111827] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white/90 pointer-events-none">
          {nodes.find(n => n.id === hoveredNode)?.label} • {getConnectedEdges(hoveredNode).length} synergies
        </div>
      )}

      {/* Always-visible fallback table — the diagram above only surfaces
          edge data on hover; this gives the same data to anyone who doesn't
          want the interaction (or can't use it). */}
      <div className="mt-3 scroll-region rounded-2xl border border-white/10 bg-card/30">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">
            All {edges.length} synergy connections shown in this diagram, with strength and mechanism.
          </caption>
          <thead>
            <tr className="border-b border-white/10">
              <th scope="col" className="px-3 py-2 text-label text-muted-foreground">Compound A</th>
              <th scope="col" className="px-3 py-2 text-label text-muted-foreground">Compound B</th>
              <th scope="col" className="px-3 py-2 text-label text-muted-foreground">Strength</th>
              <th scope="col" className="px-3 py-2 text-label text-muted-foreground">Mechanism</th>
            </tr>
          </thead>
          <tbody>
            {edges.map((e) => (
              <tr key={`${e.from}-${e.to}`} className="border-t border-white/5">
                <td className="px-3 py-2 text-body-sm">{nodes.find((n) => n.id === e.from)?.label ?? e.from}</td>
                <td className="px-3 py-2 text-body-sm">{nodes.find((n) => n.id === e.to)?.label ?? e.to}</td>
                <td className="px-3 py-2 text-caption text-muted-foreground">
                  {e.strength === 3 ? 'Strong' : e.strength === 2 ? 'Medium' : 'Additive'}
                </td>
                <td className="px-3 py-2 text-body-sm text-muted-foreground">{getEdgeExplanation(e.from, e.to).text}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
