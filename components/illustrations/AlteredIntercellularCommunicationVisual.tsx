'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const AlteredIntercellularCommunicationVisual: React.FC<{ className?: string; showLabels?: boolean; accentColor?: string }> = ({
  className = '',
  showLabels = true,
}) => {
  return (
    <div className={`relative tnic-glass rounded-2xl p-5 overflow-hidden ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-label text-[var(--accent-violet)] mb-0.5">HALLMARK 09</div>
          <h3 className="heading-card text-lg">Altered Intercellular Communication</h3>
        </div>
      </div>

      <motion.div whileInView={{ opacity: 1 }} initial={{ opacity: 0.7 }} viewport={{ once: true }}>
        <svg viewBox="0 0 420 180" className="w-full h-auto">
          <g>
            <circle cx="120" cy="90" r="25" fill="#020811" stroke="#c084fc" strokeWidth="2.5" />
            <circle cx="200" cy="90" r="25" fill="#020811" stroke="#c084fc" strokeWidth="2.5" />
            <circle cx="280" cy="90" r="25" fill="#020811" stroke="#c084fc" strokeWidth="2.5" />
            
            {/* Connection lines (signals) */}
            <path d="M145 90 L175 90" stroke="#c084fc" strokeWidth="2" strokeDasharray="4 2" />
            <path d="M225 90 L255 90" stroke="#c084fc" strokeWidth="2" strokeDasharray="4 2" />
            
            {/* Inflammatory signals */}
            <circle cx="160" cy="75" r="5" fill="#f472b6" />
            <circle cx="240" cy="105" r="5" fill="#f472b6" />
          </g>
        </svg>
      </motion.div>

      {showLabels && (
        <div className="mt-3 text-micro text-[var(--color-text-muted)]">
          Aging disrupts normal cell-to-cell signaling. Chronic inflammatory signals and reduced beneficial communication accelerate tissue dysfunction.
        </div>
      )}
    </div>
  );
};
