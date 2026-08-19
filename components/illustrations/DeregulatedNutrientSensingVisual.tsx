'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const DeregulatedNutrientSensingVisual: React.FC<{ className?: string; showLabels?: boolean; accentColor?: string }> = ({
  className = '',
  showLabels = true,
}) => {
  return (
    <div className={`relative tnic-glass rounded-2xl p-5 overflow-hidden ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-label text-[var(--accent-amber)] mb-0.5">HALLMARK 12</div>
          <h4 className="heading-card text-lg">Deregulated Nutrient Sensing</h4>
        </div>
      </div>

      <motion.div whileInView={{ opacity: 1 }} initial={{ opacity: 0.7 }} viewport={{ once: true }}>
        <svg viewBox="0 0 420 180" className="w-full h-auto">
          <g>
            <circle cx="130" cy="90" r="28" fill="#020811" stroke="#fbbf24" strokeWidth="2.5" />
            <text x="130" y="95" textAnchor="middle" fill="#fafafa" fontSize="9" fontWeight="600">mTOR</text>
            
            <circle cx="220" cy="90" r="28" fill="#020811" stroke="#fbbf24" strokeWidth="2.5" />
            <text x="220" y="95" textAnchor="middle" fill="#fafafa" fontSize="9" fontWeight="600">AMPK</text>
            
            <circle cx="310" cy="90" r="28" fill="#020811" stroke="#fbbf24" strokeWidth="2.5" />
            <text x="310" y="95" textAnchor="middle" fill="#fafafa" fontSize="9" fontWeight="600">SIRT1</text>
          </g>
        </svg>
      </motion.div>

      {showLabels && (
        <div className="mt-3 text-micro text-[var(--color-text-muted)]">
          Aging disrupts nutrient sensing pathways (mTOR, AMPK, SIRT1). Caloric restriction mimetics and proper timing help restore balance.
        </div>
      )}
    </div>
  );
};
