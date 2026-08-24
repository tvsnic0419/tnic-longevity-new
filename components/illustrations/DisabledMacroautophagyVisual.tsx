'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const DisabledMacroautophagyVisual: React.FC<{ className?: string; showLabels?: boolean; accentColor?: string }> = ({
  className = '',
  showLabels = true,
}) => {
  return (
    <div className={`relative tnic-glass rounded-2xl p-5 overflow-hidden ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-label text-[var(--accent-emerald)] mb-0.5">HALLMARK 12</div>
          <h4 className="heading-card text-lg">Deregulated Nutrient-sensing</h4>
        </div>
      </div>

      <motion.div whileInView={{ opacity: 1 }} initial={{ opacity: 0.7 }} viewport={{ once: true }}>
        <svg viewBox="0 0 420 180" className="w-full h-auto">
          <g>
            <ellipse cx="150" cy="90" rx="40" ry="28" fill="#020811" stroke="#34d399" strokeWidth="2.5" />
            <text x="150" y="95" textAnchor="middle" fill="#fafafa" fontSize="9" fontWeight="600">Autophagosome</text>
            
            <circle cx="260" cy="90" r="22" fill="#020811" stroke="#fbbf24" strokeWidth="2" />
            <text x="260" y="95" textAnchor="middle" fill="#fafafa" fontSize="8" fontWeight="600">Lysosome</text>
          </g>
        </svg>
      </motion.div>

      {showLabels && (
        <div className="mt-3 text-micro text-[var(--color-text-muted)]">
          Impaired autophagy leads to accumulation of damaged proteins and organelles. Fasting, spermidine, and exercise can help restore this process.
        </div>
      )}
    </div>
  );
};
