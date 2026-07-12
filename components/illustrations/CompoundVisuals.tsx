'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface CompoundVisualProps {
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

/* ─── NMN ─── */
export const NmnVisual: React.FC<CompoundVisualProps> = ({ className = '', size = 320 }) => {
  const c = ACC.cyan;
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn(className)} aria-label="NMN — NAD+ salvage pathway via NAMPT/NMNAT" role="img">
      <rect width="320" height="240" fill="#030712" rx="8" />
      <circle cx="60" cy="120" r="26" fill={c.f} stroke={c.s} strokeWidth="2" />
      <text x="60" y="117" textAnchor="middle" fill={c.s} fontSize="9" fontWeight="700">NMN</text>
      <text x="60" y="128" textAnchor="middle" fill={c.s} fontSize="7" opacity="0.7">precursor</text>
      <path d="M86 120 L118 120" stroke={c.s} strokeWidth="2.5" />
      <path d="M110 114 L118 120 L110 126" stroke={c.s} strokeWidth="2" fill="none" />
      <ellipse cx="160" cy="120" rx="34" ry="22" fill={c.f} stroke={c.s} strokeWidth="2" strokeOpacity="0.8" />
      <text x="160" y="117" textAnchor="middle" fill={c.s} fontSize="8.5">NMNAT</text>
      <text x="160" y="128" textAnchor="middle" fill={c.s} fontSize="7" opacity="0.7">enzyme</text>
      <path d="M194 120 L226 120" stroke={c.s} strokeWidth="2.5" />
      <path d="M218 114 L226 120 L218 126" stroke={c.s} strokeWidth="2" fill="none" />
      <ellipse cx="266" cy="120" rx="38" ry="26" fill="#1f2937" stroke={c.s} strokeWidth="2.5" />
      <text x="266" y="116" textAnchor="middle" fill="#e5e7eb" fontSize="10" fontWeight="700">NAD⁺</text>
      <text x="266" y="128" textAnchor="middle" fill="#9ca3af" fontSize="7">pool</text>
      <path d="M250 148 L215 175" stroke={c.s} strokeWidth="1.2" strokeDasharray="4,3" strokeOpacity="0.6" />
      <path d="M280 148 L295 175" stroke={c.s} strokeWidth="1.2" strokeDasharray="4,3" strokeOpacity="0.6" />
      <rect x="150" y="176" width="130" height="20" rx="10" fill={c.f} stroke={c.s} strokeWidth="1.2" />
      <text x="215" y="189" textAnchor="middle" fill={c.s} fontSize="8">SIRT1 · PARP · CD38</text>
      <text x="160" y="232" textAnchor="middle" fill="#9ca3af" fontSize="11">NMN → NAD⁺ Salvage Pathway</text>
    </svg>
  );
};

/* ─── NR ─── */
export const NrVisual: React.FC<CompoundVisualProps> = ({ className = '', size = 320 }) => {
  const c = ACC.cyan;
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn(className)} aria-label="Nicotinamide Riboside — NRK1 entry point into NAD+ salvage" role="img">
      <rect width="320" height="240" fill="#030712" rx="8" />
      <circle cx="55" cy="110" r="24" fill={c.f} stroke={c.s} strokeWidth="2" />
      <text x="55" y="107" textAnchor="middle" fill={c.s} fontSize="9" fontWeight="700">NR</text>
      <text x="55" y="118" textAnchor="middle" fill={c.s} fontSize="6.5" opacity="0.7">riboside</text>
      <path d="M79 110 L110 110" stroke={c.s} strokeWidth="2.5" />
      <path d="M102 104 L110 110 L102 116" stroke={c.s} strokeWidth="2" fill="none" />
      <ellipse cx="150" cy="110" rx="32" ry="20" fill={c.f} stroke={c.s} strokeWidth="2" strokeOpacity="0.85" />
      <text x="150" y="107" textAnchor="middle" fill={c.s} fontSize="8">NRK1</text>
      <text x="150" y="118" textAnchor="middle" fill={c.s} fontSize="6.5" opacity="0.7">kinase</text>
      <path d="M182 110 L208 110" stroke={c.s} strokeWidth="2.5" />
      <path d="M200 104 L208 110 L200 116" stroke={c.s} strokeWidth="2" fill="none" />
      <ellipse cx="246" cy="110" rx="30" ry="19" fill="#1f2937" stroke="#6b7280" strokeWidth="1.5" strokeOpacity="0.7" />
      <text x="246" y="113" textAnchor="middle" fill="#9ca3af" fontSize="8">NMN</text>
      {/* Contrast note vs. NMN's direct NAMPT route */}
      <text x="150" y="150" textAnchor="middle" fill="#9ca3af" fontSize="7.5" opacity="0.7">bypasses NAMPT — alternate NAD⁺ entry point</text>
      <path d="M246 129 L246 155" stroke={c.s} strokeWidth="2" strokeOpacity="0.7" />
      <path d="M240 148 L246 155 L252 148" stroke={c.s} strokeWidth="1.6" fill="none" />
      <ellipse cx="246" cy="185" rx="42" ry="24" fill="#1f2937" stroke={c.s} strokeWidth="2.5" />
      <text x="246" y="181" textAnchor="middle" fill="#e5e7eb" fontSize="10" fontWeight="700">NAD⁺</text>
      <text x="246" y="193" textAnchor="middle" fill="#9ca3af" fontSize="7">pool</text>
      <text x="160" y="232" textAnchor="middle" fill="#9ca3af" fontSize="11">NR → NAD⁺ via NRK1</text>
    </svg>
  );
};

