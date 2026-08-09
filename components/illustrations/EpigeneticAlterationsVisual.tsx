'use client';

import React from 'react';

interface EpigeneticAlterationsVisualProps {
  className?: string;
  accentColor?: string;
  showLabels?: boolean;
  interactive?: boolean;
}

/**
 * High-detail SVG for Epigenetic Alterations hallmark.
 * Shows DNA methylation, histone modification, and intervention points.
 */
export const EpigeneticAlterationsVisual: React.FC<EpigeneticAlterationsVisualProps> = ({
  className = '',
  accentColor = '#c084fc',
  showLabels = true,
}) => {
  return (
    <div className={`relative tnic-glass rounded-2xl p-5 overflow-hidden ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-label text-[var(--accent-violet)] mb-0.5">HALLMARK 03</div>
          <h4 className="heading-card text-lg">Epigenetic Alterations</h4>
        </div>
        {showLabels && <div className="text-right text-micro text-[var(--color-text-muted)]">Methylation · Histones · Gene Expression</div>}
      </div>

      <svg viewBox="0 0 420 200" className="w-full h-auto" aria-label="Epigenetic Alterations: DNA methylation, histone modification and gene expression changes" role="img">
        <defs>
          <linearGradient id="methylGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.25" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* DNA Strand with Methylation Marks */}
        <g>
          <path d="M70 50 Q120 80 70 110 Q120 140 70 170" stroke="#475569" strokeWidth="3" fill="none" />
          {/* Methyl groups (dots) */}
          <circle cx="85" cy="65" r="5" fill={accentColor} />
          <circle cx="95" cy="90" r="4.5" fill={accentColor} />
          <circle cx="80" cy="115" r="5" fill={accentColor} />
          <circle cx="100" cy="145" r="4" fill={accentColor} />
        </g>

        {/* Histone / Chromatin structure */}
        <g>
          <circle cx="200" cy="100" r="35" fill="#020811" stroke={accentColor} strokeWidth="2.5" />
          <circle cx="200" cy="100" r="22" fill="#111827" />
          <text x="200" y="105" textAnchor="middle" fill="#fafafa" fontSize="10" fontWeight="600">Histone</text>
        </g>

        {/* Gene Expression Arrow */}
        <g stroke="#34d399" strokeWidth="2.5" strokeLinecap="round">
          <path d="M250 100 L300 100" />
          <polygon points="300,100 292,95 292,105" fill="#34d399" />
        </g>

        {/* Intervention (SIRT1 / NAD+) */}
        <g>
          <circle cx="340" cy="70" r="20" fill="#020811" stroke="#34d399" strokeWidth="2" />
          <text x="340" y="75" textAnchor="middle" fill="#fafafa" fontSize="9" fontWeight="600">SIRT1</text>
        </g>

        {/* Aging arrow (upregulated methylation) */}
        <g stroke="#f472b6" strokeWidth="2" strokeDasharray="3 2">
          <path d="M160 55 L190 55" />
          <text x="175" y="50" textAnchor="middle" fill="#f472b6" fontSize="8">Aging</text>
        </g>

        {showLabels && (
          <>
            <text x="95" y="40" textAnchor="middle" fill={accentColor} fontSize="9">Methyl Marks</text>
            <text x="200" y="145" textAnchor="middle" fill={accentColor} fontSize="9">Chromatin</text>
            <text x="340" y="45" textAnchor="middle" fill="#34d399" fontSize="9">SIRT1 / NAD+</text>
          </>
        )}
      </svg>

      {showLabels && (
        <div className="mt-3 text-micro text-[var(--color-text-muted)] leading-snug">
          Aging drives harmful methylation patterns and histone changes that silence protective genes. SIRT1 activation and NAD+ support help restore healthier epigenetic regulation.
        </div>
      )}
    </div>
  );
};
