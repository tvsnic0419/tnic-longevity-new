import { compounds } from '@/lib/data';
import type { Compound, EvidenceTier } from '@/lib/types';
import { emergentEffects } from '@/lib/relations';
import { stackInteractions, hallmarkDisplayNames } from '@/lib/stack-analysis';

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

export const HERO_NETWORK_TIER_LABEL: Record<EvidenceTier, string> = {
  A: 'Tier A — strong evidence',
  B: 'Tier B — moderate evidence',
  C: 'Tier C — early evidence',
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

// ── Click-to-explore data: partner lookup + real per-pair "why" text ──
//
// Backs the interactive hero widget's info panel (HeroInfoPanel.tsx). Every
// function here is derived from the same live compound/relations/stack-
// analysis data used elsewhere on the site — no copy is authored specifically
// for this widget, so it can't drift out of sync with the rest of TNiC.

const HERO_NETWORK_PARTNERS: Map<string, string[]> = (() => {
  const map = new Map<string, string[]>();
  for (const e of HERO_NETWORK_EDGES) {
    map.set(e.a, [...(map.get(e.a) ?? []), e.b]);
    map.set(e.b, [...(map.get(e.b) ?? []), e.a]);
  }
  return map;
})();

/** Ids of compounds directly connected to `id` in the synergy network. */
export function getPartnerIds(id: string): string[] {
  return HERO_NETWORK_PARTNERS.get(id) ?? [];
}

/** Full compound record for a network node — the node itself only carries id/name/tier/degree. */
export function getHeroCompound(id: string): Compound | undefined {
  return compounds.find((c) => c.id === id);
}

export interface HeroEdgeExplanation {
  text: string;
  source: 'emergent' | 'synergy-link' | 'derived';
}

/**
 * Real "why" text for a synergy edge, in order of specificity: an authored
 * emergent-effect writeup, then an authored stack-interaction note, then a
 * fallback derived from the two compounds' own data (shared hallmarks or
 * pathway). Never invents a mechanism that isn't backed by existing data.
 */
export function getEdgeExplanation(aId: string, bId: string): HeroEdgeExplanation {
  const emergentMatches = emergentEffects.filter(
    (e) => e.compoundIds.includes(aId) && e.compoundIds.includes(bId),
  );
  if (emergentMatches.length > 0) {
    const best = emergentMatches.reduce((a, b) => (b.synergyMultiplier > a.synergyMultiplier ? b : a));
    return { text: best.mechanism, source: 'emergent' };
  }

  const linkMatch = stackInteractions.find(
    (i) =>
      i.type === 'synergy' &&
      ((i.compoundIds[0] === aId && i.compoundIds[1] === bId) ||
        (i.compoundIds[0] === bId && i.compoundIds[1] === aId)),
  );
  if (linkMatch) {
    return { text: linkMatch.detail, source: 'synergy-link' };
  }

  const a = getHeroCompound(aId);
  const b = getHeroCompound(bId);
  if (a && b) {
    const sharedHallmarks = a.hallmarks.filter((h) => b.hallmarks.includes(h)).slice(0, 2);
    if (sharedHallmarks.length > 0) {
      const labels = sharedHallmarks.map((h) => hallmarkDisplayNames[h] ?? h).join(' and ');
      return {
        text: `${a.name} and ${b.name} both act on the ${labels} hallmark${sharedHallmarks.length > 1 ? 's' : ''} of aging.`,
        source: 'derived',
      };
    }
    if (a.pathway && a.pathway === b.pathway) {
      return { text: `${a.name} and ${b.name} both act via ${a.pathway}.`, source: 'derived' };
    }
    return {
      text: `${a.name} is listed as a complementary pairing with ${b.name} in the compound library.`,
      source: 'derived',
    };
  }

  return { text: 'Listed as a complementary pairing in the compound library.', source: 'derived' };
}
