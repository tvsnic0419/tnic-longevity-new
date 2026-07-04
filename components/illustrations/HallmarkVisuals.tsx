'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface HallmarkVisualProps {
  className?: string;
  size?: number;
  accentColor?: string;
}

const ACC: Record<string, { s: string; f: string; g: string }> = {
  cyan:    { s: '#22d3ee', f: '#083344', g: '#22d3ee40' },
  emerald: { s: '#34d399', f: '#052e16', g: '#34d39940' },
  violet:  { s: '#a78bfa', f: '#1e1b4b', g: '#a78bfa40' },
  amber:   { s: '#fbbf24', f: '#292524', g: '#fbbf2440' },
  rose:    { s: '#fb7185', f: '#2d0a12', g: '#fb718540' },
};

function ac(color: string | undefined) {
  return ACC[color ?? 'cyan'] ?? ACC.cyan;
}

/* ─── 1. Genomic Instability ─── */
export const GenomicInstabilityVisual: React.FC<HallmarkVisualProps> = ({
  className = '',
  size = 320,
  accentColor = 'cyan',
}) => {
  const c = ac(accentColor);
  return (
    <svg
      width={size}
      height={size * 0.75}
      viewBox="0 0 320 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      aria-label="Genomic Instability: DNA damage and NAD⁺-fueled repair"
      role="img"
    >
      <defs>
        <pattern id="gi-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1f2937" strokeWidth="0.5" />
        </pattern>
        <marker id="gi-arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill={c.s} />
        </marker>
      </defs>
      <rect width="320" height="240" fill="url(#gi-grid)" opacity="0.3" />
      {/* Damaged helix — left */}
      <path d="M40 40 Q60 80 40 120 Q60 160 40 200" stroke="#4b5563" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M70 40 Q50 80 70 120 Q50 160 70 200" stroke="#4b5563" strokeWidth="8" strokeLinecap="round" fill="none" />
      <circle cx="55" cy="70" r="6" fill="#f87171" opacity="0.7" />
      <circle cx="52" cy="140" r="5" fill="#f87171" opacity="0.6" />
      <path d="M48 65 L62 75 M50 135 L60 145" stroke="#f87171" strokeWidth="2" />
      {/* Repaired helix — right */}
      <path d="M180 40 Q200 80 180 120 Q200 160 180 200" stroke={c.s} strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M210 40 Q190 80 210 120 Q190 160 210 200" stroke={c.s} strokeWidth="8" strokeLinecap="round" fill="none" />
      <circle cx="195" cy="80" r="4" fill={c.s} />
      <circle cx="192" cy="130" r="3.5" fill={c.s} />
      <circle cx="198" cy="175" r="3" fill={c.s} />
      {/* PARP node */}
      <circle cx="135" cy="120" r="18" fill="#1f2937" stroke={c.s} strokeWidth="2" />
      <text x="135" y="125" textAnchor="middle" fill="#e5e7eb" fontSize="10" fontFamily="monospace">PARP</text>
      {/* NAD+ arrow */}
      <path d="M165 110 L155 118" stroke={c.s} strokeWidth="2" markerEnd="url(#gi-arrow)" />
      <text x="160" y="225" textAnchor="middle" fill="#9ca3af" fontSize="11" fontFamily="system-ui">DNA Repair + NAD⁺ Fuel</text>
    </svg>
  );
};

