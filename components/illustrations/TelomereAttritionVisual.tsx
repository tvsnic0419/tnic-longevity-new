'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const TelomereAttritionVisual: React.FC<{ className?: string; showLabels?: boolean; accentColor?: string }> = ({
  className = '',
  showLabels = true,
}) => {
  return (
    <div className={`relative tnic-glass rounded-2xl p-5 overflow-hidden ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-label text-[var(--accent-emerald)] mb-0.5">HALLMARK 02</div>
          <h4 className="heading-card text-lg">Telomere Attrition</h4>
        </div>
      </div>

      <motion.div whileInView={{ opacity: 1 }} initial={{ opacity: 0.7 }} viewport={{ once: true }}>
        <svg viewBox="0 0 420 180" className="w-full h-auto">
          <g>
            <rect x="80" y="60" width="260" height="12" rx="6" fill="#020811" stroke="#10b981" strokeWidth="2" />
            <rect x="90" y="64" width="240" height="4" rx="2" fill="#10b981" opacity="0.6" />
          </g>
          <g>
            <circle cx="340" cy="66" r="18" fill="#020811" stroke="#f59e0b" strokeWidth="2" />
            <text x="340" y="71" textAnchor="middle" fill="#fafafa" fontSize="9" fontWeight="600">Telomerase</text>
          </g>
        </svg>
      </motion.div>

      {showLabels && (
        <div className="mt-3 text-micro text-[var(--color-text-muted)]">
          Progressive shortening of telomeres with each cell division. Telomerase activation and lifestyle factors can slow attrition.
        </div>
      )}
    </div>
  );
};
