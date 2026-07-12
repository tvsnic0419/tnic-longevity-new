import { hallmarkLibrary } from './hallmarks-library';
import { getCompoundsForHallmark } from './library-graph';
import type { EvidenceTier } from './types';

/**
 * Data layer for the Knowledge Graph explorer (`/library/explorer`) — the
 * flagship "legible system" page. Renders the hallmark ↔ compound graph
 * (the clearest, fully bidirectional relationship in the interlink graph)
 * as a set of nodes + edges for a client-side visualization.
 *
 * Reuses `getCompoundsForHallmark` (already tested for graph integrity in
 * `library-graph.test.ts`) as the single source of truth, so the explorer can
 * never show an edge the rest of the site doesn't also expose.
 */
export interface GraphHallmarkNode {
  type: 'hallmark';
  id: string;
  slug: string;
  title: string;
  number: number;
}

export interface GraphCompoundNode {
  type: 'compound';
  slug: string;
  name: string;
  evidence: EvidenceTier;
}

export interface GraphEdge {
  hallmarkId: string;
  compoundSlug: string;
}

export interface KnowledgeGraphData {
  hallmarks: GraphHallmarkNode[];
  compounds: GraphCompoundNode[];
  edges: GraphEdge[];
}

export function getKnowledgeGraphData(): KnowledgeGraphData {
  const hallmarks: GraphHallmarkNode[] = hallmarkLibrary
    .slice()
    .sort((a, b) => a.number - b.number)
    .map((h) => ({ type: 'hallmark', id: h.id, slug: h.slug, title: h.title, number: h.number }));

  const compoundBySlug = new Map<string, GraphCompoundNode>();
  const edges: GraphEdge[] = [];

  for (const h of hallmarks) {
    for (const c of getCompoundsForHallmark(h.id)) {
      compoundBySlug.set(c.slug, { type: 'compound', slug: c.slug, name: c.name, evidence: c.evidence });
      edges.push({ hallmarkId: h.id, compoundSlug: c.slug });
    }
  }

  const compounds = [...compoundBySlug.values()].sort(
    (a, b) => a.evidence.localeCompare(b.evidence) || a.name.localeCompare(b.name),
  );

  return { hallmarks, compounds, edges };
}