/* ─── GlyNAC ─── */
export const GlynacVisual: React.FC<CompoundVisualProps> = ({ className = '', size = 320 }) => {
  const c = ACC.emerald;
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn(className)} aria-label="GlyNAC — glycine and N-acetylcysteine resupply glutathione synthesis" role="img">
      <rect width="320" height="240" fill="#030712" rx="8" />
      <ellipse cx="55" cy="90" rx="34" ry="18" fill={c.f} stroke={c.s} strokeWidth="2" />
      <text x="55" y="94" textAnchor="middle" fill={c.s} fontSize="9">Glycine</text>
      <ellipse cx="55" cy="150" rx="34" ry="18" fill={c.f} stroke={c.s} strokeWidth="2" />
      <text x="55" y="147" textAnchor="middle" fill={c.s} fontSize="8">N-Acetyl-</text>
      <text x="55" y="157" textAnchor="middle" fill={c.s} fontSize="8">cysteine</text>
      <path d="M89 100 L128 112" stroke={c.s} strokeWidth="2" strokeOpacity="0.8" />
      <path d="M89 140 L128 128" stroke={c.s} strokeWidth="2" strokeOpacity="0.8" />
      <ellipse cx="160" cy="120" rx="30" ry="30" fill={c.f} stroke={c.s} strokeWidth="2" strokeOpacity="0.9" />
      <text x="160" y="117" textAnchor="middle" fill={c.s} fontSize="8">GSH</text>
      <text x="160" y="128" textAnchor="middle" fill={c.s} fontSize="7" opacity="0.7">synthetase</text>
      <path d="M192 116 L225 108" stroke={c.s} strokeWidth="2.5" />
      <path d="M217 103 L225 108 L219 115" stroke={c.s} strokeWidth="2" fill="none" />
      <path d="M192 128 L225 138" stroke={c.s} strokeWidth="2.5" />
      <path d="M217 141 L225 138 L221 132" stroke={c.s} strokeWidth="2" fill="none" />
      <ellipse cx="264" cy="100" rx="34" ry="20" fill="#1f2937" stroke={c.s} strokeWidth="2.5" />
      <text x="264" y="97" textAnchor="middle" fill="#e5e7eb" fontSize="9" fontWeight="700">GSH↑</text>
      <text x="264" y="107" textAnchor="middle" fill="#9ca3af" fontSize="6.5">glutathione</text>
      <ellipse cx="264" cy="150" rx="34" ry="20" fill="#1f2937" stroke={c.s} strokeWidth="1.5" strokeOpacity="0.7" />
      <text x="264" y="147" textAnchor="middle" fill="#9ca3af" fontSize="8">Mito</text>
      <text x="264" y="157" textAnchor="middle" fill="#9ca3af" fontSize="6.5">function ↑</text>
      <text x="160" y="200" textAnchor="middle" fill="#9ca3af" fontSize="7.5" opacity="0.7">restores age-related glutathione deficiency</text>
      <text x="160" y="232" textAnchor="middle" fill="#9ca3af" fontSize="11">GlyNAC → Glutathione Resynthesis</text>
    </svg>
  );
};

/* ─── Taurine ─── */
export const TaurineVisual: React.FC<CompoundVisualProps> = ({ className = '', size = 320 }) => {
  const c = ACC.amber;
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn(className)} aria-label="Taurine — mitochondrial tRNA modification and cellular support" role="img">
      <rect width="320" height="240" fill="#030712" rx="8" />
      <circle cx="55" cy="120" r="26" fill={c.f} stroke={c.s} strokeWidth="2" />
      <text x="55" y="123" textAnchor="middle" fill={c.s} fontSize="9" fontWeight="700">Taurine</text>
      <path d="M81 105 L118 82" stroke={c.s} strokeWidth="1.8" strokeOpacity="0.75" />
      <path d="M81 120 L120 120" stroke={c.s} strokeWidth="1.8" strokeOpacity="0.75" />
      <path d="M81 135 L118 158" stroke={c.s} strokeWidth="1.8" strokeOpacity="0.75" />
      <ellipse cx="160" cy="75" rx="40" ry="18" fill={c.f} stroke={c.s} strokeWidth="1.6" strokeOpacity="0.85" />
      <text x="160" y="72" textAnchor="middle" fill={c.s} fontSize="7.5">mito-tRNA</text>
      <text x="160" y="82" textAnchor="middle" fill={c.s} fontSize="6.5" opacity="0.7">taurine modification</text>
      <ellipse cx="165" cy="120" rx="34" ry="18" fill={c.f} stroke={c.s} strokeWidth="1.6" strokeOpacity="0.85" />
      <text x="165" y="117" textAnchor="middle" fill={c.s} fontSize="8">Bile acid</text>
      <text x="165" y="127" textAnchor="middle" fill={c.s} fontSize="6.5" opacity="0.7">conjugation</text>
      <ellipse cx="160" cy="163" rx="42" ry="18" fill={c.f} stroke={c.s} strokeWidth="1.6" strokeOpacity="0.85" />
      <text x="160" y="160" textAnchor="middle" fill={c.s} fontSize="7.5">Ca²⁺ handling</text>
      <text x="160" y="170" textAnchor="middle" fill={c.s} fontSize="6.5" opacity="0.7">osmoregulation</text>
      <path d="M200 75 L235 90" stroke={c.s} strokeWidth="1.4" strokeDasharray="4,3" strokeOpacity="0.6" />
      <path d="M199 120 L235 118" stroke={c.s} strokeWidth="1.4" strokeDasharray="4,3" strokeOpacity="0.6" />
      <path d="M202 163 L235 148" stroke={c.s} strokeWidth="1.4" strokeDasharray="4,3" strokeOpacity="0.6" />
      <ellipse cx="266" cy="118" rx="34" ry="34" fill="#1f2937" stroke={c.s} strokeWidth="2.5" />
      <text x="266" y="114" textAnchor="middle" fill="#e5e7eb" fontSize="8">Protein</text>
      <text x="266" y="124" textAnchor="middle" fill="#9ca3af" fontSize="7">synthesis</text>
      <text x="266" y="133" textAnchor="middle" fill="#9ca3af" fontSize="7">fidelity</text>
      <text x="160" y="205" textAnchor="middle" fill="#9ca3af" fontSize="7.5" opacity="0.7">plasma taurine declines ~80% by mid-life</text>
      <text x="160" y="232" textAnchor="middle" fill="#9ca3af" fontSize="11">Taurine — Multi-Pathway Cellular Support</text>
    </svg>
  );
};

