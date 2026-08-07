'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface GenomicInstabilityVisualProps {
  className?: string;
  accentColor?: string;
  showLabels?: boolean;
  interactive?: boolean;
}

export const GenomicInstabilityVisual: React.FC<GenomicInstabilityVisualProps> = ({
  className = '',
  accentColor = '#00e0ff',
  showLabels = true,
}) => {
  return (
    <div className={`relative tnic-glass rounded-2xl p-5 overflow-hidden ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-label text-[var(--accent-cyan)] mb-0.5">HALLMARK 01</div>
          <h4 className="heading-card text-lg">Genomic Instability</h4>
        </div>
        {showLabels && <div className="text-right text-[10px] text-[var(--color-text-muted)]">DNA Damage · Repair · NAD+</div>}
      </div>

      <motion.div whileInView={{ opacity: 1 }} initial={{ opacity: 0.6 }} viewport={{ once: true, margin: "-50px" }}>
        <svg viewBox="0 0 420 200" className="w-full h-auto" aria-label="Genomic Instability: DNA damage, PARP, NAD+ consumption and repair pathways" role="img">
          <defs>
            <linearGradient id="dnaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={accentColor} stopOpacity="0.3" />
              <stop offset="100%" stopColor={accentColor} stopOpacity="0.1" />
            </linearGradient>
          </defs>

          <g stroke="#334155" strokeWidth="1.5" opacity="0.4">
            <path d="M60 40 Q90 70 60 100 Q90 130 60 160" />
            <path d="M80 40 Q50 70 80 100 Q50 130 80 160" />
            <path d="M140 40 Q170 70 140 100 Q170 130 140 160" />
            <path d="M160 40 Q130 70 160 100 Q130 130 160 160" />
          </g>

          <g>
            <path d="M200 55 Q240 75 200 95" stroke="#f472b6" strokeWidth="3" strokeLinecap="round" />
            <circle cx="210" cy="70" r="5" fill="#f472b6" opacity="0.7" />
            <circle cx="225" cy="82" r="4" fill="#f472b6" opacity="0.6" />
          </g>

          <g>
            <circle cx="280" cy="75" r="22" fill="#020811" stroke={accentColor} strokeWidth="2.5" />
            <text x="280" y="80" textAnchor="middle" fill="#fafafa" fontSize="10" fontWeight="600">PARP</text>
          </g>

          <g stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round">
            <path d="M310 75 L350 75" />
            <polygon points="350,75 342,70 342,80" fill="#fbbf24" />
          </g>

          <g>
            <rect x="360" y="55" width="45" height="40" rx="6" fill="#020811" stroke="#fbbf24" strokeWidth="2" />
            <text x="382" y="80" textAnchor="middle" fill="#fafafa" fontSize="9" fontWeight="600">NAD+</text>
          </g>

          <g stroke="#34d399" strokeWidth="2.5" strokeLinecap="round">
            <path d="M200 130 L240 155" />
            <polygon points="240,155 232,150 235,158" fill="#34d399" />
          </g>

          {showLabels && (
            <>
              <text x="200" y="45" textAnchor="middle" fill="#f472b6" fontSize="9">DNA Damage</text>
              <text x="280" y="55" textAnchor="middle" fill={accentColor} fontSize="9">PARP Activation</text>
              <text x="382" y="50" textAnchor="middle" fill="#fbbf24" fontSize="9">NAD+ Drain</text>
              <text x="195" y="175" textAnchor="start" fill="#34d399" fontSize="9">NRF2 / NMN Repair</text>
            </>
          )}
        </svg>
      </motion.div>

      {showLabels && (
        <div className="mt-3 text-[10px] text-[var(--color-text-muted)] leading-snug">
          Daily DNA damage overwhelms repair systems. PARP consumes NAD+ rapidly. NMN + NRF2 activation supports repair and preserves NAD+ pools.
        </div>
      )}
    </div>
  );
};
