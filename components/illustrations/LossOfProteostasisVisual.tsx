'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const LossOfProteostasisVisual: React.FC<{ className?: string; showLabels?: boolean; accentColor?: string }> = ({
  className = '',
  accentColor = '#00e0ff',
  showLabels = true,
}) => {
  return (
    <div className={`relative tnic-glass rounded-2xl p-5 overflow-hidden ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-label text-[var(--accent-cyan)] mb-0.5">HALLMARK 04</div>
          <h4 className="heading-card text-lg">Loss of Proteostasis</h4>
        </div>
        {showLabels && <div className="text-right text-[10px] text-[var(--color-text-muted)]">Proteasome · Autophagy · Aggregates</div>}
      </div>

      <motion.div whileInView={{ opacity: 1 }} initial={{ opacity: 0.7 }} viewport={{ once: true, margin: "-30px" }}>
        <svg viewBox="0 0 420 200" className="w-full h-auto" aria-label="Loss of Proteostasis visualization">
          <g fill="#475569" stroke="#94a3b8" strokeWidth="1.2" opacity="0.85">
            <ellipse cx="120" cy="85" rx="22" ry="16" />
            <ellipse cx="145" cy="105" rx="18" ry="13" />
          </g>

          <g>
            <rect x="220" y="55" width="55" height="95" rx="8" fill="#020811" stroke={accentColor} strokeWidth="2.5" />
            <rect x="225" y="62" width="45" height="12" rx="3" fill="#1e2937" stroke={accentColor} strokeWidth="1" />
            <rect x="225" y="82" width="45" height="12" rx="3" fill="#1e2937" stroke={accentColor} strokeWidth="1" />
          </g>

          <g>
            <ellipse cx="340" cy="110" rx="32" ry="24" fill="#020811" stroke={accentColor} strokeWidth="2" />
          </g>

          <g stroke="#34d399" strokeWidth="2" strokeLinecap="round">
            <path d="M280 100 L310 100" />
            <polygon points="310,100 303,95 303,105" fill="#34d399" />
          </g>
        </svg>
      </motion.div>

      {showLabels && (
        <div className="mt-3 text-[10px] text-[var(--color-text-muted)] leading-snug">
          Accumulation of misfolded proteins due to declining proteasome and autophagy function. Interventions that upregulate NRF2 or support autophagy help restore proteostasis.
        </div>
      )}
    </div>
  );
};