/* ─── 2. Telomere Attrition ─── */
export const TelomereAttritionVisual: React.FC<HallmarkVisualProps> = ({
  className = '',
  size = 320,
  accentColor = 'amber',
}) => {
  const c = ac(accentColor);
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn(className)} aria-label="Telomere Attrition — chromosome ends shortening" role="img">
      <rect width="320" height="240" fill="#0a0f1a" rx="8" />
      {/* Chromosome body */}
      <rect x="130" y="20" width="60" height="200" rx="30" fill="#0f172a" stroke={c.s} strokeWidth="2" strokeOpacity="0.6" />
      <rect x="126" y="108" width="68" height="24" rx="12" fill={c.f} stroke={c.s} strokeWidth="1.5" />
      {/* Top telomere — full */}
      <rect x="138" y="20" width="44" height="22" rx="11" fill={c.s} opacity="0.9" />
      {/* Bottom telomere — shortened */}
      <rect x="138" y="198" width="44" height="14" rx="7" fill={c.s} opacity="0.4" />
      <text x="190" y="209" fill={c.s} fontSize="8" opacity="0.7">shortened</text>
      {/* Division arrows */}
      <text x="55" y="118" fill={c.s} fontSize="9" opacity="0.7">cell</text>
      <text x="50" y="130" fill={c.s} fontSize="9" opacity="0.7">division</text>
      <line x1="90" y1="120" x2="126" y2="120" stroke={c.s} strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.6" />
      {/* Spermidine */}
      <circle cx="255" cy="72" r="16" fill={c.f} stroke={c.s} strokeWidth="1.5" />
      <text x="255" y="69" textAnchor="middle" fill={c.s} fontSize="7.5">Spermidine</text>
      <text x="255" y="79" textAnchor="middle" fill={c.s} fontSize="7">shields</text>
      <line x1="240" y1="82" x2="196" y2="42" stroke={c.s} strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.6" />
      <text x="160" y="232" textAnchor="middle" fill="#9ca3af" fontSize="11">Telomere Attrition</text>
    </svg>
  );
};

/* ─── 3. Epigenetic Alterations ─── */
export const EpigeneticAlterationsVisual: React.FC<HallmarkVisualProps> = ({
  className = '',
  size = 320,
  accentColor = 'violet',
}) => {
  const c = ac(accentColor);
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn(className)} aria-label="Epigenetic Alterations — methylation clock and sirtuin reprogramming" role="img">
      <rect width="320" height="240" fill="#0a0f1a" rx="8" />
      {/* Nucleosome */}
      <ellipse cx="160" cy="115" rx="50" ry="32" fill={c.f} stroke={c.s} strokeWidth="2" />
      <ellipse cx="160" cy="115" rx="34" ry="20" fill="#030712" stroke={c.s} strokeWidth="1" strokeOpacity="0.5" />
      {/* DNA wound around */}
      {[0, 60, 120, 180, 240, 300].map((a, i) => {
        const rad = (a * Math.PI) / 180;
        const x = 160 + 58 * Math.cos(rad);
        const y = 115 + 37 * Math.sin(rad);
        return <circle key={i} cx={x} cy={y} r="4" fill={c.s} opacity="0.55" />;
      })}
      {/* Methylation marks */}
      <circle cx="118" cy="90" r="6" fill="#fb7185" opacity="0.9" />
      <circle cx="202" cy="90" r="6" fill="#fb7185" opacity="0.9" />
      <text x="107" y="83" fill="#fb7185" fontSize="7" opacity="0.8">CH₃</text>
      <text x="196" y="83" fill="#fb7185" fontSize="7" opacity="0.8">CH₃</text>
      {/* SIRT1 node */}
      <circle cx="264" cy="115" r="18" fill={c.f} stroke={c.s} strokeWidth="2" />
      <text x="264" y="112" textAnchor="middle" fill={c.s} fontSize="8">SIRT1</text>
      <text x="264" y="122" textAnchor="middle" fill={c.s} fontSize="7">NMN→</text>
      <line x1="246" y1="115" x2="212" y2="115" stroke={c.s} strokeWidth="1.5" strokeOpacity="0.7" />
      {/* Ca-AKG */}
      <text x="52" y="150" fill={c.s} fontSize="9" opacity="0.7">Ca-AKG</text>
      <text x="48" y="161" fill={c.s} fontSize="8" opacity="0.6">dioxygenase</text>
      <line x1="88" y1="148" x2="110" y2="130" stroke={c.s} strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.6" />
      <text x="160" y="232" textAnchor="middle" fill="#9ca3af" fontSize="11">Epigenetic Alterations</text>
    </svg>
  );
};

