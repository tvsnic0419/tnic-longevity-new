import { compounds } from '@/lib/data';
import type { EvidenceTier } from '@/lib/types';

/**
 * Shared node/edge/layout data for the homepage hero's 3D visual and its SVG
 * poster fallback (components/home/HeroScene3D.tsx, HeroScenePoster.tsx).
 * Derived live from the real compound catalog so the hero visual can never
 * drift into showing a synergy network that doesn't match the actual data —
 * same principle as HomeEvidence.tsx's stat counts.
 */

export interface HeroNetworkNode {
  id: string;
  name: string;
  tier: EvidenceTier;
  /** Number of synergy connections — drives node size/prominence. */
  degree: number;
}

export interface HeroNetworkEdge {
  a: string;
  b: string;
}

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
      const key = [c.id, otherId].sort().join('::');
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push({ a: c.id, b: otherId });
    }
  }
  return edges;
}

export const HERO_NETWORK_EDGES: HeroNetworkEdge[] = buildEdges();

export const HERO_NETWORK_NODES: HeroNetworkNode[] = compounds.map((c) => ({
  id: c.id,
  name: c.name,
  tier: c.evidence,
  degree: HERO_NETWORK_EDGES.filter((e) => e.a === c.id || e.b === c.id).length,
}));

export const HERO_NETWORK_TIER_COLOR: Record<EvidenceTier, string> = {
  A: '#34d399',
  B: '#fbbf24',
  C: '#94a3b8',
};

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

// Math.cos/Math.sin aren't required by spec to be correctly-rounded, so the
// same angle can produce a value that differs by ~1 ULP between the server's
// V8 build and the browser's — enough for React to flag a hydration mismatch
// on these SVG coordinates even though the drawing is visually identical.
// Rounding to hundredths (far finer than perceptible on a 700x490 poster)
// collapses both sides to the same value.
function round2(n: number): number {
  return Math.round(n * 100) / 100;
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
    return { ...n, x: round2(cx + Math.cos(angle) * hubRadius), y: round2(cy + Math.sin(angle) * hubRadius) };
  });

  const outerPositions: HeroNetworkNode2D[] = outer.map((n, i) => {
    const angle = (i / outer.length) * Math.PI * 2 - Math.PI / 2;
    return {
      ...n,
      x: round2(cx + Math.cos(angle) * outerRadius),
      y: round2(cy + Math.sin(angle) * outerRadius),
    };
  });

  return [...hubPositions, ...outerPositions];
}