/* ─── Spermidine ─── */
export const SpermidineVisual: React.FC<CompoundVisualProps> = ({ className = '', size = 320 }) => {
  const c = ACC.violet;
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn(className)} aria-label="Spermidine — EP300 inhibition drives autophagy induction" role="img">
      <rect width="320" height="240" fill="#030712" rx="8" />
      <circle cx="55" cy="110" r="26" fill={c.f} stroke={c.s} strokeWidth="2" />
      <text x="55" y="108" textAnchor="middle" fill={c.s} fontSize="8.5" fontWeight="700">Spermi-</text>
      <text x="55" y="118" textAnchor="middle" fill={c.s} fontSize="8.5" fontWeight="700">dine</text>
      <path d="M81 110 L118 110" stroke={c.s} strokeWidth="2.5" />
      <path d="M110 104 L118 110 L110 116" stroke={c.s} strokeWidth="2" fill="none" />
      <rect x="128" y="90" width="70" height="40" rx="8" fill="#fb718510" stroke="#fb7185" strokeWidth="1.5" strokeOpacity="0.8" />
      <text x="163" y="107" textAnchor="middle" fill="#fb7185" fontSize="9">EP300 ↓</text>
      <text x="163" y="119" textAnchor="middle" fill="#fb7185" fontSize="7" opacity="0.8">acetyltransferase</text>
      <path d="M198 110 L228 110" stroke={c.s} strokeWidth="2.5" />
      <path d="M220 104 L228 110 L220 116" stroke={c.s} strokeWidth="2" fill="none" />
      <ellipse cx="266" cy="110" rx="38" ry="26" fill={c.f} stroke={c.s} strokeWidth="2" />
      <text x="266" y="107" textAnchor="middle" fill={c.s} fontSize="8">ATG</text>
      <text x="266" y="118" textAnchor="middle" fill={c.s} fontSize="7" opacity="0.7">deacetylated</text>
      <path d="M250 136 L215 165" stroke={c.s} strokeWidth="1.5" strokeOpacity="0.7" />
      <path d="M223 158 L215 165 L219 174" stroke={c.s} strokeWidth="1.5" fill="none" />
      <ellipse cx="180" cy="185" rx="60" ry="24" fill="#1f2937" stroke={c.s} strokeWidth="2.5" />
      <text x="180" y="182" textAnchor="middle" fill="#e5e7eb" fontSize="9" fontWeight="700">Autophagy flux ↑</text>
      <text x="180" y="194" textAnchor="middle" fill="#9ca3af" fontSize="7">cardio- &amp; neuroprotective</text>
      <text x="160" y="232" textAnchor="middle" fill="#9ca3af" fontSize="11">Spermidine → EP300 → Autophagy</text>
    </svg>
  );
};

/* ─── Sulforaphane ─── */
export const SulforaphaneVisual: React.FC<CompoundVisualProps> = ({ className = '', size = 320 }) => {
  const c = ACC.emerald;
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn(className)} aria-label="Sulforaphane — KEAP1/NRF2/ARE antioxidant response axis" role="img">
      <rect width="320" height="240" fill="#030712" rx="8" />
      <circle cx="55" cy="110" r="24" fill={c.f} stroke={c.s} strokeWidth="2" />
      <text x="55" y="107" textAnchor="middle" fill={c.s} fontSize="7.5" fontWeight="700">Sulfo-</text>
      <text x="55" y="117" textAnchor="middle" fill={c.s} fontSize="7.5" fontWeight="700">raphane</text>
      <path d="M79 110 L108 96" stroke={c.s} strokeWidth="2" strokeOpacity="0.8" />
      <ellipse cx="140" cy="82" rx="32" ry="18" fill="#fb718510" stroke="#fb7185" strokeWidth="1.5" strokeOpacity="0.8" />
      <text x="140" y="86" textAnchor="middle" fill="#fb7185" fontSize="9">KEAP1</text>
      <path d="M155 96 L180 112" stroke={c.s} strokeWidth="2" strokeOpacity="0.7" />
      <ellipse cx="205" cy="120" rx="34" ry="20" fill={c.f} stroke={c.s} strokeWidth="2" />
      <text x="205" y="124" textAnchor="middle" fill={c.s} fontSize="9">NRF2</text>
      <text x="205" y="97" textAnchor="middle" fill="#9ca3af" fontSize="6.5" opacity="0.7">released</text>
      <path d="M235 118 L265 108" stroke={c.s} strokeWidth="2.2" />
      <path d="M257 103 L265 108 L259 114" stroke={c.s} strokeWidth="1.8" fill="none" />
      <rect x="235" y="70" width="70" height="22" rx="11" fill={c.f} stroke={c.s} strokeWidth="1.5" strokeOpacity="0.7" />
      <text x="270" y="84" textAnchor="middle" fill={c.s} fontSize="7.5">nucleus · ARE</text>
      <rect x="120" y="165" width="180" height="30" rx="10" fill="#1f2937" stroke={c.s} strokeWidth="2" />
      <text x="210" y="178" textAnchor="middle" fill="#e5e7eb" fontSize="8.5">NQO1 · HO-1 · GCLC</text>
      <text x="210" y="189" textAnchor="middle" fill="#9ca3af" fontSize="6.5">phase II detox enzymes</text>
      <path d="M205 140 L210 163" stroke={c.s} strokeWidth="1.5" strokeOpacity="0.7" />
      <text x="160" y="232" textAnchor="middle" fill="#9ca3af" fontSize="11">Sulforaphane → KEAP1/NRF2/ARE</text>
    </svg>
  );
};

/* ─── Resveratrol ─── */
export const ResveratrolVisual: React.FC<CompoundVisualProps> = ({ className = '', size = 320 }) => {
  const c = ACC.violet;
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn(className)} aria-label="Resveratrol — AMPK/SIRT1/PGC-1a mitochondrial biogenesis axis" role="img">
      <rect width="320" height="240" fill="#030712" rx="8" />
      <circle cx="55" cy="120" r="26" fill={c.f} stroke={c.s} strokeWidth="2" />
      <text x="55" y="117" textAnchor="middle" fill={c.s} fontSize="8" fontWeight="700">Resver-</text>
      <text x="55" y="127" textAnchor="middle" fill={c.s} fontSize="8" fontWeight="700">atrol</text>
      <path d="M81 110 L112 90" stroke={c.s} strokeWidth="2" strokeOpacity="0.8" />
      <path d="M81 130 L112 150" stroke={c.s} strokeWidth="2" strokeOpacity="0.8" />
      <ellipse cx="150" cy="80" rx="30" ry="18" fill={c.f} stroke={c.s} strokeWidth="2" strokeOpacity="0.85" />
      <text x="150" y="84" textAnchor="middle" fill={c.s} fontSize="9">AMPK</text>
      <ellipse cx="150" cy="160" rx="30" ry="18" fill={c.f} stroke={c.s} strokeWidth="1.6" strokeOpacity="0.6" />
      <text x="150" y="164" textAnchor="middle" fill={c.s} fontSize="8.5">SIRT1*</text>
      <path d="M180 85 L215 105" stroke={c.s} strokeWidth="2" strokeOpacity="0.8" />
      <path d="M180 155 L215 128" stroke={c.s} strokeWidth="1.6" strokeOpacity="0.6" />
      <ellipse cx="250" cy="118" rx="42" ry="26" fill="#1f2937" stroke={c.s} strokeWidth="2.5" />
      <text x="250" y="114" textAnchor="middle" fill="#e5e7eb" fontSize="8.5" fontWeight="700">PGC-1α</text>
      <text x="250" y="126" textAnchor="middle" fill="#9ca3af" fontSize="7">mito biogenesis</text>
      <text x="150" y="200" textAnchor="middle" fill="#9ca3af" fontSize="7" opacity="0.65">*direct SIRT1 activation debated — AMPK route better supported</text>
      <text x="160" y="232" textAnchor="middle" fill="#9ca3af" fontSize="11">Resveratrol → AMPK/PGC-1α Axis</text>
    </svg>
  );
};