/* ─── 4. Loss of Proteostasis ─── */
export const ProteostasisVisual: React.FC<HallmarkVisualProps> = ({
  className = '',
  size = 320,
}) => {
  const accent = '#a78bfa';
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn(className)} aria-label="Loss of Proteostasis — misfolded protein clearance" role="img">
      <rect width="320" height="240" fill="#111827" opacity="0.4" rx="8" />
      <ellipse cx="120" cy="110" rx="35" ry="22" fill="none" stroke="#6b7280" strokeWidth="3" />
      <path d="M95 100 Q120 85 145 100" stroke="#6b7280" strokeWidth="2" />
      <circle cx="200" cy="115" r="28" fill="none" stroke={accent} strokeWidth="2.5" />
      <text x="200" y="120" textAnchor="middle" fill={accent} fontSize="9">GSH</text>
      <defs>
        <marker id="arrowp" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill={accent} />
        </marker>
      </defs>
      <path d="M235 100 L275 90" stroke={accent} strokeWidth="2.5" markerEnd="url(#arrowp)" />
      <text x="160" y="225" textAnchor="middle" fill="#9ca3af" fontSize="11">Proteostasis + GlyNAC Shield</text>
    </svg>
  );
};

/* ─── 5. Disabled Autophagy ─── */
export const AutophagyVisual: React.FC<HallmarkVisualProps> = ({
  className = '',
  size = 320,
  accentColor = 'cyan',
}) => {
  const c = ac(accentColor);
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn(className)} aria-label="Disabled Autophagy — lysosomal recycling pathway" role="img">
      <rect width="320" height="240" fill="#030712" rx="8" />
      {/* Autophagosome */}
      <ellipse cx="130" cy="118" rx="50" ry="38" fill="#0a0f1a" stroke={c.s} strokeWidth="2.5" />
      <ellipse cx="130" cy="118" rx="36" ry="26" fill={c.f} stroke={c.s} strokeWidth="1.2" strokeOpacity="0.5" />
      {/* Cargo */}
      <circle cx="122" cy="113" r="8" fill="#fb718530" stroke="#fb7185" strokeWidth="1.2" />
      <circle cx="140" cy="122" r="6" fill="#fbbf2420" stroke="#fbbf24" strokeWidth="1.2" />
      {/* Lysosome */}
      <ellipse cx="235" cy="118" rx="30" ry="20" fill={c.f} stroke={c.s} strokeWidth="2" strokeOpacity="0.7" />
      <text x="235" y="122" textAnchor="middle" fill={c.s} fontSize="8">lysosome</text>
      <path d="M181 118 L207 118" stroke={c.s} strokeWidth="2.5" />
      <path d="M200 113 L207 118 L200 123" stroke={c.s} strokeWidth="2" fill="none" />
      {/* mTOR inhibited */}
      <rect x="38" y="86" width="46" height="18" rx="9" fill="#fb718510" stroke="#fb7185" strokeWidth="1.2" />
      <text x="61" y="98" textAnchor="middle" fill="#fb7185" fontSize="8.5">mTOR ↓</text>
      <line x1="84" y1="95" x2="80" y2="106" stroke={c.s} strokeWidth="1.2" strokeDasharray="4,3" strokeOpacity="0.7" />
      <text x="55" y="158" textAnchor="middle" fill={c.s} fontSize="8.5" opacity="0.7">NMN · fasting</text>
      <text x="55" y="170" textAnchor="middle" fill={c.s} fontSize="8" opacity="0.6">AMPK ↑</text>
      <text x="160" y="232" textAnchor="middle" fill="#9ca3af" fontSize="11">Disabled Autophagy</text>
    </svg>
  );
};

