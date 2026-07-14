'use client';

import React, { useState } from 'react';

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
  pathway: string;
  color: string;
}

const nodes: Node[] = [
  { id: 'nmn', label: 'NMN', x: 200, y: 120, color: 'var(--accent-cyan)' },
  { id: 'glynac', label: 'GlyNAC', x: 320, y: 80, color: 'var(--accent-emerald)' },
  { id: 'sulforaphane', label: 'Sulforaphane', x: 320, y: 160, color: 'var(--accent-amber)' },
  { id: 'resveratrol', label: 'Resveratrol', x: 120, y: 80, color: 'var(--accent-violet)' },
  { id: 'ca-akg', label: 'Ca-AKG', x: 120, y: 160, color: 'var(--accent-rose)' },
  { id: 'fisetin', label: 'Fisetin', x: 260, y: 200, color: 'var(--accent-rose)' },
];

const edges: Edge[] = [
  { from: 'nmn', to: 'glynac', strength: 3, pathway: 'NAD+ + GSH', color: 'var(--accent-cyan)' },
  { from: 'glynac', to: 'sulforaphane', strength: 3, pathway: 'NRF2 + GSH', color: 'var(--accent-amber)' },
  { from: 'nmn', to: 'resveratrol', strength: 2, pathway: 'SIRT1', color: 'var(--accent-violet)' },
  { from: 'nmn', to: 'ca-akg', strength: 2, pathway: 'NAD+ + TCA', color: 'var(--accent-rose)' },
  { from: 'glynac', to: 'fisetin', strength: 2, pathway: 'Antioxidant + Senolytic', color: 'var(--accent-rose)' },
  { from: 'sulforaphane', to: 'resveratrol', strength: 1, pathway: 'NRF2 + SIRT1', color: 'var(--accent-violet)' },
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
        className="rounded-2xl bg-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)]"
        aria-label="Synergy Network: Key compounds and their mechanistic connections"
      >
        {/* Background grid for scientific feel */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--color-border-subtle)" strokeWidth="0.5" />
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
                fill="var(--color-bg-elevated)"
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
                fill="var(--color-text-primary)"
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
                    fill="var(--color-bg-elevated)"
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
          <text x="0" y="0" fill="var(--color-text-muted)" fontSize="9" fontWeight="500">Synergy Strength</text>
          <line x1="0" y1="12" x2="25" y2="12" stroke="var(--accent-cyan)" strokeWidth="3" />
          <text x="30" y="15" fill="var(--color-text-muted)" fontSize="8">Strong</text>
          <line x1="70" y1="12" x2="95" y2="12" stroke="var(--accent-cyan)" strokeWidth="2" />
          <text x="100" y="15" fill="var(--color-text-muted)" fontSize="8">Medium</text>
          <line x1="140" y1="12" x2="155" y2="12" stroke="var(--accent-cyan)" strokeWidth="1.5" />
          <text x="160" y="15" fill="var(--color-text-muted)" fontSize="8">Additive</text>
        </g>
      </svg>

      {/* Hover info */}
      {hoveredNode && (
        <div className="absolute bottom-3 right-3 bg-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)] rounded-lg px-3 py-1.5 text-xs text-[var(--color-text-secondary)] pointer-events-none">
          {nodes.find(n => n.id === hoveredNode)?.label} • {getConnectedEdges(hoveredNode).length} synergies
        </div>
      )}
    </div>
  );
};
