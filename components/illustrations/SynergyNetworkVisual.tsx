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
  { id: 'nmn', label: 'NMN', x: 200, y: 120, color: '#22d3ee' },
  { id: 'glynac', label: 'GlyNAC', x: 320, y: 80, color: '#34d399' },
  { id: 'sulforaphane', label: 'Sulforaphane', x: 320, y: 160, color: '#fbbf24' },
  { id: 'resveratrol', label: 'Resveratrol', x: 120, y: 80, color: '#a78bfa' },
  { id: 'ca-akg', label: 'Ca-AKG', x: 120, y: 160, color: '#f87171' },
  { id: 'fisetin', label: 'Fisetin', x: 260, y: 200, color: '#fb7185' },
];

const edges: Edge[] = [
  { from: 'nmn', to: 'glynac', strength: 3, pathway: 'NAD+ + GSH', color: '#22d3ee' },
  { from: 'glynac', to: 'sulforaphane', strength: 3, pathway: 'NRF2 + GSH', color: '#fbbf24' },
  { from: 'nmn', to: 'resveratrol', strength: 2, pathway: 'SIRT1', color: '#a78bfa' },
  { from: 'nmn', to: 'ca-akg', strength: 2, pathway: 'NAD+ + TCA', color: '#f87171' },
  { from: 'glynac', to: 'fisetin', strength: 2, pathway: 'Antioxidant + Senolytic', color: '#fb7185' },
  { from: 'sulforaphane', to: 'resveratrol', strength: 1, pathway: 'NRF2 + SIRT1', color: '#a78bfa' },
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
          <line x1="0" y1="12" x2="25" y2="12" stroke="#22d3ee" strokeWidth="3" />
          <text x="30" y="15" fill="#9ca3af" fontSize="8">Strong</text>
          <line x1="70" y1="12" x2="95" y2="12" stroke="#22d3ee" strokeWidth="2" />
          <text x="100" y="15" fill="#9ca3af" fontSize="8">Medium</text>
          <line x1="140" y1="12" x2="155" y2="12" stroke="#22d3ee" strokeWidth="1.5" />
          <text x="160" y="15" fill="#9ca3af" fontSize="8">Additive</text>
        </g>
      </svg>

      {/* Hover info */}
      {hoveredNode && (
        <div className="absolute bottom-3 right-3 bg-[#111827] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white/80 pointer-events-none">
          {nodes.find(n => n.id === hoveredNode)?.label} • {getConnectedEdges(hoveredNode).length} synergies
        </div>
      )}
    </div>
  );
};