/* ─── 6. Mitochondrial Dysfunction ─── */
export const MitochondrialDysfunctionVisual: React.FC<HallmarkVisualProps> = ({
  className = '',
  size = 320,
  accentColor = 'emerald',
}) => {
  const c = ac(accentColor);
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn(className)} aria-label="Mitochondrial Dysfunction — cristae ETC and NAD⁺/SIRT3 axis" role="img">
      <defs>
        <linearGradient id="mitoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1f2937" />
          <stop offset="100%" stopColor="#111827" />
        </linearGradient>
      </defs>
      <ellipse cx="160" cy="120" rx="95" ry="55" fill="url(#mitoGrad)" stroke="#4b5563" strokeWidth="3" />
      <path d="M80 90 Q100 110 85 140 Q105 160 82 185" stroke="#6b7280" strokeWidth="2.5" fill="none" />
      <path d="M95 95 Q115 120 92 155" stroke="#6b7280" strokeWidth="2" fill="none" />
      <circle cx="75" cy="105" r="4" fill="#f87171" opacity="0.5" />
      <circle cx="88" cy="165" r="3" fill="#f87171" opacity="0.4" />
      <ellipse cx="200" cy="120" rx="55" ry="35" fill="none" stroke={c.s} strokeWidth="2.5" />
      <path d="M175 95 Q195 115 178 145 Q198 165 175 185" stroke={c.s} strokeWidth="2.5" fill="none" />
      <circle cx="130" cy="95" r="7" fill={c.s} opacity="0.9" />
      <text x="130" y="98" textAnchor="middle" fill="#111827" fontSize="7" fontWeight="bold">NAD</text>
      <circle cx="125" cy="145" r="6" fill={c.s} opacity="0.85" />
      <circle cx="225" cy="120" r="14" fill="#1f2937" stroke={c.s} strokeWidth="2" />
      <text x="225" y="124" textAnchor="middle" fill="#e5e7eb" fontSize="8" fontFamily="monospace">SIRT3</text>
      <path d="M240 105 L265 95" stroke={c.s} strokeWidth="2" />
      <path d="M240 135 L265 145" stroke={c.s} strokeWidth="2" />
      <text x="160" y="225" textAnchor="middle" fill="#9ca3af" fontSize="11" fontFamily="system-ui">NAD⁺ → SIRT3 Mitophagy Axis</text>
    </svg>
  );
};

/* ─── 7. Cellular Senescence ─── */
export const CellularSenescenceVisual: React.FC<HallmarkVisualProps> = ({
  className = '',
  size = 320,
  accentColor = 'rose',
}) => {
  const c = ac(accentColor);
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn(className)} aria-label="Cellular Senescence — SASP secretion and Fisetin senolytic clearance" role="img">
      <rect width="320" height="240" fill="#030712" rx="8" />
      {/* Enlarged senescent cell */}
      <ellipse cx="140" cy="118" rx="68" ry="48" fill="#fb718510" stroke={c.s} strokeWidth="2.5" />
      <ellipse cx="136" cy="118" rx="36" ry="24" fill={c.f} stroke={c.s} strokeWidth="1.5" strokeOpacity="0.7" />
      <text x="136" y="122" textAnchor="middle" fill={c.s} fontSize="8">p21/p53</text>
      {/* SASP dots */}
      {[[210, 85],[222, 102],[230, 122],[218, 142],[204, 158]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="5.5" fill={c.f} stroke={c.s} strokeWidth="1.5" opacity={0.55 + i * 0.09} />
      ))}
      <text x="248" y="118" fill={c.s} fontSize="8" opacity="0.7" textAnchor="middle">SASP</text>
      {/* Fisetin */}
      <rect x="30" y="92" width="50" height="22" rx="11" fill={c.f} stroke={c.s} strokeWidth="1.5" />
      <text x="55" y="100" textAnchor="middle" fill={c.s} fontSize="8.5" fontWeight="600">Fisetin</text>
      <text x="55" y="110" textAnchor="middle" fill={c.s} fontSize="7.5">senolytic</text>
      <path d="M80 103 L72 110" stroke={c.s} strokeWidth="1.5" strokeOpacity="0.7" />
      <text x="160" y="232" textAnchor="middle" fill="#9ca3af" fontSize="11">Cellular Senescence</text>
    </svg>
  );
};

