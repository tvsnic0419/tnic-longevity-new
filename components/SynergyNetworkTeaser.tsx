'use client';

import React from 'react';
import Link from 'next/link';

interface SynergyNetworkTeaserProps {
  className?: string;
}

export const SynergyNetworkTeaser: React.FC<SynergyNetworkTeaserProps> = ({ className = '' }) => {
  return (
    <div className={`relative tnic-glass rounded-2xl p-6 overflow-hidden ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-label text-[var(--accent-cyan)] mb-1">SYNERGY INTELLIGENCE</div>
          <h3 className="heading-card">Multi-Pathway Network</h3>
          <p className="text-body text-sm max-w-xs">NRF2 Defense + SIRT1 Activation + Mitochondrial Restoration — 2–4× uplift potential</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-semibold text-[var(--accent-emerald)]">-4.8 yr</div>
          <div className="text-xs text-[var(--color-text-secondary)]">Projected bio-age delta</div>
        </div>
      </div>

      {/* Simplified SVG Network Preview */}
      <svg viewBox="0 0 400 160" className="w-full h-40" aria-label="Synergy network preview: NRF2, SIRT1, Mitochondrial pathways">
        <defs>
          <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#67f6ff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Background subtle grid */}
        <rect x="0" y="0" width="400" height="160" fill="#020811" opacity="0.3" />

        {/* Nodes - NRF2 (cyan) */}
        <g>
          <circle cx="80" cy="60" r="22" fill="#020811" stroke="#67f6ff" strokeWidth="2.5" />
          <text x="80" y="65" textAnchor="middle" fill="#fafafa" fontSize="11" fontWeight="600">NRF2</text>
          <circle cx="80" cy="60" r="8" fill="#67f6ff" opacity="0.3" />
        </g>

        {/* SIRT1 (violet) */}
        <g>
          <circle cx="200" cy="45" r="20" fill="#020811" stroke="#c084fc" strokeWidth="2.5" />
          <text x="200" y="50" textAnchor="middle" fill="#fafafa" fontSize="11" fontWeight="600">SIRT1</text>
        </g>

        {/* Mitochondrial (emerald) */}
        <g>
          <circle cx="320" cy="70" r="24" fill="#020811" stroke="#10b981" strokeWidth="2.5" />
          <text x="320" y="75" textAnchor="middle" fill="#fafafa" fontSize="10" fontWeight="600">MITO</text>
          <circle cx="320" cy="70" r="10" fill="#10b981" opacity="0.25" />
        </g>

        {/* Connection edges with evidence weight */}
        <line x1="100" y1="55" x2="180" y2="50" stroke="url(#edgeGradient)" strokeWidth="3" strokeOpacity="0.7" />
        <line x1="220" y1="55" x2="300" y2="65" stroke="#c084fc" strokeWidth="2.5" strokeOpacity="0.6" />
        <line x1="95" y1="75" x2="300" y2="80" stroke="#10b981" strokeWidth="2" strokeOpacity="0.5" />

        {/* Subtle glow dots for activity */}
        <circle cx="140" cy="52" r="3" fill="#67f6ff" opacity="0.8">
          <animate attributeName="opacity" values="0.4;0.9;0.4" dur="3s" repeatCount="indefinite" />
        </circle>
      </svg>

      <div className="mt-4 flex items-center justify-between text-xs">
        <div className="flex gap-3 text-[var(--color-text-secondary)]">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[var(--accent-cyan)]" /> NRF2 Defense</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[var(--accent-violet)]" /> SIRT1/PGC-1α</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[var(--accent-emerald)]" /> Mitochondrial</span>
        </div>
        <Link href="/library" className="text-[var(--accent-cyan)] hover:underline flex items-center gap-1 group">
          Explore full network <span className="group-hover:translate-x-0.5 transition">→</span>
        </Link>
      </div>
    </div>
  );
};
