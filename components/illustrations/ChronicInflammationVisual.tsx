'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const ChronicInflammationVisual: React.FC<{ className?: string; showLabels?: boolean; accentColor?: string }> = ({
  className = '',
  accentColor = '#f472b6',
  showLabels = true,
}) => {
  return (
    <div className={`relative tnic-glass rounded-2xl p-5 overflow-hidden ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-label text-[var(--accent-rose)] mb-0.5">HALLMARK 10</div>
          <h4 className="heading-card text-lg">Chronic Inflammation</h4>
        </div>
        {showLabels && <div className="text-right text-micro text-[var(--color-text-muted)]">NF-κB · Cytokines · Resolution</div>}
      </div>

      <motion.div whileInView={{ opacity: 1 }} initial={{ opacity: 0.7 }} viewport={{ once: true, margin: "-30px" }}>
        <svg viewBox="0 0 420 200" className="w-full h-auto" aria-label="Chronic Inflammation visualization">
          <g>
            <ellipse cx="120" cy="100" rx="55" ry="40" fill="#020811" stroke={accentColor} strokeWidth="2.5" />
            <circle cx="95" cy="80" r="12" fill="#f472b6" opacity="0.7" />
            <circle cx="140" cy="115" r="10" fill="#f472b6" opacity="0.6" />
          </g>

          <g stroke="#f472b6" strokeWidth="2" strokeLinecap="round">
            <path d="M175 90 L220 70" />
            <path d="M175 105 L220 100" />
            <path d="M175 120 L220 130" />
          </g>

          <g>
            <circle cx="260" cy="95" r="25" fill="#020811" stroke="#f59e0b" strokeWidth="2.5" />
            <text x="260" y="100" textAnchor="middle" fill="#fafafa" fontSize="10" fontWeight="600">NF-κB</text>
          </g>

          <g stroke="#10b981" strokeWidth="2.5" strokeLinecap="round">
            <path d="M300 95 L350 95" />
            <polygon points="350,95 342,90 342,100" fill="#10b981" />
          </g>

          {showLabels && (
            <>
              <text x="120" y="55" textAnchor="middle" fill={accentColor} fontSize="9">Inflamed Tissue</text>
              <text x="260" y="65" textAnchor="middle" fill="#f59e0b" fontSize="9">NF-κB Active</text>
              <text x="355" y="80" textAnchor="middle" fill="#10b981" fontSize="9">Resolution</text>
            </>
          )}
        </svg>
      </motion.div>

      {showLabels && (
        <div className="mt-3 text-micro text-[var(--color-text-muted)] leading-snug">
          Persistent low-grade inflammation drives aging. NF-κB activation sustains cytokine release. Omega-3s and specialized pro-resolving mediators (SPMs) help resolve it.
        </div>
      )}
    </div>
  );
};
