import { compounds } from '../data';
import { stackInteractions, type StackInteraction } from '../stack-analysis';
import type { NetworkEdge, NetworkEdgeType, NetworkNode, StackNetworkGraph } from './types';

function edgeTypeFromInteraction(type: StackInteraction['type']): NetworkEdgeType {
  if (type === 'synergy') return 'synergy';
  if (type === 'contraindication') return 'contraindication';
  return 'caution';
}

/** Circular layout — deterministic, no physics engine required */
function layoutNodes(selectedIds: string[]): NetworkNode[] {
  const n = compounds.length;
  const cx = 200;
  const cy = 200;
  const radius = 150;

  return compounds.map((c, i) => {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    return {
      id: c.id,
      label: c.name,
      shortLabel: c.name.split(' ')[0],
      pathway: c.pathway,
      evidence: c.evidence,
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
      selected: selectedIds.includes(c.id),
      bioavailability: c.bioavailability,
    };
  });
}

function buildPotentialEdges(selectedIds: string[]): NetworkEdge[] {
  const edges: NetworkEdge[] = [];
  const seen = new Set<string>();

  compounds.forEach((c) => {
    c.synergies.forEach((targetId) => {
      const key = [c.id, targetId].sort().join('-');
      if (seen.has(key)) return;
      seen.add(key);

      const hasDbInteraction = stackInteractions.some(
        (i) =>
          (i.compoundIds[0] === c.id && i.compoundIds[1] === targetId) ||
          (i.compoundIds[0] === targetId && i.compoundIds[1] === c.id),
      );
      if (hasDbInteraction) return;

      const target = compounds.find((x) => x.id === targetId);
      if (!target) return;

      edges.push({
        id: `potential-${key}`,
        source: c.id,
        target: targetId,
        type: 'potential',
        label: `${c.name} ↔ ${target.name}`,
        detail: 'Documented compound-level synergy — activate both to confirm pair score',
        severity: 'low',
        active: selectedIds.includes(c.id) && selectedIds.includes(targetId),
      });
    });
  });

  return edges;
}

export function buildStackNetwork(selectedIds: string[]): StackNetworkGraph {
  const nodes = layoutNodes(selectedIds);

  const dbEdges: NetworkEdge[] = stackInteractions.map((i, idx) => ({
    id: `db-${idx}`,
    source: i.compoundIds[0],
    target: i.compoundIds[1],
    type: edgeTypeFromInteraction(i.type),
    label: i.title,
    detail: i.detail,
    severity: i.severity,
    active: selectedIds.includes(i.compoundIds[0]) && selectedIds.includes(i.compoundIds[1]),
  }));

  const potentialEdges = buildPotentialEdges(selectedIds);
  const edges = [...dbEdges, ...potentialEdges];

  const synergyCount = edges.filter((e) => e.type === 'synergy' || e.type === 'potential').length;
  const cautionCount = edges.filter((e) => e.type === 'caution').length;
  const contraindicationCount = edges.filter((e) => e.type === 'contraindication').length;
  const activeSynergyCount = edges.filter(
    (e) => e.active && (e.type === 'synergy' || e.type === 'potential'),
  ).length;
  const activeConflictCount = edges.filter(
    (e) => e.active && (e.type === 'caution' || e.type === 'contraindication'),
  ).length;

  const maxEdges = (compounds.length * (compounds.length - 1)) / 2;

  return {
    nodes,
    edges,
    stats: {
      synergyCount,
      cautionCount,
      contraindicationCount,
      activeSynergyCount,
      activeConflictCount,
      networkDensity: Math.round((edges.length / maxEdges) * 100) / 100,
    },
  };
}

export function filterNetworkGraph(
  graph: StackNetworkGraph,
  filter: 'all' | 'active' | 'conflicts',
): StackNetworkGraph {
  if (filter === 'all') return graph;

  const edges =
    filter === 'active'
      ? graph.edges.filter((e) => e.active)
      : graph.edges.filter(
          (e) => e.active && (e.type === 'caution' || e.type === 'contraindication'),
        );

  const nodeIds = new Set<string>();
  edges.forEach((e) => {
    nodeIds.add(e.source);
    nodeIds.add(e.target);
  });

  if (filter === 'active') {
    graph.nodes.forEach((n) => {
      if (n.selected) nodeIds.add(n.id);
    });
  }

  return {
    ...graph,
    nodes: graph.nodes.filter((n) => nodeIds.has(n.id) || (filter === 'active' && n.selected)),
    edges,
  };
}

export const edgeColors: Record<NetworkEdgeType, string> = {
  synergy: 'var(--accent-emerald)',
  potential: 'var(--accent-cyan)',
  caution: 'var(--accent-amber)',
  contraindication: 'var(--accent-rose)',
};