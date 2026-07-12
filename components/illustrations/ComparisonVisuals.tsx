import React from 'react';
import { cn } from '@/lib/utils';

interface ComparisonVisualProps {
  slug: string;
  className?: string;
  width?: number;
}

type Accent = 'cyan' | 'emerald' | 'violet' | 'amber' | 'rose';

const ACC: Record<Accent, { s: string; f: string }> = {
  cyan:    { s: '#22d3ee', f: '#083344' },
  emerald: { s: '#34d399', f: '#052e16' },
  violet:  { s: '#a78bfa', f: '#1e1b4b' },
  amber:   { s: '#fbbf24', f: '#292524' },
  rose:    { s: '#fb7185', f: '#2d0a12' },
};

interface Side {
  label: string;
  accent: Accent;
  chips: [string, string, string];
}

interface CompareSpec {
  a: Side;
  b: Side;
  axis: string;
}

/* Keyed by comparison slug. Each side lists a compact 3-step mechanism flow. */
const SPECS: Record<string, CompareSpec> = {
  'nmn-vs-nr': {
    a: { label: 'NMN', accent: 'cyan', chips: ['NMN', 'NMNAT (direct)', 'NAD⁺ pool'] },
    b: { label: 'NR', accent: 'violet', chips: ['NR', 'NRK1 (extra step)', 'NAD⁺ pool'] },
    axis: 'Both restore the NAD⁺ pool — the debate is the route',
  },
  'glynac-vs-liposomal-glutathione': {
    a: { label: 'GlyNAC', accent: 'emerald', chips: ['Glycine + NAC', 'GSH synthetase', 'GSH↑ (endogenous)'] },
    b: { label: 'Liposomal GSH', accent: 'amber', chips: ['Oral glutathione', 'Liposome carrier', 'Variable uptake'] },
    axis: 'Rebuild glutathione vs swallow it',
  },
  'sulforaphane-vs-curcumin': {
    a: { label: 'Sulforaphane', accent: 'emerald', chips: ['KEAP1 modified', 'NRF2 released', '200+ ARE genes'] },
    b: { label: 'Curcumin', accent: 'amber', chips: ['NF-κB ↓', 'COX / LOX', 'Indirect effect'] },
    axis: 'Covalent NRF2 switch vs broad inflammation modulation',
  },
  'resveratrol-vs-pterostilbene': {
    a: { label: 'Resveratrol', accent: 'violet', chips: ['Stilbene core', 'SIRT1*', '~20% bioavailable'] },
    b: { label: 'Pterostilbene', accent: 'cyan', chips: ['2× methyl (OCH₃)', 'SIRT1', '~80% bioavailable'] },
    axis: 'Same SIRT1 axis — methoxy groups change absorption',
  },
  'nrf2-triad-vs-mito-stack': {
    a: { label: 'NRF2 Triad', accent: 'emerald', chips: ['Sulforaphane', 'GlyNAC', 'R-ALA'] },
    b: { label: 'NAD⁺ Mito Stack', accent: 'cyan', chips: ['NMN', 'Ca-AKG', 'CoQ10'] },
    axis: 'Antioxidant defense first, or mitochondrial fuel first',
  },
  'starter-elite-vs-full-hybrid': {
    a: { label: 'Starter Elite', accent: 'cyan', chips: ['Core 4 compounds', 'Foundation', 'Entry point'] },
    b: { label: 'Full Hybrid', accent: 'violet', chips: ['8+ compounds', 'All hallmarks', 'Maximum coverage'] },
    axis: 'Simple foundation vs maximum hallmark breadth',
  },
  'berberine-vs-metformin': {
    a: { label: 'Berberine', accent: 'violet', chips: ['Complex I ↓', 'AMPK ↑', 'Over-the-counter'] },
    b: { label: 'Metformin', accent: 'rose', chips: ['Complex I ↓', 'AMPK ↑', 'Prescription'] },
    axis: 'Comparable AMPK glucose control — one needs an Rx',
  },
  'urolithina-vs-coq10': {
    a: { label: 'Urolithin A', accent: 'amber', chips: ['Mitophagy', 'Clear damaged mito', 'Recycle'] },
    b: { label: 'CoQ10', accent: 'cyan', chips: ['ETC cofactor', 'Electron transfer', 'Fuel & protect'] },
    axis: 'Mitochondrial health — clear old vs power existing',
  },
  'nmn-vs-spermidine': {
    a: { label: 'NMN', accent: 'cyan', chips: ['NAD⁺ pool', 'SIRT1 / PARP', 'Repair capacity'] },
    b: { label: 'Spermidine', accent: 'violet', chips: ['EP300 ↓', 'Autophagy flux', 'Cellular clearance'] },
    axis: 'NAD⁺ repletion vs direct autophagy induction',
  },
  'fisetin-vs-quercetin': {
    a: { label: 'Fisetin', accent: 'rose', chips: ['Senolytic', 'p16 / p21 ↓', 'Effective solo'] },
    b: { label: 'Quercetin', accent: 'amber', chips: ['Senolytic', 'Pairs w/ dasatinib', 'Weaker solo'] },
    axis: 'Both clear senescent cells — potency differs',
  },
  'taurine-vs-nmn': {
    a: { label: 'Taurine', accent: 'amber', chips: ['Osmolyte', 'Mito-tRNA', 'Membrane buffer'] },
    b: { label: 'NMN', accent: 'cyan', chips: ['NAD⁺ pool', 'SIRT1', 'Repair capacity'] },
    axis: 'Distinct, complementary aging nodes',
  },
  'cakg-vs-spermidine': {
    a: { label: 'Ca-AKG', accent: 'amber', chips: ['TCA anaplerosis', 'TET / JmjC', 'Epigenetic reset'] },
    b: { label: 'Spermidine', accent: 'violet', chips: ['EP300 ↓', 'Autophagy flux', 'Cellular clearance'] },
    axis: 'Epigenetic reprogramming vs autophagy induction',
  },
  'rapamycin-vs-metformin': {
    a: { label: 'Rapamycin', accent: 'rose', chips: ['FKBP12', 'mTORC1 ↓ (potent)', 'Rx · higher risk'] },
    b: { label: 'Metformin', accent: 'cyan', chips: ['AMPK ↑', 'mTOR ↓ (indirect)', 'Rx · milder'] },
    axis: 'mTOR suppression — strength vs safety margin',
  },
  'coq10-vs-ubiquinol': {
    a: { label: 'CoQ10 (ubiquinone)', accent: 'cyan', chips: ['Oxidized form', 'Convert first', 'Fine under 40'] },
    b: { label: 'Ubiquinol', accent: 'emerald', chips: ['Reduced form', '~3× absorption', 'Preferred over 40'] },
    axis: 'Same molecule — oxidation state changes absorption',
  },
  'omega3-vs-krill-oil': {
    a: { label: 'Fish Oil', accent: 'cyan', chips: ['Triglyceride form', 'High EPA/DHA mg', 'Best value'] },
    b: { label: 'Krill Oil', accent: 'rose', chips: ['Phospholipid form', 'Lower mg/serving', 'Premium price'] },
    axis: 'EPA/DHA delivery form vs dose economics',
  },
};