/* ─── Rapamycin ─── */
export const RapamycinVisual: React.FC<CompoundVisualProps> = ({ className = '', size = 320 }) => {
  const c = ACC.rose;
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn(className)} aria-label="Rapamycin — FKBP12/mTORC1 inhibition" role="img">
      <rect width="320" height="240" fill="#030712" rx="8" />
      <circle cx="55" cy="120" r="26" fill={c.f} stroke={c.s} strokeWidth="2" />
      <text x="55" y="117" textAnchor="middle" fill={c.s} fontSize="8" fontWeight="700">Rapa-</text>
      <text x="55" y="127" textAnchor="middle" fill={c.s} fontSize="8" fontWeight="700">mycin</text>
      <path d="M81 120 L112 120" stroke={c.s} strokeWidth="2.5" />
      <path d="M104 114 L112 120 L104 126" stroke={c.s} strokeWidth="2" fill="none" />
      <ellipse cx="150" cy="120" rx="32" ry="20" fill={c.f} stroke={c.s} strokeWidth="2" />
      <text x="150" y="124" textAnchor="middle" fill={c.s} fontSize="9">FKBP12</text>
      <path d="M182 120 L212 120" stroke={c.s} strokeWidth="2.5" />
      <path d="M204 114 L212 120 L204 126" stroke={c.s} strokeWidth="2" fill="none" />
      <ellipse cx="255" cy="120" rx="42" ry="28" fill="#1f2937" stroke={c.s} strokeWidth="2.5" />
      <text x="255" y="116" textAnchor="middle" fill="#e5e7eb" fontSize="10" fontWeight="700">mTORC1</text>
      <text x="255" y="128" textAnchor="middle" fill="#fb7185" fontSize="8">inhibited</text>
      <path d="M225 150 L190 178" stroke={c.s} strokeWidth="1.3" strokeDasharray="4,3" strokeOpacity="0.6" />
      <path d="M285 150 L295 178" stroke={c.s} strokeWidth="1.3" strokeDasharray="4,3" strokeOpacity="0.6" />
      <rect x="140" y="180" width="170" height="24" rx="12" fill={c.f} stroke={c.s} strokeWidth="1.5" strokeOpacity="0.7" />
      <text x="225" y="196" textAnchor="middle" fill={c.s} fontSize="8.5">↓ anabolism · ↑ autophagy · lifespan ↑</text>
      <text x="160" y="232" textAnchor="middle" fill="#9ca3af" fontSize="11">Rapamycin → FKBP12/mTORC1</text>
    </svg>
  );
};

/* ─── Pterostilbene ─── */
export const PterostilbeneVisual: React.FC<CompoundVisualProps> = ({ className = '', size = 320 }) => {
  const c = ACC.violet;
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn(className)} aria-label="Pterostilbene — methylated stilbene with higher bioavailability than resveratrol" role="img">
      <rect width="320" height="240" fill="#030712" rx="8" />
      <ellipse cx="90" cy="110" rx="52" ry="30" fill={c.f} stroke={c.s} strokeWidth="2" strokeOpacity="0.5" />
      <text x="90" y="107" textAnchor="middle" fill={c.s} fontSize="8" opacity="0.7">stilbene core</text>
      <text x="90" y="118" textAnchor="middle" fill={c.s} fontSize="7" opacity="0.6">(shared w/ resveratrol)</text>
      <circle cx="145" cy="85" r="9" fill={c.s} />
      <text x="145" y="72" textAnchor="middle" fill={c.s} fontSize="7">OCH₃</text>
      <circle cx="155" cy="135" r="9" fill={c.s} />
      <text x="155" y="155" textAnchor="middle" fill={c.s} fontSize="7">OCH₃</text>
      <text x="150" y="110" textAnchor="middle" fill="#9ca3af" fontSize="6.5" opacity="0.7">2 methyl groups</text>
      <path d="M180 110 L212 110" stroke={c.s} strokeWidth="2.5" />
      <path d="M204 104 L212 110 L204 116" stroke={c.s} strokeWidth="2" fill="none" />
      <ellipse cx="260" cy="95" rx="40" ry="20" fill="#1f2937" stroke={c.s} strokeWidth="2" />
      <text x="260" y="92" textAnchor="middle" fill="#e5e7eb" fontSize="8">Oral bioavail. ↑</text>
      <text x="260" y="103" textAnchor="middle" fill="#9ca3af" fontSize="6.5">vs. resveratrol ~20%</text>
      <ellipse cx="260" cy="145" rx="40" ry="20" fill="#1f2937" stroke={c.s} strokeWidth="1.5" strokeOpacity="0.7" />
      <text x="260" y="149" textAnchor="middle" fill="#9ca3af" fontSize="8">Same SIRT1/Nrf2</text>
      <text x="160" y="232" textAnchor="middle" fill="#9ca3af" fontSize="11">Pterostilbene — Methylated Stilbene</text>
    </svg>
  );
};