/* ─── 8. Stem Cell Exhaustion ─── */
export const StemCellExhaustionVisual: React.FC<HallmarkVisualProps> = ({
  className = '',
  size = 320,
  accentColor = 'violet',
}) => {
  const c = ac(accentColor);
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn(className)} aria-label="Stem Cell Exhaustion — niche depletion and NMN restoration" role="img">
      <rect width="320" height="240" fill="#030712" rx="8" />
      {/* Niche */}
      <ellipse cx="160" cy="115" rx="76" ry="54" fill={c.f} stroke={c.s} strokeWidth="1.5" strokeOpacity="0.4" />
      {/* Active stem cells — left */}
      {[[118, 100],[100, 120],[122, 138]].map(([x,y],i) => (
        <circle key={`a${i}`} cx={x} cy={y} r="11" fill={c.f} stroke={c.s} strokeWidth="2" />
      ))}
      {/* Depleted — right, faded */}
      {[[190, 100],[210, 118],[190, 138]].map(([x,y],i) => (
        <circle key={`d${i}`} cx={x} cy={y} r="11" fill="#0a0f1a" stroke={c.s} strokeWidth="1" strokeOpacity="0.3" strokeDasharray="4,3" />
      ))}
      <text x="160" y="88" textAnchor="middle" fill={c.s} fontSize="7.5" opacity="0.65">depleted niche →</text>
      {/* NMN */}
      <circle cx="275" cy="70" r="16" fill={c.f} stroke={c.s} strokeWidth="2" />
      <text x="275" y="68" textAnchor="middle" fill={c.s} fontSize="7.5">NMN</text>
      <text x="275" y="78" textAnchor="middle" fill={c.s} fontSize="7">SIRT1</text>
      <line x1="260" y1="80" x2="214" y2="98" stroke={c.s} strokeWidth="1.2" strokeDasharray="4,3" strokeOpacity="0.7" />
      <text x="160" y="232" textAnchor="middle" fill="#9ca3af" fontSize="11">Stem Cell Exhaustion</text>
    </svg>
  );
};

/* ─── 9. Altered Intercellular Communication ─── */
export const IntercellularCommunicationVisual: React.FC<HallmarkVisualProps> = ({
  className = '',
  size = 320,
  accentColor = 'amber',
}) => {
  const c = ac(accentColor);
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn(className)} aria-label="Altered Intercellular Communication — paracrine signaling" role="img">
      <rect width="320" height="240" fill="#030712" rx="8" />
      {/* Sender cell */}
      <ellipse cx="72" cy="120" rx="44" ry="34" fill={c.f} stroke={c.s} strokeWidth="2" />
      <text x="72" y="124" textAnchor="middle" fill={c.s} fontSize="8.5">sender</text>
      {/* Receiver */}
      <ellipse cx="248" cy="120" rx="44" ry="34" fill={c.f} stroke={c.s} strokeWidth="2" strokeOpacity="0.5" />
      <text x="248" y="124" textAnchor="middle" fill={c.s} fontSize="8.5">receiver</text>
      {/* Signal vesicles */}
      {[130, 160, 190].map((x, i) => (
        <circle key={i} cx={x} cy={i === 1 ? 112 : 128} r="7.5" fill={c.f} stroke={c.s} strokeWidth="1.5" />
      ))}
      {/* Inflammatory label */}
      <text x="160" y="92" textAnchor="middle" fill="#fb7185" fontSize="7.5" opacity="0.7">pro-inflammatory cytokines</text>
      {/* Omega-3 */}
      <rect x="110" y="162" width="100" height="20" rx="10" fill={c.f} stroke={c.s} strokeWidth="1.5" />
      <text x="160" y="175" textAnchor="middle" fill={c.s} fontSize="8.5">Omega-3 modulates</text>
      <text x="160" y="232" textAnchor="middle" fill="#9ca3af" fontSize="11">Intercellular Communication</text>
    </svg>
  );
};

