import { compounds, hallmarks } from '@/lib/data';
import { pathwayGroups } from '@/lib/relations';
import { hallmarkDisplayNames } from '@/lib/stack-analysis';
import type { EvidenceTier } from '@/lib/types';

/**
 * Data + deterministic layout for the homepage hero's Pathway Flow visual
 * (components/home/HeroPathwayScene.tsx and its SVG poster fallback).
 *
 * The substance of TNiC is mechanism: a compound you take → the molecule it
 * moves → the hallmark of aging it acts on. That is a directed flow, so it is
 * drawn as one — three columns, left to right, no rotation.
 *
 * Everything here is derived from the real catalog (`pathwayGroups`,
 * `compounds`, `hallmarks`) so the visual can't drift from the data. The only
 * authored choices are curation: which pathways to show and which single
 * signature molecule anchors each — and even those are indices into each
 * group's own `keyMolecules`, not invented copy.
 */

export type PathwayColorKey = 'cyan' | 'emerald' | 'violet' | 'amber' | 'rose';

const ACCENT_TO_HEX: Record<string, string> = {
  cyan: '#00e0ff',
  emerald: '#34d399',
  violet: '#c084fc',
  amber: '#fbbf24',
  rose: '#f472b6',
};

/**
 * The curated pathways, top-to-bottom. Five distinct axes with distinct
 * colors that between them touch nearly every compound and hallmark. Each
 * names one signature molecule (an index into that group's keyMolecules) as
 * the hub every compound feeds and every hallmark flows out of.
 */
interface Curation {
  id: string;
  moleculeIndex: number;
  /** Optional prettier rendering of the molecule string (e.g. NAD+ → NAD⁺). */
  moleculeLabel?: string;
}

const CURATED: Curation[] = [
  { id: 'nrf2', moleculeIndex: 0 }, // NRF2
  { id: 'nad-sirtuin', moleculeIndex: 0, moleculeLabel: 'NAD⁺' }, // NAD+
  { id: 'mtor-ampk', moleculeIndex: 1 }, // AMPK
  { id: 'sasp-inflammation', moleculeIndex: 2 }, // NF-κB
  { id: 'gut-immune', moleculeIndex: 1 }, // SCFA
];

export interface FlowPathway {
  id: string;
  name: string;
  color: string;
  molecule: string;
  compoundIds: string[];
  hallmarkIds: string[];
  synergy: string;
}

export const FLOW_PATHWAYS: FlowPathway[] = CURATED.map((c) => {
  const group = pathwayGroups.find((g) => g.id === c.id);
  if (!group) throw new Error(`hero-pathways: unknown pathway ${c.id}`);
  return {
    id: group.id,
    name: group.name,
    color: ACCENT_TO_HEX[group.accent] ?? '#94a3b8',
    molecule: c.moleculeLabel ?? group.keyMolecules[c.moleculeIndex] ?? group.keyMolecules[0],
    compoundIds: group.compoundIds,
    hallmarkIds: group.hallmarkIds,
    synergy: group.synergy,
  };
});

// ── Labels, derived from the catalog ──

const HALLMARK_SHORT: Record<string, string> = { ...hallmarkDisplayNames, dysbiosis: 'Dysbiosis' };

export function compoundName(id: string): string {
  return compounds.find((c) => c.id === id)?.name ?? id;
}

export function compoundTier(id: string): EvidenceTier | undefined {
  return compounds.find((c) => c.id === id)?.evidence;
}

export function hallmarkLabel(id: string): string {
  return HALLMARK_SHORT[id] ?? hallmarks.find((h) => h.id === id)?.title ?? id;
}

export function hallmarkTitle(id: string): string {
  return hallmarks.find((h) => h.id === id)?.title ?? hallmarkLabel(id);
}

export function hallmarkDesc(id: string): string {
  return hallmarks.find((h) => h.id === id)?.desc ?? '';
}

// ── Node + edge model ──

export type FlowNodeKind = 'compound' | 'molecule' | 'hallmark';

export interface FlowNode {
  id: string;
  kind: FlowNodeKind;
  label: string;
  /** Present on molecule hubs. */
  pathwayId?: string;
  color: string;
  position: [number, number, number];
}

export interface FlowEdge {
  id: string;
  from: string;
  to: string;
  pathwayId: string;
  color: string;
}