/* ─── Ca-AKG ─── */
export const CakgVisual: React.FC<CompoundVisualProps> = ({ className = '', size = 320 }) => {
  const c = ACC.amber;
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn(className)} aria-label="Ca-AKG — TCA cycle anaplerosis and epigenetic dioxygenase cofactor" role="img">
      <rect width="320" height="240" fill="#030712" rx="8" />
      <circle cx="55" cy="120" r="26" fill={c.f} stroke={c.s} strokeWidth="2" />
      <text x="55" y="117" textAnchor="middle" fill={c.s} fontSize="7.5" fontWeight="700">Ca-AKG</text>
      <text x="55" y="128" textAnchor="middle" fill={c.s} fontSize="6.5" opacity="0.7">α-ketoglutarate</text>
      <path d="M81 108 L118 88" stroke={c.s} strokeWidth="2" strokeOpacity="0.8" />
      <path d="M81 132 L118 152" stroke={c.s} strokeWidth="2" strokeOpacity="0.8" />
      <ellipse cx="160" cy="75" rx="42" ry="20" fill={c.f} stroke={c.s} strokeWidth="2" />
      <text x="160" y="72" textAnchor="middle" fill={c.s} fontSize="8">TCA cycle</text>
      <text x="160" y="83" textAnchor="middle" fill={c.s} fontSize="6.5" opacity="0.7">anaplerosis / ATP</text>
      <ellipse cx="160" cy="163" rx="46" ry="22" fill={c.f} stroke={c.s} strokeWidth="2" />
      <text x="160" y="160" textAnchor="middle" fill={c.s} fontSize="8">TET / JmjC</text>
      <text x="160" y="171" textAnchor="middle" fill={c.s} fontSize="6.5" opacity="0.7">demethylases</text>
      <path d="M198 80 L230 100" stroke={c.s} strokeWidth="1.6" strokeDasharray="4,3" strokeOpacity="0.6" />
      <path d="M202 160 L232 140" stroke={c.s} strokeWidth="1.6" strokeDasharray="4,3" strokeOpacity="0.6" />
      <ellipse cx="262" cy="120" rx="36" ry="34" fill="#1f2937" stroke={c.s} strokeWidth="2.5" />
      <text x="262" y="116" textAnchor="middle" fill="#e5e7eb" fontSize="8">Epigenetic</text>
      <text x="262" y="127" textAnchor="middle" fill="#9ca3af" fontSize="7">&amp; energy axis</text>
      <text x="160" y="232" textAnchor="middle" fill="#9ca3af" fontSize="11">Ca-AKG — TCA &amp; Epigenetic Cofactor</text>
    </svg>
  );
};

/* ─── R-ALA ─── */
export const RalaVisual: React.FC<CompoundVisualProps> = ({ className = '', size = 320 }) => {
  const c = ACC.cyan;
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn(className)} aria-label="R-Lipoic Acid — mitochondrial cofactor and antioxidant recycler" role="img">
      <rect width="320" height="240" fill="#030712" rx="8" />
      <circle cx="55" cy="120" r="26" fill={c.f} stroke={c.s} strokeWidth="2" />
      <text x="55" y="117" textAnchor="middle" fill={c.s} fontSize="8" fontWeight="700">R-ALA</text>
      <text x="55" y="128" textAnchor="middle" fill={c.s} fontSize="6.5" opacity="0.7">lipoic acid</text>
      <path d="M81 110 L118 90" stroke={c.s} strokeWidth="2" strokeOpacity="0.8" />
      <path d="M81 130 L118 150" stroke={c.s} strokeWidth="2" strokeOpacity="0.8" />
      <ellipse cx="158" cy="80" rx="42" ry="20" fill={c.f} stroke={c.s} strokeWidth="2" />
      <text x="158" y="77" textAnchor="middle" fill={c.s} fontSize="7.5">PDH / α-KGDH</text>
      <text x="158" y="88" textAnchor="middle" fill={c.s} fontSize="6.5" opacity="0.7">mito cofactor</text>
      <ellipse cx="158" cy="163" rx="42" ry="22" fill={c.f} stroke={c.s} strokeWidth="2" />
      <text x="158" y="160" textAnchor="middle" fill={c.s} fontSize="8">Redox recycling</text>
      <text x="158" y="171" textAnchor="middle" fill={c.s} fontSize="6.5" opacity="0.7">GSH · Vit C/E</text>
      <path d="M198 86 L232 105" stroke={c.s} strokeWidth="1.6" strokeDasharray="4,3" strokeOpacity="0.6" />
      <path d="M200 158 L232 138" stroke={c.s} strokeWidth="1.6" strokeDasharray="4,3" strokeOpacity="0.6" />
      <ellipse cx="264" cy="120" rx="36" ry="34" fill="#1f2937" stroke={c.s} strokeWidth="2.5" />
      <text x="264" y="114" textAnchor="middle" fill="#e5e7eb" fontSize="8">Universal</text>
      <text x="264" y="124" textAnchor="middle" fill="#9ca3af" fontSize="7">antioxidant</text>
      <text x="264" y="133" textAnchor="middle" fill="#9ca3af" fontSize="7">recycler</text>
      <text x="160" y="232" textAnchor="middle" fill="#9ca3af" fontSize="11">R-ALA — Mitochondrial Cofactor</text>
    </svg>
  );
};

/* ─── TUDCA ─── */
export const TudcaVisual: React.FC<CompoundVisualProps> = ({ className = '', size = 320 }) => {
  const c = ACC.emerald;
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn(className)} aria-label="TUDCA — chaperone reduction of ER stress and the unfolded protein response" role="img">
      <rect width="320" height="240" fill="#030712" rx="8" />
      <circle cx="55" cy="120" r="26" fill={c.f} stroke={c.s} strokeWidth="2" />
      <text x="55" y="117" textAnchor="middle" fill={c.s} fontSize="8" fontWeight="700">TUDCA</text>
      <text x="55" y="128" textAnchor="middle" fill={c.s} fontSize="6.5" opacity="0.7">bile acid</text>
      <path d="M81 120 L112 120" stroke={c.s} strokeWidth="2.5" />
      <path d="M104 114 L112 120 L104 126" stroke={c.s} strokeWidth="2" fill="none" />
      <path d="M100 80 Q160 55 220 80 L220 160 Q160 185 100 160 Z" fill={c.f} stroke={c.s} strokeWidth="1.5" strokeOpacity="0.6" />
      <text x="160" y="75" textAnchor="middle" fill={c.s} fontSize="7.5" opacity="0.8">endoplasmic reticulum</text>
      <circle cx="140" cy="110" r="8" fill="#fb718530" stroke="#fb7185" strokeWidth="1.3" />
      <circle cx="180" cy="130" r="7" fill="#fb718530" stroke="#fb7185" strokeWidth="1.3" />
      <text x="160" y="150" textAnchor="middle" fill="#fb7185" fontSize="7" opacity="0.7">misfolded protein · UPR stress</text>
      <path d="M160 120 m-14,-14 l28,28 M160 120 m14,-14 l-28,28" stroke={c.s} strokeWidth="1.5" strokeOpacity="0.5" />
      <path d="M225 120 L258 120" stroke={c.s} strokeWidth="2.2" />
      <path d="M250 114 L258 120 L250 126" stroke={c.s} strokeWidth="1.8" fill="none" />
      <ellipse cx="278" cy="120" rx="30" ry="34" fill="#1f2937" stroke={c.s} strokeWidth="2.5" />
      <text x="278" y="114" textAnchor="middle" fill="#e5e7eb" fontSize="7.5">ER stress</text>
      <text x="278" y="124" textAnchor="middle" fill="#9ca3af" fontSize="7">↓ chaperone</text>
      <text x="278" y="134" textAnchor="middle" fill="#9ca3af" fontSize="7">support</text>
      <text x="160" y="232" textAnchor="middle" fill="#9ca3af" fontSize="11">TUDCA → ER Stress (UPR) Reduction</text>
    </svg>
  );
};

