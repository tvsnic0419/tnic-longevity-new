'use client';

import { useState, useId, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { VIZ, tierColor } from '@/components/viz/tokens';
import { getEdgeExplanation } from '@/lib/hero-network';

// ── Pathway clusters ─────────────────────────────────────────────────────────
type Pathway = 'nrf2' | 'nad' | 'sirtuin' | 'ampk' | 'senolytic';

// Sourced from the canonical viz tokens, not restated, so this can't drift
// from EvidenceTag/tierColor() the way a second hardcoded copy could.
const PATHWAY_COLOR: Record<Pathway, string> = {
  nrf2:      VIZ.cyan,
  nad:       VIZ.emerald,
  sirtuin:   VIZ.violet,
  ampk:      VIZ.amber,
  senolytic: VIZ.rose,
};

const PATHWAY_LABEL: Record<Pathway, string> = {
  nrf2:      'NRF2 · Antioxidant',
  nad:       'NAD⁺ · Mitochondrial',
  sirtuin:   'SIRT1 · Epigenetic',
  ampk:      'AMPK · Metabolic',
  senolytic: 'Senolytic',
};

// ── Node data ─────────────────────────────────────────────────────────────────
interface CompoundNode {
  id: string;
  name: string;
  short: string;
  pathway: Pathway;
  href: string;
  tier: 'A' | 'B';
  x: number;
  y: number;
  labelAnchor?: 'start' | 'middle' | 'end';
  labelDy?: number;
  labelDx?: number;
}

// Layout: NMN + Resveratrol as inner hubs; 12 compounds on outer ring
// ViewBox 700×490, center (350, 245), outer radius 200
const NODES: CompoundNode[] = [
  // ── inner hubs ──
  { id: 'nmn',          name: 'NMN',          short: 'NMN',    pathway: 'nad',      tier: 'A', href: '/library/compounds/nmn',          x: 290, y: 245, labelAnchor: 'end',    labelDx: -14 },
  { id: 'resveratrol',  name: 'Resveratrol',   short: 'RSV',    pathway: 'sirtuin',  tier: 'B', href: '/library/compounds/resveratrol',   x: 410, y: 245, labelAnchor: 'start',  labelDx:  14 },
  // ── outer ring (30° steps, starting -90° / top) ──
  { id: 'glynac',       name: 'GlyNAC',        short: 'GlyNAC', pathway: 'nrf2',     tier: 'A', href: '/library/compounds/glynac',        x: 350, y:  45, labelAnchor: 'middle', labelDy: -16 },
  { id: 'taurine',      name: 'Taurine',        short: 'TAU',    pathway: 'nad',      tier: 'B', href: '/library/compounds/taurine',       x: 450, y:  72, labelAnchor: 'start',  labelDx:  14 },
  { id: 'coq10',        name: 'CoQ10',          short: 'CoQ10',  pathway: 'nad',      tier: 'B', href: '/library/compounds/coq10',         x: 523, y: 145, labelAnchor: 'start',  labelDx:  14 },
  { id: 'cakg',         name: 'Ca-AKG',         short: 'AKG',    pathway: 'nad',      tier: 'A', href: '/library/compounds/cakg',          x: 550, y: 245, labelAnchor: 'start',  labelDx:  14 },
  { id: 'berberine',    name: 'Berberine',       short: 'BBR',    pathway: 'ampk',     tier: 'A', href: '/library/compounds/berberine',     x: 523, y: 345, labelAnchor: 'start',  labelDx:  14 },
  { id: 'urolithin-a',   name: 'Urolithin A',     short: 'UA',     pathway: 'nad',      tier: 'A', href: '/library/compounds/urolithin-a',    x: 450, y: 418, labelAnchor: 'start',  labelDx:  14 },
  { id: 'fisetin',      name: 'Fisetin',         short: 'FIS',    pathway: 'senolytic',tier: 'B', href: '/library/compounds/fisetin',       x: 350, y: 445, labelAnchor: 'middle', labelDy:  20 },
  { id: 'spermidine',   name: 'Spermidine',      short: 'SPD',    pathway: 'ampk',     tier: 'B', href: '/library/compounds/spermidine',    x: 250, y: 418, labelAnchor: 'end',    labelDx: -14 },
  { id: 'pterostilbene',name: 'Pterostilbene',   short: 'PTS',    pathway: 'sirtuin',  tier: 'B', href: '/library/compounds/pterostilbene', x: 177, y: 345, labelAnchor: 'end',    labelDx: -14 },
  { id: 'omega3',       name: 'Omega-3',         short: 'ω-3',    pathway: 'nrf2',     tier: 'A', href: '/library/compounds/omega3',        x: 150, y: 245, labelAnchor: 'end',    labelDx: -14 },
  { id: 'sulforaphane', name: 'Sulforaphane',    short: 'SFN',    pathway: 'nrf2',     tier: 'A', href: '/library/compounds/sulforaphane',  x: 177, y: 145, labelAnchor: 'end',    labelDx: -14 },
  { id: 'rala',         name: 'R-ALA',           short: 'ALA',    pathway: 'nrf2',     tier: 'B', href: '/library/compounds/rala',          x: 250, y:  72, labelAnchor: 'end',    labelDx: -14 },
];

// ── Edge data ─────────────────────────────────────────────────────────────────
interface SynergyEdge {
  a: string;
  b: string;
  strength: 'strong' | 'moderate';
  /** Superseded by getEdgeExplanation(a, b) at render time — kept on the data
   *  so this array reads self-documenting, but the hover tooltip and fallback
   *  table both read through the shared resolver (lib/hero-network.ts) so
   *  this text can't silently drift from the canonical synergy-mechanism data. */
  note: string;
}

const EDGES: SynergyEdge[] = [
  // ── hub-to-hub ──
  { a: 'nmn',         b: 'resveratrol',   strength: 'strong',   note: 'SIRT1 dual activation — NAD⁺ substrate pairs with SIRT1 deacetylase for peak epigenetic remodeling' },
  // ── NMN spokes ──
  { a: 'nmn',         b: 'cakg',          strength: 'strong',   note: 'TCA cycle fuel (AKG) + NAD⁺ repletion — epigenetic reprogramming and mTOR suppression stack' },
  { a: 'nmn',         b: 'rala',          strength: 'strong',   note: 'R-ALA recycles NAD⁺ at Complex I — extends ETC electron transport efficiency upstream' },
  { a: 'nmn',         b: 'coq10',         strength: 'strong',   note: 'NAD⁺ feeds Complex I; CoQ10 shuttles electrons to Complex III — sequential ETC co-support' },
  { a: 'nmn',         b: 'urolithin-a',    strength: 'strong',   note: 'Urolithin A clears damaged mitochondria via mitophagy; NMN fuels the healthy survivors' },
  { a: 'nmn',         b: 'glynac',        strength: 'moderate', note: 'NAD⁺ + glutathione dual repletion — complementary redox defense at separate nodes' },
  { a: 'nmn',         b: 'taurine',       strength: 'moderate', note: 'Taurine membrane stabilization + NAD⁺ — additive mitochondrial membrane potential support' },
  { a: 'nmn',         b: 'spermidine',    strength: 'moderate', note: 'Spermidine autophagy (EP300 inhibition) + NMN SIRT1-mediated autophagic initiation — dual flux' },
  { a: 'nmn',         b: 'fisetin',       strength: 'moderate', note: 'NMN suppresses SASP via PARP/SIRT1 while fisetin eliminates the senescent cells generating it' },
  { a: 'nmn',         b: 'berberine',     strength: 'moderate', note: 'AMPK activation raises NAD⁺:NADH ratio, amplifying SIRT1 activity downstream' },
  { a: 'nmn',         b: 'pterostilbene', strength: 'moderate', note: 'Methylated RSV analogue with 4× bioavailability + NAD⁺ — enhanced SIRT1 substrate pairing' },
  // ── Resveratrol spokes ──
  { a: 'resveratrol', b: 'cakg',          strength: 'strong',   note: 'Ca-AKG TET dioxygenase demethylation + SIRT1 deacetylation — dual epigenetic reprogramming' },
  { a: 'resveratrol', b: 'pterostilbene', strength: 'strong',   note: 'Methylated resveratrol analogue — additive SIRT1 activity with superior plasma half-life' },
  { a: 'resveratrol', b: 'spermidine',    strength: 'moderate', note: 'Dual autophagy induction — SIRT1-FOXO3a axis + EP300 polyamine pathway convergence' },
  { a: 'resveratrol', b: 'fisetin',       strength: 'moderate', note: 'Complementary senescent cell biology — SASP cytokine suppression + flavonoid clearance' },
  { a: 'resveratrol', b: 'berberine',     strength: 'moderate', note: 'SIRT1 + AMPK dual longevity node activation — caloric restriction mimicry from both ends' },
  { a: 'resveratrol', b: 'omega3',        strength: 'moderate', note: 'SIRT1 + specialized pro-resolving mediator (SPM) axis — anti-inflammatory convergence' },
  // ── outer-ring connections ──
  { a: 'glynac',      b: 'sulforaphane',  strength: 'strong',   note: 'NRF2 Defense Triad core — GlyNAC supplies GSH precursors; sulforaphane transcribes 200+ cytoprotective genes' },
  { a: 'glynac',      b: 'rala',          strength: 'strong',   note: 'R-ALA recycles oxidized glutathione back to active GSH — completes the redox recycling cycle' },
  { a: 'sulforaphane',b: 'rala',          strength: 'moderate', note: 'Dual NRF2 activators via KEAP1 modification and redox signaling — additive ARE induction' },
  { a: 'sulforaphane',b: 'omega3',        strength: 'moderate', note: 'NRF2 upregulates resolvin-producing enzymes; omega-3 provides the SPM substrate — synergistic resolution' },
  { a: 'coq10',       b: 'rala',          strength: 'strong',   note: 'R-ALA regenerates ubiquinol from ubiquinone in vivo — extends active CoQ10 pool half-life' },
  { a: 'spermidine',  b: 'urolithin-a',    strength: 'moderate', note: 'Dual cellular autophagy — EP300 pathway (spermidine) + PINK1/Parkin mitophagy (UA) at separate targets' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function hex2rgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// Canonical evidence-tier colors — sourced from viz/tokens.ts's tierColor(),
// the same function EvidenceTag reads, so this can never disagree with it.
function getTierBadgeColor(tier: 'A' | 'B') {
  return tierColor(tier);
}

export function SynergyNetworkGraph() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const uid = useId().replace(/:/g, 's');
  const svgRef = useRef<SVGSVGElement>(null);

  // Mount guard so SSR and first client render match; the flag can only flip client-side.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true); }, []);

  const nodeMap = Object.fromEntries(NODES.map(n => [n.id, n]));

  const isEdgeHighlighted = (e: SynergyEdge) => {
    if (!hovered) return false;
    return e.a === hovered || e.b === hovered;
  };

  const isNodeHighlighted = (id: string) => {
    if (!hovered) return false;
    if (id === hovered) return true;
    return EDGES.some(e => (e.a === id && e.b === hovered) || (e.b === id && e.a === hovered));
  };

  const hoveredNode = hovered ? nodeMap[hovered] : null;
  const hoveredEdges = hovered ? EDGES.filter(e => e.a === hovered || e.b === hovered) : [];

  const NODE_R_INNER = 20;
  const NODE_R_OUTER = 14;

  return (
    <div className="relative w-full select-none">
      {/* Main SVG */}
      <svg
        ref={svgRef}
        viewBox="0 0 700 490"
        className="w-full"
        style={{ overflow: 'visible' }}
        aria-label="Compound synergy network — 14 evidence-graded compounds and their mechanistic connections"
        role="img"
      >
        <defs>
          {/* Glow filters per pathway */}
          {(Object.entries(PATHWAY_COLOR) as [Pathway, string][]).map(([pw, col]) => (
            <filter key={pw} id={`glow-${pw}-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feColorMatrix in="blur" type="matrix"
                values={`0 0 0 0 ${parseInt(col.slice(1,3),16)/255}  0 0 0 0 ${parseInt(col.slice(3,5),16)/255}  0 0 0 0 ${parseInt(col.slice(5,7),16)/255}  0 0 0 1 0`}
                result="colored"
              />
              <feMerge>
                <feMergeNode in="colored" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}
          {/* Pulse animation filter */}
          <filter id={`pulse-${uid}`} x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Edge gradient */}
          <linearGradient id={`edge-strong-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00e0ff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#c084fc" stopOpacity="0.6" />
          </linearGradient>
          {/* Radial center glow */}
          <radialGradient id={`center-glow-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Subtle center ambient glow */}
        <ellipse cx="350" cy="245" rx="120" ry="80" fill={`url(#center-glow-${uid})`} />

        {/* ── Edges ── */}
        {EDGES.map((edge) => {
          const a = nodeMap[edge.a];
          const b = nodeMap[edge.b];
          if (!a || !b) return null;
          const highlighted = isEdgeHighlighted(edge);
          const dimmed = hovered && !highlighted;
          const isStrong = edge.strength === 'strong';

          const aColor = PATHWAY_COLOR[a.pathway];


          return (
            <g key={`${edge.a}-${edge.b}`}>
              {/* Glow layer for highlighted edges */}
              {highlighted && (
                <line
                  x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke={aColor}
                  strokeWidth={isStrong ? 8 : 5}
                  strokeOpacity={0.25}
                  strokeLinecap="round"
                />
              )}
              {/* Main edge */}
              <line
                x1={a.x} y1={a.y}
                x2={b.x} y2={b.y}
                stroke={highlighted ? aColor : (isStrong ? '#4b5563' : '#374151')}
                strokeWidth={highlighted ? (isStrong ? 2.5 : 1.8) : (isStrong ? 1.2 : 0.7)}
                strokeOpacity={dimmed ? 0.06 : (highlighted ? 0.95 : (isStrong ? 0.35 : 0.2))}
                strokeLinecap="round"
                strokeDasharray={isStrong ? undefined : '4 3'}
                style={{ transition: 'stroke-opacity 0.2s, stroke-width 0.2s' }}
              />
            </g>
          );
        })}

        {/* ── Nodes ── */}
        {NODES.map((node) => {
          const col = PATHWAY_COLOR[node.pathway];
          const isHub = node.id === 'nmn' || node.id === 'resveratrol';
          const r = isHub ? NODE_R_INNER : NODE_R_OUTER;
          const highlighted = isNodeHighlighted(node.id);
          const dimmed = hovered && !highlighted;
          const isActive = hovered === node.id;

          const lx = node.x + (node.labelDx ?? 0);
          const labelBaseline = node.labelAnchor === 'middle'
            ? (node.labelDy && node.labelDy < 0 ? node.y + node.labelDy - 6 : node.y + (node.labelDy ?? 0) + 6)
            : node.y + 4;

          return (
            <g
              key={node.id}
              style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
              opacity={dimmed ? 0.18 : 1}
              onMouseEnter={() => setHovered(node.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Pulse ring for active node */}
              {isActive && mounted && (
                <>
                  <circle cx={node.x} cy={node.y} r={r + 10} fill="none" stroke={col} strokeWidth={1} strokeOpacity={0.4}
                    className="synergy-pulse-ring"
                    style={{ animation: 'pulse-ring 1.4s ease-out infinite' }} />
                  <circle cx={node.x} cy={node.y} r={r + 18} fill="none" stroke={col} strokeWidth={0.5} strokeOpacity={0.2}
                    className="synergy-pulse-ring"
                    style={{ animation: 'pulse-ring 1.4s ease-out infinite', animationDelay: '0.4s' }} />
                </>
              )}

              {/* Glow halo */}
              <circle
                cx={node.x} cy={node.y}
                r={r + (highlighted ? 8 : 4)}
                fill={hex2rgba(col, highlighted ? 0.18 : (isHub ? 0.12 : 0.07))}
                style={{ transition: 'r 0.2s, fill 0.2s' }}
              />

              {/* Node circle */}
              <circle
                cx={node.x} cy={node.y} r={r}
                fill={hex2rgba(col, isActive ? 0.28 : (highlighted ? 0.2 : (isHub ? 0.16 : 0.1)))}
                stroke={col}
                strokeWidth={isHub ? 2 : 1.5}
                strokeOpacity={highlighted ? 1 : (isHub ? 0.8 : 0.5)}
                filter={highlighted ? `url(#glow-${node.pathway}-${uid})` : undefined}
                style={{ transition: 'fill 0.2s, stroke-opacity 0.2s' }}
              />

              {/* Short name label inside node */}
              <text
                x={node.x} y={node.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={isHub ? 9 : 7.5}
                fontFamily="monospace"
                fontWeight="600"
                fill={col}
                fillOpacity={0.95}
                style={{ pointerEvents: 'none' }}
              >
                {node.short}
              </text>

              {/* Tier badge — top-right of node */}
              <circle cx={node.x + r * 0.72} cy={node.y - r * 0.72} r={5}
                fill="#0f172a" stroke={getTierBadgeColor(node.tier)} strokeWidth={1} />
              <text
                x={node.x + r * 0.72} y={node.y - r * 0.72}
                textAnchor="middle" dominantBaseline="central"
                fontSize={4.5} fontFamily="monospace" fontWeight="700"
                fill={getTierBadgeColor(node.tier)}
                style={{ pointerEvents: 'none' }}
              >
                {node.tier}
              </text>

              {/* Full name label outside node */}
              <text
                x={lx}
                y={labelBaseline}
                textAnchor={node.labelAnchor ?? 'middle'}
                dominantBaseline="central"
                fontSize={highlighted ? 9.5 : 8.5}
                fontFamily="system-ui, sans-serif"
                fontWeight={highlighted ? '700' : '500'}
                fill={highlighted ? col : '#94a3b8'}
                fillOpacity={highlighted ? 1 : (dimmed ? 0.3 : 0.75)}
                style={{ transition: 'fill 0.2s, font-size 0.1s, fill-opacity 0.2s', pointerEvents: 'none' }}
              >
                {node.name}
              </text>
            </g>
          );
        })}

        {/* Hub label indicators */}
        {!hovered && (
          <>
            <text x="350" y="228" textAnchor="middle" fontSize={7} fontFamily="monospace" fill="#a78bfa" fillOpacity={0.5} style={{ pointerEvents: 'none' }}>
              HUB NODES
            </text>
            <line x1="290" y1="234" x2="410" y2="234" stroke="#a78bfa" strokeWidth={0.5} strokeOpacity={0.3} strokeDasharray="2 2" />
          </>
        )}
      </svg>

      {/* ── Hover tooltip ── */}
      <div
        className="mt-4 min-h-[88px] transition-all duration-200"
        aria-live="polite"
        aria-atomic="true"
      >
        {hoveredNode ? (
          <div className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-4 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <span
                className="inline-block w-3 h-3 rounded-full shrink-0"
                style={{ background: PATHWAY_COLOR[hoveredNode.pathway] }}
              />
              <span className="font-bold text-sm text-foreground">{hoveredNode.name}</span>
              <span
                className="text-micro font-mono font-bold px-2 py-0.5 rounded-full border"
                style={{
                  color: PATHWAY_COLOR[hoveredNode.pathway],
                  borderColor: `${PATHWAY_COLOR[hoveredNode.pathway]}40`,
                  background: `${PATHWAY_COLOR[hoveredNode.pathway]}12`,
                }}
              >
                {PATHWAY_LABEL[hoveredNode.pathway]}
              </span>
              <span
                className="ml-auto text-micro font-mono font-bold px-2 py-0.5 rounded-full border"
                style={{ color: getTierBadgeColor(hoveredNode.tier), borderColor: `${getTierBadgeColor(hoveredNode.tier)}40`, background: `${getTierBadgeColor(hoveredNode.tier)}12` }}
              >
                Tier {hoveredNode.tier}
              </span>
              <Link
                href={hoveredNode.href}
                className="text-micro font-mono text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
              >
                Deep-dive <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
            {hoveredEdges.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-micro font-mono text-muted-foreground uppercase mb-2">
                  {hoveredEdges.length} synergy connection{hoveredEdges.length !== 1 ? 's' : ''}
                </p>
                {hoveredEdges.slice(0, 3).map(edge => {
                  const partner = nodeMap[edge.a === hoveredNode.id ? edge.b : edge.a];
                  return (
                    <div key={`${edge.a}-${edge.b}`} className="flex items-start gap-2">
                      <span
                        className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full"
                        style={{ background: PATHWAY_COLOR[partner.pathway] }}
                      />
                      <span className="text-xs text-muted-foreground">
                        <span className="font-semibold" style={{ color: PATHWAY_COLOR[partner.pathway] }}>
                          {partner.name}
                        </span>
                        {' · '}{getEdgeExplanation(edge.a, edge.b).text}
                      </span>
                    </div>
                  );
                })}
                {hoveredEdges.length > 3 && (
                  <p className="text-micro text-muted-foreground pl-3.5">+{hoveredEdges.length - 3} more connections</p>
                )}
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-xs text-muted-foreground">
            Hover any compound to see its synergy connections · Click to open library deep-dive
          </p>
        )}
      </div>

      {/* ── Legend ── */}
      <div className="flex flex-wrap justify-center gap-4 mt-5">
        {(Object.entries(PATHWAY_LABEL) as [Pathway, string][]).map(([pw, label]) => (
          <div key={pw} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: PATHWAY_COLOR[pw] }} />
            <span className="text-micro text-muted-foreground font-medium">{label}</span>
          </div>
        ))}
        <div className="flex items-center gap-3 border-l border-border pl-4">
          <div className="flex items-center gap-1.5">
            <span className="w-8 h-px bg-foreground/40" />
            <span className="text-micro text-muted-foreground">Strong synergy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-8 border-t border-dashed border-foreground/30" />
            <span className="text-micro text-muted-foreground">Moderate</span>
          </div>
        </div>
      </div>

      {/* ── Always-visible fallback table ──
          The graph above only surfaces edge data on hover — this table gives
          the same data to anyone who doesn't want the interaction (or can't
          use it), matching ConnectionMatrix.tsx's established idiom. */}
      <div className="mt-6 scroll-region rounded-2xl border border-border/70 bg-card/30">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">
            All {EDGES.length} synergy connections in this network, with strength and mechanism.
          </caption>
          <thead>
            <tr className="border-b border-border/60">
              <th scope="col" className="px-3 py-2 text-label text-muted-foreground">Compound A</th>
              <th scope="col" className="px-3 py-2 text-label text-muted-foreground">Compound B</th>
              <th scope="col" className="px-3 py-2 text-label text-muted-foreground">Strength</th>
              <th scope="col" className="px-3 py-2 text-label text-muted-foreground">Mechanism</th>
            </tr>
          </thead>
          <tbody>
            {EDGES.map((e) => (
              <tr key={`${e.a}-${e.b}`} className="border-t border-border/50">
                <td className="px-3 py-2 text-body-sm">{nodeMap[e.a]?.name ?? e.a}</td>
                <td className="px-3 py-2 text-body-sm">{nodeMap[e.b]?.name ?? e.b}</td>
                <td className="px-3 py-2 text-caption capitalize text-muted-foreground">{e.strength}</td>
                <td className="px-3 py-2 text-body-sm text-muted-foreground">{getEdgeExplanation(e.a, e.b).text}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        /* The infinite node pulse ran unconditionally. The global
           prefers-reduced-motion block in globals.css can't reach these rings
           (their animation is set inline, which wins on specificity), so the
           guard has to live beside the keyframes. */
        @media (prefers-reduced-motion: reduce) {
          .synergy-pulse-ring { animation: none !important; opacity: 0.35; }
        }
      `}</style>
    </div>
  );
}
