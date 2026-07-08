'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Network, AlertTriangle, Sparkles, ShieldAlert } from 'lucide-react';
import { useStack } from '@/context/PlatformContext';
import { useToolsStore } from '@/stores/toolsStore';
import { buildStackNetwork, filterNetworkGraph } from '@/lib/tools/stack-network';
import { CompoundSelectorGrid } from '@/components/stacks/CompoundSelectorGrid';
import { StackPresetsBar } from '@/components/stacks/StackPresetsBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { TabBar } from '@/components/ui/TabBar';
import { StackNetworkGraph } from './StackNetworkGraph';
import { ToolDisclaimer } from './ToolDisclaimer';

const filterTabs = [
  { id: 'all' as const, label: 'Full network' },
  { id: 'active' as const, label: 'Active stack' },
  { id: 'conflicts' as const, label: 'Conflicts only' },
];

export function StackNetworkTool() {
  const { selected, toggle, applyPreset } = useStack();
  const { networkFilter, networkHighlightNode, setNetworkFilter, setNetworkHighlightNode } =
    useToolsStore();

  const fullGraph = useMemo(() => buildStackNetwork(selected), [selected]);
  const graph = useMemo(
    () => filterNetworkGraph(fullGraph, networkFilter),
    [fullGraph, networkFilter],
  );

  const activeEdges = fullGraph.edges.filter((e) => e.active);
  const conflicts = activeEdges.filter(
    (e) => e.type === 'caution' || e.type === 'contraindication',
  );
  const synergies = activeEdges.filter((e) => e.type === 'synergy' || e.type === 'potential');

  const highlightedEdges = networkHighlightNode
    ? graph.edges.filter(
        (e) => e.source === networkHighlightNode || e.target === networkHighlightNode,
      )
    : [];

  return (
    <div className="space-y-6">
      <ToolDisclaimer />

      <StackPresetsBar selected={selected} onApply={applyPreset} />

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-5">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Build your stack</CardTitle>
              <CardDescription>
                Toggle compounds — the network updates live with synergy and conflict edges.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CompoundSelectorGrid selected={selected} onToggle={toggle} />
            </CardContent>
          </Card>

          {conflicts.length > 0 && (
            <Card className="border-accent-amber/25">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-accent-amber" />
                  Active conflicts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {conflicts.map((e) => (
                  <div key={e.id} className="text-xs p-2 rounded-lg bg-muted/30">
                    <p className="font-semibold text-accent-amber">{e.label}</p>
                    <p className="text-muted-foreground mt-0.5">{e.detail}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-7 space-y-5">
          <Card variant="elevated">
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="w-5 h-5 text-accent-violet" />
                    Interaction network
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Nodes = compounds · Edges = synergy (green), potential (cyan), caution (amber), contraindication (rose)
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant="success">{fullGraph.stats.activeSynergyCount} synergies</Badge>
                  <Badge variant={conflicts.length ? 'warning' : 'default'}>
                    {fullGraph.stats.activeConflictCount} conflicts
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <TabBar
                tabs={filterTabs}
                active={networkFilter}
                onChange={setNetworkFilter}
                theme="violet"
                ariaLabel="Network filter"
                className="mb-4"
              />
              <StackNetworkGraph
                graph={graph}
                highlightNodeId={networkHighlightNode}
                onNodeClick={(id) =>
                  setNetworkHighlightNode(networkHighlightNode === id ? null : id)
                }
              />
              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                <div className="glass rounded-lg py-2">
                  <p className="text-lg font-bold text-accent-cyan">{fullGraph.stats.networkDensity}</p>
                  <p className="text-[9px] font-mono text-muted-foreground">DENSITY</p>
                </div>
                <div className="glass rounded-lg py-2">
                  <p className="text-lg font-bold text-accent-emerald">{synergies.length}</p>
                  <p className="text-[9px] font-mono text-muted-foreground">ACTIVE EDGES</p>
                </div>
                <div className="glass rounded-lg py-2">
                  <p className="text-lg font-bold text-accent-violet">{selected.length}</p>
                  <p className="text-[9px] font-mono text-muted-foreground">COMPOUNDS</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {networkHighlightNode && highlightedEdges.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Connections for{' '}
                    {graph.nodes.find((n) => n.id === networkHighlightNode)?.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {highlightedEdges.map((e) => (
                    <div key={e.id} className="flex gap-2 text-xs">
                      {e.type === 'synergy' || e.type === 'potential' ? (
                        <Sparkles className="w-3.5 h-3.5 text-accent-emerald shrink-0" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-accent-amber shrink-0" />
                      )}
                      <div>
                        <span className="font-semibold text-foreground/90">{e.label}</span>
                        <p className="text-muted-foreground mt-0.5">{e.detail}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}