/* ─── 10. Chronic Inflammation ─── */
export const ChronicInflammationVisual: React.FC<HallmarkVisualProps> = ({
  className = '',
  size = 320,
  accentColor = 'rose',
}) => {
  const c = ac(accentColor);
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn(className)} aria-label="Chronic Inflammation — NF-κB pathway and resolution" role="img">
      <defs>
        <radialGradient id="inf-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.g} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="320" height="240" fill="#030712" rx="8" />
      <ellipse cx="160" cy="115" rx="85" ry="60" fill="url(#inf-glow)" opacity="0.4" />
      <ellipse cx="160" cy="115" rx="34" ry="24" fill={c.f} stroke={c.s} strokeWidth="2.5" />
      <text x="160" y="119" textAnchor="middle" fill={c.s} fontSize="8.5" fontWeight="700">NF-κB</text>
      {/* Cytokine burst */}
      {[30, 60, 90, 120, 150, 210, 270, 330].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = 160 + 38 * Math.cos(rad);
        const y1 = 115 + 28 * Math.sin(rad);
        const x2 = 160 + 62 * Math.cos(rad);
        const y2 = 115 + 46 * Math.sin(rad);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={c.s} strokeWidth="1.5" strokeOpacity="0.5" />;
      })}
      {/* Resolution */}
      <rect x="28" y="80" width="54" height="18" rx="9" fill={c.f} stroke={c.s} strokeWidth="1.2" />
      <text x="55" y="92" textAnchor="middle" fill={c.s} fontSize="8.5">Omega-3</text>
      <line x1="82" y1="89" x2="124" y2="107" stroke={c.s} strokeWidth="1.2" strokeDasharray="4,3" strokeOpacity="0.7" />
      <rect x="238" y="80" width="54" height="18" rx="9" fill={c.f} stroke={c.s} strokeWidth="1.2" />
      <text x="265" y="92" textAnchor="middle" fill={c.s} fontSize="8.5">Quercetin</text>
      <line x1="238" y1="89" x2="196" y2="107" stroke={c.s} strokeWidth="1.2" strokeDasharray="4,3" strokeOpacity="0.7" />
      <text x="160" y="232" textAnchor="middle" fill="#9ca3af" fontSize="11">Chronic Inflammation</text>
    </svg>
  );
};

/* ─── 11. Dysbiosis ─── */
export const DysbiosisVisual: React.FC<HallmarkVisualProps> = ({
  className = '',
  size = 320,
  accentColor = 'emerald',
}) => {
  const c = ac(accentColor);
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn(className)} aria-label="Dysbiosis — gut microbiome imbalance and restoration" role="img">
      <rect width="320" height="240" fill="#030712" rx="8" />
      {/* Gut lumen */}
      <path d="M50 75 Q60 52 160 55 Q260 58 270 75 L270 155 Q260 178 160 175 Q60 172 50 155Z" fill="#0a0f1a" stroke={c.s} strokeWidth="1.5" strokeOpacity="0.5" />
      {/* Beneficial microbes — left */}
      {[[90, 98],[76, 118],[92, 138]].map(([x,y],i) => (
        <ellipse key={`b${i}`} cx={x} cy={y} rx="11" ry="7" fill={c.f} stroke={c.s} strokeWidth="1.5" transform={`rotate(${i*40} ${x} ${y})`} />
      ))}
      {/* Pathogenic — right */}
      {[[210, 98],[228, 115],[210, 138]].map(([x,y],i) => (
        <circle key={`p${i}`} cx={x} cy={y} r="8" fill="#fb718520" stroke="#fb7185" strokeWidth="1.5" />
      ))}
      <text x="160" y="162" textAnchor="middle" fill={c.s} fontSize="7.5" opacity="0.7">SCFAs ↓ · LPS ↑</text>
      {/* Intervention bar */}
      <rect x="86" y="192" width="148" height="20" rx="10" fill={c.f} stroke={c.s} strokeWidth="1.2" />
      <text x="160" y="205" textAnchor="middle" fill={c.s} fontSize="8">Spermidine · fibre · probiotics</text>
      <text x="160" y="232" textAnchor="middle" fill="#9ca3af" fontSize="11">Dysbiosis</text>
    </svg>
  );
};