function Panel({ side, cx, dir }: { side: Side; cx: number; dir: 1 | -1 }) {
  const c = ACC[side.accent];
  const chipW = 200;
  const chipYs = [82, 137, 192];
  return (
    <g>
      <text x={cx} y={46} textAnchor="middle" fill={c.s} fontSize="15" fontWeight="700">
        {side.label}
      </text>
      {side.chips.map((chip, i) => (
        <g key={i}>
          {i > 0 && (
            <path
              d={`M${cx} ${chipYs[i - 1] + 17} L${cx} ${chipYs[i] - 17}`}
              stroke={c.s}
              strokeWidth="1.6"
              strokeOpacity="0.7"
            />
          )}
          {i > 0 && (
            <path
              d={`M${cx - 4} ${chipYs[i] - 23} L${cx} ${chipYs[i] - 17} L${cx + 4} ${chipYs[i] - 23}`}
              stroke={c.s}
              strokeWidth="1.4"
              fill="none"
            />
          )}
          <rect
            x={cx - chipW / 2}
            y={chipYs[i] - 15}
            width={chipW}
            height={30}
            rx={8}
            fill={c.f}
            stroke={c.s}
            strokeWidth="1.4"
            strokeOpacity={i === side.chips.length - 1 ? 1 : 0.75}
          />
          <text x={cx} y={chipYs[i] + 4} textAnchor="middle" fill={c.s} fontSize="11">
            {chip}
          </text>
        </g>
      ))}
      {/* subtle directional glow accent along the outer edge */}
      <rect
        x={dir === -1 ? cx - chipW / 2 - 14 : cx + chipW / 2 + 6}
        y={70}
        width={8}
        height={136}
        rx={4}
        fill={c.s}
        opacity="0.14"
      />
    </g>
  );
}

/**
 * Side-by-side "versus" mechanism banner for an evidence comparison.
 * Renders null for slugs without a spec so the caller can conditionally include it.
 */
export function ComparisonVisual({ slug, className = '', width = 640 }: ComparisonVisualProps) {
  const spec = SPECS[slug];
  if (!spec) return null;
  const height = width * (260 / 640);
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 640 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      role="img"
      aria-label={`${spec.a.label} versus ${spec.b.label} — mechanism comparison`}
    >
      <rect width="640" height="260" fill="#030712" rx="10" />
      <Panel side={spec.a} cx={165} dir={-1} />
      <Panel side={spec.b} cx={475} dir={1} />

      {/* Center divider + VS badge */}
      <path d="M320 34 L320 210" stroke="#374151" strokeWidth="1.4" strokeDasharray="4,4" />
      <circle cx="320" cy="128" r="22" fill="#0b1220" stroke="#6b7280" strokeWidth="1.6" />
      <text x="320" y="133" textAnchor="middle" fill="#e5e7eb" fontSize="12" fontWeight="700">
        VS
      </text>

      {/* Shared-axis caption */}
      <text x="320" y="242" textAnchor="middle" fill="#9ca3af" fontSize="11">
        {spec.axis}
      </text>
    </svg>
  );
}

export const COMPARISON_VISUAL_SLUGS = Object.keys(SPECS);
