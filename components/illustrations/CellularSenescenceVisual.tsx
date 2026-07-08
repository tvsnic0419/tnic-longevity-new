'use client';

import React from 'react';

interface CellularSenescenceVisualProps {
  className?: string;
  accentColor?: string;
  showLabels?: boolean;
  interactive?: boolean;
}

/**
 * High-detail SVG visualization for Cellular Senescence hallmark.
 * Shows senescent cell with SASP secretion, p16INK4a accumulation,
 * and senolytic clearance pathways (e.g., Dasatinib + Quercetin / Fisetin).
 * Consistent with TNiC design system: dark fills, luminous accents,
 * reduced-motion safe, WCAG AA labels.
 */
export const CellularSenescenceVisual: React.FC<CellularSenescenceVisualProps> = ({
  className = '',
  accentColor = '#f472b6', // rose accent for senescence/inflammation
  showLabels = true,
  interactive = true,
}) => {
  return (
    <div className={`relative tnic-glass rounded-2xl p-5 overflow-hidden ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-label text-[var(--accent-rose)] mb-0.5">HALLMARK 09</div>
          <h4 className="heading-card text-lg">Cellular Senescence</h4>
        </div>
        {showLabels && (
          <div className="text-right text-[10px] text-[var(--color-text-muted)] leading-tight">
            p16⁺⁺ / SASP⁺<br />Senolytic clearance
          </div>
        )}
      </div>

      <svg
        viewBox="0 0 420 220"
        className="w-full h-auto"
        aria-label="Cellular Senescence mechanism: senescent cell with SASP factors, p16 accumulation, and senolytic intervention points"
        role="img"
      >
        <defs>
          <linearGradient id="senescentGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.25" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0.05" />
          </linearGradient>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" />
          </filter>
        </defs>

        {/* Background cell membrane - irregular senescent shape */}
        <path
          d="M80 40 Q120 25 180 35 Q240 20 290 45 Q340 35 370 70 Q390 120 360 160 Q310 195 240 185 Q170 200 110 170 Q60 140 70 90 Z"
          fill="#0a0f1a"
          stroke={accentColor}
          strokeWidth="2.5"
          opacity="0.9"
        />

        {/* Nucleus with p16 accumulation (dark, enlarged) */}
        <ellipse cx="210" cy="105" rx="48" ry="38" fill="#020811" stroke="#f472b6" strokeWidth="2" />
        <ellipse cx="210" cy="105" rx="32" ry="26" fill="#111827" opacity="0.8" />

        {/* p16INK4a dense spots inside nucleus */}
        <circle cx="195" cy="95" r="4.5" fill={accentColor} opacity="0.7" />
        <circle cx="225" cy="112" r="5" fill={accentColor} opacity="0.65" />
        <circle cx="205" cy="118" r="3.5" fill={accentColor} opacity="0.75" />

        {/* SASP secretion vesicles / inflammatory factors leaving cell */}
        <g opacity="0.85">
          <circle cx="320" cy="70" r="7" fill="#f472b6" />
          <circle cx="345" cy="95" r="5.5" fill="#f472b6" />
          <circle cx="360" cy="125" r="6" fill="#f472b6" />
          <circle cx="335" cy="155" r="4.5" fill="#f472b6" />
          {/* Subtle animation for secretion */}
          {interactive && (
            <>
              <circle cx="320" cy="70" r="3" fill="#fff" opacity="0.4">
                <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2.8s" repeatCount="indefinite" />
              </circle>
            </>
          )}
        </g>

        {/* Senolytic intervention arrows / clearance pathway (right side) */}
        <g stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" opacity="0.85">
          <path d="M385 85 L355 105" />
          <path d="M385 115 L355 130" />
          <path d="M385 145 L355 155" />
          {/* Arrowheads */}
          <polygon points="355,105 348,100 352,108" fill="#10b981" />
          <polygon points="355,130 348,125 352,133" fill="#10b981" />
        </g>

        {/* Labels (conditional) */}
        {showLabels && (
          <>
            <text x="210" y="102" textAnchor="middle" fill="#fafafa" fontSize="9.5" fontWeight="600">p16⁺⁺ Nucleus</text>
            <text x="340" y="55" textAnchor="middle" fill="#f472b6" fontSize="8.5">SASP factors</text>
            <text x="372" y="170" textAnchor="end" fill="#10b981" fontSize="8.5">Senolytic clearance</text>
          </>
        )}

        {/* Subtle internal damage / lipofuscin dots */}
        <circle cx="175" cy="125" r="2.8" fill="#fbbf24" opacity="0.6" />
        <circle cx="240" cy="85" r="2.2" fill="#fbbf24" opacity="0.5" />
      </svg>

      {showLabels && (
        <div className="mt-3 text-[10px] text-[var(--color-text-muted)] leading-snug">
          Senescent cells accumulate with age and secrete pro-inflammatory SASP. Senolytics (e.g., D+Q, Fisetin) selectively clear them, reducing chronic inflammation and improving tissue function.
        </div>
      )}
    </div>
  );
};
