'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const StemCellExhaustionVisual: React.FC<{ className?: string; showLabels?: boolean; accentColor?: string }> = ({
  className = '',
  showLabels = true,
}) => {
  return (
    <div className={`relative tnic-glass rounded-2xl p-5 overflow-hidden ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-label text-[var(--accent-emerald)] mb-0.5">HALLMARK 08</div>
          <h4 className="heading-card text-lg">Stem Cell Exhaustion</h4>
        </div>
      </div>

      <motion.div whileInView={{ opacity: 1 }} initial={{ opacity: 0.7 }} viewport={{ once: true }}>
        <svg viewBox="0 0 420 180" className="w-full h-auto">
          <g>
            <circle cx="150" cy="90" r="30" fill="#020811" stroke="#10b981" strokeWidth="2.5" />
            <text x="150" y="95" textAnchor="middle" fill="#fafafa" fontSize="10" fontWeight="600">Stem Cell</text>
            
            {/* Depleted / exhausted indicators */}
            <circle cx="220" cy="70" r="8" fill="#f59e0b" opacity="0.6" />
            <circle cx="250" cy="100" r="7" fill="#f59e0b" opacity="0.5" />
            
            {/* Regeneration arrow */}
            <path d="M300 90 L350 90" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
            <polygon points="350,90 342,85 342,95" fill="#10b981" />
          </g>
        </svg>
      </motion.div>

      {showLabels && (
        <div className="mt-3 text-micro text-[var(--color-text-muted)]">
          Stem cells lose regenerative capacity with age. Supporting niches and reducing chronic damage can help preserve function.
        </div>
      )}
    </div>
  );
};
