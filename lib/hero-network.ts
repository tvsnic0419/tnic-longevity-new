import { compounds } from '@/lib/data';
import { eliteInterventions } from '@/lib/elite-interventions';
import type { EvidenceTier } from '@/lib/types';

/**
 * Shared node/edge/layout data for the homepage hero's 3D visual and its SVG
 * poster fallback (components/home/HeroScene3D.tsx, HeroScenePoster.tsx).
 * Derived live from the real compound catalog so the hero visual can never
 * drift into showing a synergy network that doesn't match the actual data —
 * same principle as HomeEvidence.tsx's stat counts.
 *
 * The network states the site's thesis literally — *nothing works alone*: it
 * carries the real synergy edges (compounds that reinforce each other) AND the
 * real clash edges (redundant/competing pairs, from the antagonist tables in
 * the compound modules), and it marks the TNiC elite picks so the buildable
 * product is legible inside the web of interactions.
 */

export type HeroEdgeKind = 'synergy' | 'clash';

export interface HeroNetworkNode {
  id: string;
  name: string;
  tier: EvidenceTier;
  /** Number of connections (synergy + clash) — drives node size/prominence. */
  degree: number;
  /** A TNiC elite pick — the buildable product, marked distinctly. */
  elite: boolean;
}

export interface HeroNetworkEdge {
  a: string;
  b: string;
  kind: HeroEdgeKind;
}

// Real antagonist/redundancy pairs documented in the compound modules — the
// "clashes" that make the graphic honest. Only pairs where both compounds are
// in the stack-buildable catalog appear as edges; the rest (e.g. NMN↔NR,
// berberine↔metformin) involve library-only compounds with no catalog node.
const CLASH_PAIRS: ReadonlyArray<readonly [string, string]> = [
  ['quercetin', 'fisetin'], // redundant flavonoid senolytics
  ['nac', 'glynac'], // NAC is already GlyNAC's cysteine leg — redundant
  ['resveratrol', 'pterostilbene'], // same SIRT1 stilbene target — redundant
];

const eliteIds = new Set(eliteInterventions.map((e) => e.compoundId));
const pairKey = (a: string, b: string) => [a, b].sort().join('::');
const CLASH_KEYS = new Set(CLASH_PAIRS.map(([a, b]) => pairKey(a, b)));

function buildEdges(): HeroNetworkEdge[] {
  const ids = new Set(compounds.map((c) => c.id));
  const seen = new Set<string>();
  const edges: HeroNetworkEdge[] = [];
  for (const c of compounds) {
    for (const otherId of c.synergies) {
      // compounds[].synergies is directional (A can list B without B listing
      // A back) — union both directions into one undirected edge set rather
      // than requiring agreement from both sides.
      if (!ids.has(otherId)) continue;
      const key = pairKey(c.id, otherId);
      if (seen.has(key)) continue;
      seen.add(key);
      // A pair the modules classify as redundant/competing is a clash, not a
      // synergy — reclassified below so it's drawn (and coloured) as one.
      if (CLASH_KEYS.has(key)) continue;
      edges.push({ a: c.id, b: otherId, kind: 'synergy' });
    }
  }
  for (const [a, b] of CLASH_PAIRS) {
    if (ids.has(a) && ids.has(b)) edges.push({ a, b, kind: 'clash' });
  }
  return edges;
}

export const HERO_NETWORK_EDGES: HeroNetworkEdge[] = buildEdges();

export const HERO_NETWORK_NODES: HeroNetworkNode[] = compounds.map((c) => ({
  id: c.id,
  name: c.name,
  tier: c.evidence,
  degree: HERO_NETWORK_EDGES.filter((e) => e.a === c.id || e.b === c.id).length,
  elite: eliteIds.has(c.id),
}));

export const HERO_NETWORK_TIER_COLOR: Record<EvidenceTier, string> = {
  A: '#34d399',
  B: '#fbbf24',
  C: '#94a3b8',
};

/** Edge colour by kind — cool cyan for synergies, warm amber for clashes. */
export const HERO_NETWORK_EDGE_COLOR: Record<HeroEdgeKind, string> = {
  synergy: '#22d3ee',
  clash: '#f0a24a',
};

/** Gold used to mark the elite-pick nodes (the buildable product). */
export const HERO_NETWORK_ELITE_COLOR = '#f0c46a';

// ── 3D layout — deterministic Fibonacci sphere, computed once at module init ──

export interface HeroNetworkNode3D extends HeroNetworkNode {
  position: [number, number, number];
}

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

function fibonacciSphere(count: number, radius: number): [number, number, number][] {
  if (count <= 1) return count === 1 ? [[0, 0, radius]] : [];
  const points: [number, number, number][] = [];
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const ringRadius = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = GOLDEN_ANGLE * i;
    points.push([Math.cos(theta) * ringRadius * radius, y * radius, Math.sin(theta) * ringRadius * radius]);
  }
  return points;
}

export const HERO_NETWORK_NODES_3D: HeroNetworkNode3D[] = (() => {
  const positions = fibonacciSphere(HERO_NETWORK_NODES.length, 2.3);
  return HERO_NETWORK_NODES.map((n, i) => ({ ...n, position: positions[i] }));
})();

// ── 2D layout — hub-and-outer-ring, for the SVG poster fallback ──

export interface HeroNetworkNode2D extends HeroNetworkNode {
  x: number;
  y: number;
}

// Transcendental functions (Math.cos/sin) aren't guaranteed bit-identical
// across JS engines/architectures — Node's SSR process and the browser's
// hydration pass can disagree at the ULP level, which React then reports as
// a hydration mismatch on the serialized attribute string even though the
// values are visually identical. Rounding closes that gap; matches the same
// defensive .toFixed() already used for this exact reason in
// HallmarksConstellation.tsx's node-position math.
function round4(n: number): number {
  return Math.round(n * 10000) / 10000;
}

export function buildHeroNetworkPoster2D(width: number, height: number): HeroNetworkNode2D[] {
  const cx = width / 2;
  const cy = height / 2;
  const sorted = [...HERO_NETWORK_NODES].sort((a, b) => b.degree - a.degree);
  const hubCount = Math.min(2, sorted.length);
  const hubs = sorted.slice(0, hubCount);
  const outer = sorted.slice(hubCount);

  const hubRadius = 58;
  const outerRadius = Math.min(width, height) / 2 - 48;

  const hubPositions: HeroNetworkNode2D[] = hubs.map((n, i) => {
    const angle = hubCount === 1 ? 0 : Math.PI * i;
    return { ...n, x: round4(cx + Math.cos(angle) * hubRadius), y: round4(cy + Math.sin(angle) * hubRadius) };
  });

  const outerPositions: HeroNetworkNode2D[] = outer.map((n, i) => {
    const angle = (i / outer.length) * Math.PI * 2 - Math.PI / 2;
    return { ...n, x: round4(cx + Math.cos(angle) * outerRadius), y: round4(cy + Math.sin(angle) * outerRadius) };
  });

  return [...hubPositions, ...outerPositions];
}