/* ─── Berberine ─── */
export const BerberineVisual: React.FC<CompoundVisualProps> = ({ className = '', size = 320 }) => {
  const c = ACC.violet;
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn(className)} aria-label="Berberine — mitochondrial Complex I inhibition drives AMPK activation" role="img">
      <rect width="320" height="240" fill="#030712" rx="8" />
      <circle cx="55" cy="120" r="26" fill={c.f} stroke={c.s} strokeWidth="2" />
      <text x="55" y="117" textAnchor="middle" fill={c.s} fontSize="8" fontWeight="700">Berber-</text>
      <text x="55" y="127" textAnchor="middle" fill={c.s} fontSize="8" fontWeight="700">ine</text>
      <path d="M81 120 L112 120" stroke={c.s} strokeWidth="2.5" />
      <path d="M104 114 L112 120 L104 126" stroke={c.s} strokeWidth="2" fill="none" />
      <ellipse cx="152" cy="120" rx="36" ry="20" fill={c.f} stroke={c.s} strokeWidth="2" strokeOpacity="0.85" />
      <text x="152" y="117" textAnchor="middle" fill={c.s} fontSize="8">Complex I ↓</text>
      <text x="152" y="128" textAnchor="middle" fill={c.s} fontSize="6.5" opacity="0.7">mild mito inhibition</text>
      <path d="M188 120 L216 120" stroke={c.s} strokeWidth="2.5" />
      <path d="M208 114 L216 120 L208 126" stroke={c.s} strokeWidth="2" fill="none" />
      <ellipse cx="262" cy="120" rx="42" ry="27" fill="#1f2937" stroke={c.s} strokeWidth="2.5" />
      <text x="262" y="112" textAnchor="middle" fill="#e5e7eb" fontSize="9.5" fontWeight="700">AMPK ↑</text>
      <text x="262" y="123" textAnchor="middle" fill="#9ca3af" fontSize="6.5">↑AMP:ATP</text>
      <text x="262" y="133" textAnchor="middle" fill="#9ca3af" fontSize="6.5">energy sensor</text>
      <path d="M235 148 L200 178" stroke={c.s} strokeWidth="1.3" strokeDasharray="4,3" strokeOpacity="0.6" />
      <path d="M289 148 L300 178" stroke={c.s} strokeWidth="1.3" strokeDasharray="4,3" strokeOpacity="0.6" />
      <rect x="130" y="180" width="170" height="24" rx="12" fill={c.f} stroke={c.s} strokeWidth="1.5" strokeOpacity="0.7" />
      <text x="215" y="196" textAnchor="middle" fill={c.s} fontSize="8">↑glucose uptake · ↓gluconeogenesis · HbA1c ↓</text>
      <text x="160" y="232" textAnchor="middle" fill="#9ca3af" fontSize="11">Berberine → AMPK Activation</text>
    </svg>
  );
};

/* ─── Grape Seed Extract (OPC) ─── */
export const GrapeseedVisual: React.FC<CompoundVisualProps> = ({ className = '', size = 320 }) => {
  const c = ACC.emerald;
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn(className)} aria-label="Grape Seed Extract OPC — four-pathway antioxidant and vascular defense" role="img">
      <rect width="320" height="240" fill="#030712" rx="8" />
      <circle cx="55" cy="120" r="26" fill={c.f} stroke={c.s} strokeWidth="2" />
      <text x="55" y="117" textAnchor="middle" fill={c.s} fontSize="7.5" fontWeight="700">Grape Seed</text>
      <text x="55" y="128" textAnchor="middle" fill={c.s} fontSize="6.5" opacity="0.7">95% OPC</text>
      <path d="M81 105 L118 78" stroke={c.s} strokeWidth="1.8" strokeOpacity="0.75" />
      <path d="M81 118 L120 118" stroke={c.s} strokeWidth="1.8" strokeOpacity="0.75" />
      <path d="M81 132 L118 158" stroke={c.s} strokeWidth="1.8" strokeOpacity="0.75" />
      <ellipse cx="160" cy="70" rx="42" ry="16" fill={c.f} stroke={c.s} strokeWidth="1.6" strokeOpacity="0.85" />
      <text x="160" y="74" textAnchor="middle" fill={c.s} fontSize="7.5">ROS scavenging · NF-κB ↓</text>
      <ellipse cx="165" cy="118" rx="34" ry="18" fill={c.f} stroke={c.s} strokeWidth="1.6" strokeOpacity="0.85" />
      <text x="165" y="115" textAnchor="middle" fill={c.s} fontSize="8">Nrf2</text>
      <text x="165" y="125" textAnchor="middle" fill={c.s} fontSize="6.5" opacity="0.7">activation</text>
      <ellipse cx="160" cy="163" rx="42" ry="18" fill={c.f} stroke={c.s} strokeWidth="1.6" strokeOpacity="0.85" />
      <text x="160" y="160" textAnchor="middle" fill={c.s} fontSize="7.5">eNOS / NO ↑</text>
      <text x="160" y="171" textAnchor="middle" fill={c.s} fontSize="6.5" opacity="0.7">endothelial function</text>
      <path d="M203 74 L235 90" stroke={c.s} strokeWidth="1.4" strokeDasharray="4,3" strokeOpacity="0.6" />
      <path d="M199 118 L235 118" stroke={c.s} strokeWidth="1.4" strokeDasharray="4,3" strokeOpacity="0.6" />
      <path d="M202 163 L235 148" stroke={c.s} strokeWidth="1.4" strokeDasharray="4,3" strokeOpacity="0.6" />
      <ellipse cx="266" cy="118" rx="34" ry="34" fill="#1f2937" stroke={c.s} strokeWidth="2.5" />
      <text x="266" y="112" textAnchor="middle" fill="#e5e7eb" fontSize="7.5">SBP ↓</text>
      <text x="266" y="122" textAnchor="middle" fill="#9ca3af" fontSize="6.5">LDL oxid. ↓</text>
      <text x="266" y="131" textAnchor="middle" fill="#9ca3af" fontSize="6.5">FMD ↑</text>
      <text x="160" y="205" textAnchor="middle" fill="#9ca3af" fontSize="7.5" opacity="0.7">20–50× stronger antioxidant than vitamin C</text>
      <text x="160" y="232" textAnchor="middle" fill="#9ca3af" fontSize="11">Grape Seed OPC — Four-Pathway Defense</text>
    </svg>
  );
};

