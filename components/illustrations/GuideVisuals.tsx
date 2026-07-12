'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface GuideVisualProps {
  className?: string;
  size?: number;
}

const ACC: Record<string, { s: string; f: string; g: string }> = {
  cyan:    { s: '#22d3ee', f: '#083344', g: '#22d3ee40' },
  emerald: { s: '#34d399', f: '#052e16', g: '#34d39940' },
  violet:  { s: '#a78bfa', f: '#1e1b4b', g: '#a78bfa40' },
  amber:   { s: '#fbbf24', f: '#292524', g: '#fbbf2440' },
  rose:    { s: '#fb7185', f: '#2d0a12', g: '#fb718540' },
};

/* ─── NAD+ precursor pathways (NAD+ guide — NMN vs NR vs Niacin) ─── */
export const NadPathwaysVisual: React.FC<GuideVisualProps> = ({ className = '', size = 320 }) => {
  const c = ACC.cyan;
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn(className)} aria-label="Three NAD+ precursors — NMN, NR, and niacin — converging on the NAD+ pool" role="img">
      <rect width="320" height="240" fill="#030712" rx="8" />
      <circle cx="48" cy="50" r="23" fill={c.f} stroke={c.s} strokeWidth="2" />
      <text x="48" y="53" textAnchor="middle" fill={c.s} fontSize="8.5" fontWeight="700">NMN</text>
      <circle cx="48" cy="120" r="23" fill={c.f} stroke={c.s} strokeWidth="2" strokeOpacity="0.85" />
      <text x="48" y="123" textAnchor="middle" fill={c.s} fontSize="8.5" fontWeight="700">NR</text>
      <circle cx="48" cy="190" r="23" fill={c.f} stroke={c.s} strokeWidth="2" strokeOpacity="0.7" />
      <text x="48" y="188" textAnchor="middle" fill={c.s} fontSize="7" fontWeight="700">Niacin</text>
      <text x="48" y="197" textAnchor="middle" fill={c.s} fontSize="6" opacity="0.7">(NAM)</text>
      <path d="M69 58 L158 92" stroke={c.s} strokeWidth="1.6" strokeOpacity="0.8" />
      <text x="108" y="80" textAnchor="middle" fill="#9ca3af" fontSize="6.5" opacity="0.8">direct · NMNAT</text>
      <path d="M71 120 L152 120" stroke={c.s} strokeWidth="1.6" strokeOpacity="0.8" />
      <text x="108" y="113" textAnchor="middle" fill="#9ca3af" fontSize="6.5" opacity="0.8">via NRK1</text>
      <path d="M69 182 L158 148" stroke={c.s} strokeWidth="1.6" strokeOpacity="0.8" />
      <text x="108" y="167" textAnchor="middle" fill="#9ca3af" fontSize="6.5" opacity="0.8">via NAMPT*</text>
      <ellipse cx="205" cy="120" rx="48" ry="38" fill="#1f2937" stroke={c.s} strokeWidth="2.5" />
      <text x="205" y="116" textAnchor="middle" fill="#e5e7eb" fontSize="11" fontWeight="700">NAD⁺</text>
      <text x="205" y="128" textAnchor="middle" fill="#9ca3af" fontSize="7">pool</text>
      <path d="M188 154 L168 178" stroke={c.s} strokeWidth="1.2" strokeDasharray="4,3" strokeOpacity="0.6" />
      <path d="M222 154 L242 178" stroke={c.s} strokeWidth="1.2" strokeDasharray="4,3" strokeOpacity="0.6" />
      <rect x="140" y="179" width="130" height="20" rx="10" fill={c.f} stroke={c.s} strokeWidth="1.2" />
      <text x="205" y="192" textAnchor="middle" fill={c.s} fontSize="8">SIRT1 · PARP · CD38</text>
      <text x="160" y="232" textAnchor="middle" fill="#9ca3af" fontSize="11">Three Precursors → One NAD⁺ Pool</text>
    </svg>
  );
};

/* ─── Longevity supplement axes overview (hub page) ─── */
export const LongevityAxesVisual: React.FC<GuideVisualProps> = ({ className = '', size = 320 }) => {
  const axes: { y: number; color: string; label: string }[] = [
    { y: 28,  color: ACC.cyan.s,    label: 'NAD⁺ restoration' },
    { y: 73,  color: ACC.violet.s,  label: 'AMPK activation' },
    { y: 118, color: ACC.emerald.s, label: 'NRF2 / antioxidant' },
    { y: 163, color: ACC.amber.s,   label: 'Autophagy induction' },
    { y: 208, color: ACC.rose.s,    label: 'mTOR modulation' },
  ];
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn(className)} aria-label="Five convergent longevity supplement axes feeding into extended healthspan" role="img">
      <rect width="320" height="240" fill="#030712" rx="8" />
      <circle cx="42" cy="118" r="30" fill="#1f2937" stroke="#6b7280" strokeWidth="2" />
      <text x="42" y="115" textAnchor="middle" fill="#e5e7eb" fontSize="7.5" fontWeight="700">Aging</text>
      <text x="42" y="125" textAnchor="middle" fill="#9ca3af" fontSize="6">hallmarks</text>
      {axes.map((a) => (
        <g key={a.label}>
          <path d={`M72 118 L138 ${a.y}`} stroke={a.color} strokeWidth="1.3" strokeOpacity="0.55" />
          <ellipse cx="176" cy={a.y} rx="42" ry="15" fill={`${a.color}14`} stroke={a.color} strokeWidth="1.6" />
          <text x="176" y={a.y + 3} textAnchor="middle" fill={a.color} fontSize="7.2" fontWeight="600">{a.label}</text>
          <path d={`M218 ${a.y} L256 118`} stroke={a.color} strokeWidth="1.3" strokeOpacity="0.55" />
        </g>
      ))}
      <circle cx="280" cy="118" r="34" fill="#1f2937" stroke="#e5e7eb" strokeWidth="2.2" />
      <text x="280" y="114" textAnchor="middle" fill="#e5e7eb" fontSize="7.5" fontWeight="700">Extended</text>
      <text x="280" y="125" textAnchor="middle" fill="#9ca3af" fontSize="7">Healthspan</text>
      <text x="160" y="232" textAnchor="middle" fill="#9ca3af" fontSize="11">5 Convergent Longevity Axes</text>
    </svg>
  );
};