// Unique compounds and hallmarks in pathway order (first pathway a node
// appears in fixes its column position), so same-color flows stay neighbours
// and the diagram reads in bands instead of a cross-hatch.
function orderedUnique(lists: string[][]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const list of lists) {
    for (const id of list) {
      if (!seen.has(id)) {
        seen.add(id);
        out.push(id);
      }
    }
  }
  return out;
}

const COMPOUND_ORDER = orderedUnique(FLOW_PATHWAYS.map((p) => p.compoundIds));
const HALLMARK_ORDER = orderedUnique(FLOW_PATHWAYS.map((p) => p.hallmarkIds));

// Column geometry. Compounds sit nearest the camera (+z), hallmarks furthest
// (−z): the depth is what earns the "3D", since the scene never rotates.
const COMPOUND_X = -4.0;
const MOLECULE_X = 0;
const HALLMARK_X = 4.0;
const COMPOUND_Z = 1.1;
const MOLECULE_Z = 0;
const HALLMARK_Z = -1.1;

function spreadY(count: number, half: number): number[] {
  if (count <= 1) return [0];
  return Array.from({ length: count }, (_, i) => half - (i / (count - 1)) * half * 2);
}

// Muted, not near-white: bright white endpoints bloom into big discs that
// swallow their own labels and out-shout the vivid molecule hubs. Kept dim
// and tinted so the hubs and flowing ribbons stay the focal point.
const COMPOUND_COLOR = '#8ea6cc';
const HALLMARK_COLOR = '#c2a077';

function primaryColor(id: string, key: 'compoundIds' | 'hallmarkIds'): string {
  const p = FLOW_PATHWAYS.find((pw) => pw[key].includes(id));
  return p?.color ?? '#94a3b8';
}

function buildNodes(): FlowNode[] {
  const nodes: FlowNode[] = [];

  const compoundYs = spreadY(COMPOUND_ORDER.length, 3.05);
  COMPOUND_ORDER.forEach((id, i) => {
    nodes.push({
      id: `cmp:${id}`,
      kind: 'compound',
      label: compoundName(id),
      color: COMPOUND_COLOR,
      position: [COMPOUND_X, compoundYs[i], COMPOUND_Z],
    });
  });

  const molYs = spreadY(FLOW_PATHWAYS.length, 2.35);
  FLOW_PATHWAYS.forEach((p, i) => {
    nodes.push({
      id: `mol:${p.id}`,
      kind: 'molecule',
      label: p.molecule,
      pathwayId: p.id,
      color: p.color,
      position: [MOLECULE_X, molYs[i], MOLECULE_Z],
    });
  });

  const hallYs = spreadY(HALLMARK_ORDER.length, 3.05);
  HALLMARK_ORDER.forEach((id, i) => {
    nodes.push({
      id: `hlm:${id}`,
      kind: 'hallmark',
      label: hallmarkLabel(id),
      color: HALLMARK_COLOR,
      position: [HALLMARK_X, hallYs[i], HALLMARK_Z],
    });
  });

  // Faint tint toward each endpoint's primary pathway, so a column isn't a
  // row of identical dots — enough to hint the banding, not enough to fight
  // the vivid hubs.
  return nodes.map((n) => {
    if (n.kind === 'compound') return { ...n, color: mix(COMPOUND_COLOR, primaryColor(n.id.slice(4), 'compoundIds'), 0.25) };
    if (n.kind === 'hallmark') return { ...n, color: mix(HALLMARK_COLOR, primaryColor(n.id.slice(4), 'hallmarkIds'), 0.25) };
    return n;
  });
}