/* ─── Urolithin A ─── */
export const UrolithinAVisual: React.FC<CompoundVisualProps> = ({ className = '', size = 320 }) => {
  const c = ACC.amber;
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn(className)} aria-label="Urolithin A — mitophagy activation clears damaged mitochondria" role="img">
      <rect width="320" height="240" fill="#030712" rx="8" />
      <circle cx="55" cy="120" r="26" fill={c.f} stroke={c.s} strokeWidth="2" />
      <text x="55" y="117" textAnchor="middle" fill={c.s} fontSize="7.5" fontWeight="700">Urolithin</text>
      <text x="55" y="128" textAnchor="middle" fill={c.s} fontSize="7.5" fontWeight="700">A</text>
      <path d="M81 120 L112 120" stroke={c.s} strokeWidth="2.5" />
      <path d="M104 114 L112 120 L104 126" stroke={c.s} strokeWidth="2" fill="none" />
      <ellipse cx="155" cy="120" rx="40" ry="22" fill={c.f} stroke={c.s} strokeWidth="2" strokeOpacity="0.85" />
      <text x="155" y="116" textAnchor="middle" fill={c.s} fontSize="8">Mitophagy</text>
      <text x="155" y="127" textAnchor="middle" fill={c.s} fontSize="6.5" opacity="0.7">activated</text>
      <path d="M195 120 L222 120" stroke={c.s} strokeWidth="2.5" />
      <path d="M214 114 L222 120 L214 126" stroke={c.s} strokeWidth="2" fill="none" />
      <ellipse cx="266" cy="120" rx="40" ry="27" fill="#1f2937" stroke={c.s} strokeWidth="2.5" />
      <text x="266" y="112" textAnchor="middle" fill="#e5e7eb" fontSize="7.5">Damaged mito</text>
      <text x="266" y="122" textAnchor="middle" fill="#9ca3af" fontSize="6.5">selectively</text>
      <text x="266" y="132" textAnchor="middle" fill="#9ca3af" fontSize="6.5">cleared</text>
      <path d="M235 148 L200 178" stroke={c.s} strokeWidth="1.3" strokeDasharray="4,3" strokeOpacity="0.6" />
      <path d="M295 148 L305 178" stroke={c.s} strokeWidth="1.3" strokeDasharray="4,3" strokeOpacity="0.6" />
      <rect x="130" y="180" width="170" height="24" rx="12" fill={c.f} stroke={c.s} strokeWidth="1.5" strokeOpacity="0.7" />
      <text x="215" y="196" textAnchor="middle" fill={c.s} fontSize="8">muscle strength ↑ · fatigue ↓ (Phase 2 RCT)</text>
      <text x="160" y="232" textAnchor="middle" fill="#9ca3af" fontSize="11">Urolithin A → Mitophagy Activation</text>
    </svg>
  );
};

/* ─── Fisetin ─── */
export const FisetinVisual: React.FC<CompoundVisualProps> = ({ className = '', size = 320 }) => {
  const c = ACC.rose;
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn(className)} aria-label="Fisetin — senolytic clearance of senescent cells" role="img">
      <rect width="320" height="240" fill="#030712" rx="8" />
      <circle cx="55" cy="120" r="26" fill={c.f} stroke={c.s} strokeWidth="2" />
      <text x="55" y="123" textAnchor="middle" fill={c.s} fontSize="9" fontWeight="700">Fisetin</text>
      <path d="M81 120 L112 120" stroke={c.s} strokeWidth="2.5" />
      <path d="M104 114 L112 120 L104 126" stroke={c.s} strokeWidth="2" fill="none" />
      <ellipse cx="155" cy="120" rx="40" ry="22" fill={c.f} stroke={c.s} strokeWidth="2" strokeOpacity="0.85" />
      <text x="155" y="116" textAnchor="middle" fill={c.s} fontSize="7.5">Senescent cells</text>
      <text x="155" y="127" textAnchor="middle" fill={c.s} fontSize="6.5" opacity="0.7">targeted (SASP)</text>
      <path d="M195 120 L222 120" stroke={c.s} strokeWidth="2.5" />
      <path d="M214 114 L222 120 L214 126" stroke={c.s} strokeWidth="2" fill="none" />
      <ellipse cx="266" cy="120" rx="40" ry="27" fill="#1f2937" stroke={c.s} strokeWidth="2.5" />
      <text x="266" y="114" textAnchor="middle" fill="#e5e7eb" fontSize="8" fontWeight="700">Apoptosis</text>
      <text x="266" y="125" textAnchor="middle" fill="#9ca3af" fontSize="6.5">triggered</text>
      <text x="266" y="134" textAnchor="middle" fill="#9ca3af" fontSize="6.5">selectively</text>
      <path d="M235 148 L200 178" stroke={c.s} strokeWidth="1.3" strokeDasharray="4,3" strokeOpacity="0.6" />
      <path d="M295 148 L305 178" stroke={c.s} strokeWidth="1.3" strokeDasharray="4,3" strokeOpacity="0.6" />
      <rect x="125" y="180" width="180" height="24" rx="12" fill={c.f} stroke={c.s} strokeWidth="1.5" strokeOpacity="0.7" />
      <text x="215" y="196" textAnchor="middle" fill={c.s} fontSize="8">p16 ↓ · p21 ↓ · SASP ↓ (Mayo pilot)</text>
      <text x="160" y="232" textAnchor="middle" fill="#9ca3af" fontSize="11">Fisetin → Senolytic Clearance</text>
    </svg>
  );
};