/* ─── 12. Nutrient Sensing ─── */
export const NutrientSensingVisual: React.FC<HallmarkVisualProps> = ({
  className = '',
  size = 320,
  accentColor = 'amber',
}) => {
  const c = ac(accentColor);
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn(className)} aria-label="Deregulated Nutrient Sensing — mTOR/AMPK/IGF-1 axis" role="img">
      <rect width="320" height="240" fill="#030712" rx="8" />
      {/* mTOR */}
      <ellipse cx="160" cy="108" rx="32" ry="22" fill={c.f} stroke={c.s} strokeWidth="2.5" />
      <text x="160" y="112" textAnchor="middle" fill={c.s} fontSize="10" fontWeight="700">mTOR</text>
      {/* AMPK */}
      <ellipse cx="72" cy="108" rx="26" ry="18" fill={c.f} stroke={c.s} strokeWidth="1.8" strokeOpacity="0.7" />
      <text x="72" y="112" textAnchor="middle" fill={c.s} fontSize="9">AMPK</text>
      <line x1="98" y1="108" x2="128" y2="108" stroke={c.s} strokeWidth="1.8" />
      <line x1="110" y1="102" x2="110" y2="114" stroke={c.s} strokeWidth="1.8" />
      {/* IGF-1 */}
      <ellipse cx="250" cy="78" rx="26" ry="18" fill={c.f} stroke={c.s} strokeWidth="1.8" strokeOpacity="0.7" />
      <text x="250" y="82" textAnchor="middle" fill={c.s} fontSize="9">IGF-1</text>
      <line x1="224" y1="84" x2="191" y2="98" stroke={c.s} strokeWidth="1.2" strokeDasharray="4,3" strokeOpacity="0.6" />
      {/* Sirtuins */}
      <ellipse cx="250" cy="138" rx="26" ry="18" fill={c.f} stroke={c.s} strokeWidth="1.8" strokeOpacity="0.7" />
      <text x="250" y="142" textAnchor="middle" fill={c.s} fontSize="9">Sirtuins</text>
      <line x1="224" y1="132" x2="191" y2="118" stroke={c.s} strokeWidth="1.2" strokeDasharray="4,3" strokeOpacity="0.6" />
      {/* Intervention bar */}
      <rect x="46" y="175" width="228" height="20" rx="10" fill={c.f} stroke={c.s} strokeWidth="1.2" />
      <text x="160" y="188" textAnchor="middle" fill={c.s} fontSize="8">Berberine · Metformin · caloric restriction</text>
      <text x="160" y="232" textAnchor="middle" fill="#9ca3af" fontSize="11">Deregulated Nutrient Sensing</text>
    </svg>
  );
};

/* ─── Convenience map — keyed by hallmark.id ─── */
export const HALLMARK_VISUALS: Record<string, React.ComponentType<HallmarkVisualProps>> = {
  genomic:       GenomicInstabilityVisual,
  telomeres:     TelomereAttritionVisual,
  epigenetic:    EpigeneticAlterationsVisual,
  proteostasis:  ProteostasisVisual,
  autophagy:     AutophagyVisual,
  mito:          MitochondrialDysfunctionVisual,
  senescence:    CellularSenescenceVisual,
  stem:          StemCellExhaustionVisual,
  communication: IntercellularCommunicationVisual,
  inflammation:  ChronicInflammationVisual,
  dysbiosis:     DysbiosisVisual,
  nutrient:      NutrientSensingVisual,
};

/* Legacy slug-keyed map for backwards compatibility */
export const hallmarkVisualMap: Record<string, React.ComponentType<HallmarkVisualProps>> = {
  'genomic-instability':          GenomicInstabilityVisual,
  'telomere-attrition':           TelomereAttritionVisual,
  'epigenetic-alterations':       EpigeneticAlterationsVisual,
  'loss-of-proteostasis':         ProteostasisVisual,
  'disabled-autophagy':           AutophagyVisual,
  'mitochondrial-dysfunction':    MitochondrialDysfunctionVisual,
  'cellular-senescence':          CellularSenescenceVisual,
  'stem-cell-exhaustion':         StemCellExhaustionVisual,
  'intercellular-communication':  IntercellularCommunicationVisual,
  'chronic-inflammation':         ChronicInflammationVisual,
  'dysbiosis':                    DysbiosisVisual,
  'nutrient-sensing':             NutrientSensingVisual,
};