function mix(a: string, b: string, t: number): string {
  const pa = hexToRgb(a);
  const pb = hexToRgb(b);
  const r = Math.round(pa[0] + (pb[0] - pa[0]) * t);
  const g = Math.round(pa[1] + (pb[1] - pa[1]) * t);
  const bl = Math.round(pa[2] + (pb[2] - pa[2]) * t);
  return `#${[r, g, bl].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function buildEdges(): FlowEdge[] {
  const edges: FlowEdge[] = [];
  for (const p of FLOW_PATHWAYS) {
    const hub = `mol:${p.id}`;
    for (const c of p.compoundIds) {
      edges.push({ id: `${p.id}:cmp:${c}`, from: `cmp:${c}`, to: hub, pathwayId: p.id, color: p.color });
    }
    for (const h of p.hallmarkIds) {
      edges.push({ id: `${p.id}:hlm:${h}`, from: hub, to: `hlm:${h}`, pathwayId: p.id, color: p.color });
    }
  }
  return edges;
}

export const FLOW_NODES: FlowNode[] = buildNodes();
export const FLOW_EDGES: FlowEdge[] = buildEdges();

export const FLOW_NODE_BY_ID: Map<string, FlowNode> = new Map(FLOW_NODES.map((n) => [n.id, n]));

// ── Selection → which pathways / nodes / edges light up ──

export interface FlowHighlight {
  pathwayIds: Set<string>;
  nodeIds: Set<string>;
  edgeIds: Set<string>;
}

/**
 * A selection lights up the *whole* pathway (or pathways) it belongs to —
 * every compound, molecule and hallmark on that axis — so the flow reads end
 * to end. The info panel narrows back down to the selected node's specifics.
 */
export function getHighlight(selectedId: string | null): FlowHighlight {
  const pathwayIds = new Set<string>();
  if (selectedId) {
    const node = FLOW_NODE_BY_ID.get(selectedId);
    if (node?.kind === 'molecule' && node.pathwayId) {
      pathwayIds.add(node.pathwayId);
    } else if (node?.kind === 'compound') {
      const cid = selectedId.slice(4);
      FLOW_PATHWAYS.forEach((p) => p.compoundIds.includes(cid) && pathwayIds.add(p.id));
    } else if (node?.kind === 'hallmark') {
      const hid = selectedId.slice(4);
      FLOW_PATHWAYS.forEach((p) => p.hallmarkIds.includes(hid) && pathwayIds.add(p.id));
    }
  }
  const edgeIds = new Set<string>();
  const nodeIds = new Set<string>();
  for (const e of FLOW_EDGES) {
    if (pathwayIds.has(e.pathwayId)) {
      edgeIds.add(e.id);
      nodeIds.add(e.from);
      nodeIds.add(e.to);
    }
  }
  return { pathwayIds, nodeIds, edgeIds };
}

// ── 2D poster projection (the mobile / reduced-motion / no-WebGL fallback) ──

export interface PosterNode {
  id: string;
  kind: FlowNodeKind;
  label: string;
  x: number;
  y: number;
  color: string;
}

export interface PosterEdge {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
}

const POSTER_MIN_X = -4.4;
const POSTER_MAX_X = 4.4;
const POSTER_MIN_Y = -3.3;
const POSTER_MAX_Y = 3.3;

/**
 * The same three-column flow the 3D scene draws, flattened to SVG. Derived
 * from FLOW_NODES/FLOW_EDGES so the fallback can never disagree with the live
 * version — everyone who can't run WebGL still sees the real pathway map.
 */
export function buildPathwayPoster2D(
  width: number,
  height: number,
  pad = 96,
): { nodes: PosterNode[]; edges: PosterEdge[] } {
  const mapX = (x: number) => pad + ((x - POSTER_MIN_X) / (POSTER_MAX_X - POSTER_MIN_X)) * (width - 2 * pad);
  const mapY = (y: number) => pad + ((POSTER_MAX_Y - y) / (POSTER_MAX_Y - POSTER_MIN_Y)) * (height - 2 * pad);

  const nodes: PosterNode[] = FLOW_NODES.map((n) => ({
    id: n.id,
    kind: n.kind,
    label: n.label,
    x: mapX(n.position[0]),
    y: mapY(n.position[1]),
    color: n.color,
  }));
  const pos = new Map(nodes.map((n) => [n.id, n]));

  const edges: PosterEdge[] = FLOW_EDGES.map((e) => {
    const a = pos.get(e.from)!;
    const b = pos.get(e.to)!;
    return { id: e.id, x1: a.x, y1: a.y, x2: b.x, y2: b.y, color: e.color };
  });

  return { nodes, edges };
}

/** The pathways a given compound or hallmark node participates in. */
export function pathwaysForNode(selectedId: string): FlowPathway[] {
  const node = FLOW_NODE_BY_ID.get(selectedId);
  if (!node) return [];
  if (node.kind === 'molecule') return FLOW_PATHWAYS.filter((p) => p.id === node.pathwayId);
  const raw = selectedId.slice(4);
  const key = node.kind === 'compound' ? 'compoundIds' : 'hallmarkIds';
  return FLOW_PATHWAYS.filter((p) => p[key].includes(raw));
}