/* ─── CoQ10 (Ubiquinol) ─── */
export const Coq10Visual: React.FC<CompoundVisualProps> = ({ className = '', size = 320 }) => {
  const c = ACC.cyan;
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn(className)} aria-label="CoQ10 ubiquinol — electron transport chain cofactor" role="img">
      <rect width="320" height="240" fill="#030712" rx="8" />
      <circle cx="55" cy="120" r="26" fill={c.f} stroke={c.s} strokeWidth="2" />
      <text x="55" y="117" textAnchor="middle" fill={c.s} fontSize="8" fontWeight="700">CoQ10</text>
      <text x="55" y="128" textAnchor="middle" fill={c.s} fontSize="6.5" opacity="0.7">ubiquinol</text>
      <path d="M81 120 L112 120" stroke={c.s} strokeWidth="2.5" />
      <path d="M104 114 L112 120 L104 126" stroke={c.s} strokeWidth="2" fill="none" />
      <ellipse cx="160" cy="120" rx="44" ry="22" fill={c.f} stroke={c.s} strokeWidth="2" strokeOpacity="0.85" />
      <text x="160" y="116" textAnchor="middle" fill={c.s} fontSize="8">Electron Transport</text>
      <text x="160" y="127" textAnchor="middle" fill={c.s} fontSize="6.5" opacity="0.7">Complex I · II · III cofactor</text>
      <path d="M204 120 L228 120" stroke={c.s} strokeWidth="2.5" />
      <path d="M220 114 L228 120 L220 126" stroke={c.s} strokeWidth="2" fill="none" />
      <ellipse cx="270" cy="120" rx="36" ry="27" fill="#1f2937" stroke={c.s} strokeWidth="2.5" />
      <text x="270" y="114" textAnchor="middle" fill="#e5e7eb" fontSize="7.5" fontWeight="700">ATP ↑</text>
      <text x="270" y="125" textAnchor="middle" fill="#9ca3af" fontSize="6.5">antioxidant</text>
      <text x="270" y="134" textAnchor="middle" fill="#9ca3af" fontSize="6.5">recycling</text>
      <path d="M240 148 L210 178" stroke={c.s} strokeWidth="1.3" strokeDasharray="4,3" strokeOpacity="0.6" />
      <path d="M295 148 L300 178" stroke={c.s} strokeWidth="1.3" strokeDasharray="4,3" strokeOpacity="0.6" />
      <rect x="130" y="180" width="170" height="24" rx="12" fill={c.f} stroke={c.s} strokeWidth="1.5" strokeOpacity="0.7" />
      <text x="215" y="196" textAnchor="middle" fill={c.s} fontSize="8">hs-CRP ↓ · IL-6 ↓ · critical for statin users</text>
      <text x="160" y="232" textAnchor="middle" fill="#9ca3af" fontSize="11">CoQ10 → Electron Transport Chain</text>
    </svg>
  );
};

/* ─── Omega-3 (EPA + DHA) ─── */
export const Omega3Visual: React.FC<CompoundVisualProps> = ({ className = '', size = 320 }) => {
  const c = ACC.emerald;
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn(className)} aria-label="Omega-3 EPA and DHA — specialized pro-resolving mediator resolution axis" role="img">
      <rect width="320" height="240" fill="#030712" rx="8" />
      <circle cx="55" cy="120" r="26" fill={c.f} stroke={c.s} strokeWidth="2" />
      <text x="55" y="117" textAnchor="middle" fill={c.s} fontSize="8" fontWeight="700">EPA +</text>
      <text x="55" y="128" textAnchor="middle" fill={c.s} fontSize="8" fontWeight="700">DHA</text>
      <path d="M81 120 L112 120" stroke={c.s} strokeWidth="2.5" />
      <path d="M104 114 L112 120 L104 126" stroke={c.s} strokeWidth="2" fill="none" />
      <ellipse cx="160" cy="120" rx="44" ry="22" fill={c.f} stroke={c.s} strokeWidth="2" strokeOpacity="0.85" />
      <text x="160" y="116" textAnchor="middle" fill={c.s} fontSize="8">SPM synthesis</text>
      <text x="160" y="127" textAnchor="middle" fill={c.s} fontSize="6.5" opacity="0.7">resolvins · protectins</text>
      <path d="M204 120 L228 120" stroke={c.s} strokeWidth="2.5" />
      <path d="M220 114 L228 120 L220 126" stroke={c.s} strokeWidth="2" fill="none" />
      <ellipse cx="270" cy="120" rx="36" ry="27" fill="#1f2937" stroke={c.s} strokeWidth="2.5" />
      <text x="270" y="113" textAnchor="middle" fill="#e5e7eb" fontSize="7">Active</text>
      <text x="270" y="123" textAnchor="middle" fill="#9ca3af" fontSize="6.5">inflammation</text>
      <text x="270" y="132" textAnchor="middle" fill="#9ca3af" fontSize="6.5">resolution</text>
      <path d="M240 148 L210 178" stroke={c.s} strokeWidth="1.3" strokeDasharray="4,3" strokeOpacity="0.6" />
      <path d="M295 148 L300 178" stroke={c.s} strokeWidth="1.3" strokeDasharray="4,3" strokeOpacity="0.6" />
      <rect x="120" y="180" width="180" height="24" rx="12" fill={c.f} stroke={c.s} strokeWidth="1.5" strokeOpacity="0.7" />
      <text x="210" y="196" textAnchor="middle" fill={c.s} fontSize="8">MACE ↓25% (REDUCE-IT) · CRP ↓</text>
      <text x="160" y="232" textAnchor="middle" fill="#9ca3af" fontSize="11">Omega-3 → SPM Resolution Axis</text>
    </svg>
  );
};

/* ─── Convenience map — keyed by module.slug / mdx filename stem ─── */
export const COMPOUND_VISUALS: Record<string, React.ComponentType<CompoundVisualProps>> = {
  nmn: NmnVisual,
  nr: NrVisual,
  glynac: GlynacVisual,
  taurine: TaurineVisual,
  spermidine: SpermidineVisual,
  sulforaphane: SulforaphaneVisual,
  resveratrol: ResveratrolVisual,
  rapamycin: RapamycinVisual,
  pterostilbene: PterostilbeneVisual,
  cakg: CakgVisual,
  rala: RalaVisual,
  tudca: TudcaVisual,
  berberine: BerberineVisual,
  grapeseed: GrapeseedVisual,
  urolithina: UrolithinAVisual,
  fisetin: FisetinVisual,
  coq10: Coq10Visual,
  omega3: Omega3Visual,
};
