'use client';

import React from 'react';

interface DysbiosisVisualProps {
  className?: string;
  accentColor?: string;
  showLabels?: boolean;
  interactive?: boolean;
}

/**
 * High-detail SVG for Dysbiosis hallmark.
 * Shows gut microbiome imbalance, leaky gut, and intervention points.
 */
export const DysbiosisVisual: React.FC<DysbiosisVisualProps> = ({
  className = '',
  accentColor = '#fbbf24',
  showLabels = true,
}) => {
  return (
    <div className={`relative tnic-glass rounded-2xl p-5 overflow-hidden ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-label text-[var(--accent-amber)] mb-0.5">HALLMARK 11</div>
          <h4 className="heading-card text-lg">Dysbiosis</h4>
        </div>
        {showLabels && <div className="text-right text-micro text-[var(--color-text-muted)]">Microbiome · Leaky Gut · Immunity</div>}
      </div>

      <svg viewBox="0 0 420 200" className="w-full h-auto" aria-label="Dysbiosis: gut microbiome imbalance and leaky gut" role="img">
        <defs>
          <linearGradient id="gutGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.2" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Gut lining */}
        <g>
          <path d="M60 60 Q120 90 180 60 Q240 90 300 60 Q360 90 380 70" stroke="#475569" strokeWidth="8" fill="none" strokeLinecap="round" />
          {/* Tight junctions (damaged) */}
          <path d="M150 75 L170 95" stroke="#f472b6" strokeWidth="3" />
          <path d="M200 70 L220 90" stroke="#f472b6" strokeWidth="3" />
        </g>

        {/* Good bacteria (small circles) */}
        <g fill="#34d399" opacity="0.7">
          <circle cx="90" cy="130" r="7" />
          <circle cx="120" cy="145" r="6" />
          <circle cx="280" cy="135" r="7" />
          <circle cx="310" cy="150" r="5.5" />
        </g>

        {/* Bad bacteria / overgrowth (larger, different color) */}
        <g fill="#f472b6" opacity="0.7">
          <circle cx="160" cy="125" r="11" />
          <circle cx="240" cy="140" r="9" />
        </g>

        {/* Leaky gut arrows (toxins entering bloodstream) */}
        <g stroke="#f472b6" strokeWidth="2" strokeDasharray="2 2">
          <path d="M165 95 L165 55" />
          <path d="M210 95 L210 55" />
        </g>

        {/* Intervention (Fiber / Polyphenols / Probiotics) */}
        <g stroke="#34d399" strokeWidth="2.5" strokeLinecap="round">
          <path d="M380 120 L340 140" />
          <polygon points="340,140 348,135 345,143" fill="#34d399" />
        </g>

        {showLabels && (
          <>
            <text x="120" y="55" textAnchor="middle" fill="#f472b6" fontSize="9">Leaky Gut</text>
            <text x="200" y="170" textAnchor="middle" fill="#34d399" fontSize="9">Beneficial Bacteria</text>
            <text x="200" y="115" textAnchor="middle" fill="#f472b6" fontSize="9">Overgrowth</text>
            <text x="370" y="115" textAnchor="end" fill="#34d399" fontSize="9">Fiber / Polyphenols</text>
          </>
        )}
      </svg>

      {showLabels && (
        <div className="mt-3 text-micro text-[var(--color-text-muted)] leading-snug">
          Loss of microbial diversity and leaky gut drive systemic inflammation. Fiber, polyphenols, and targeted probiotics help restore balance.
        </div>
      )}
    </div>
  );
};
