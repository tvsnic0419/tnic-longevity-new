'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Cpu, Layers, Wrench, Table2, BookOpen, ShoppingBag, Sparkles } from 'lucide-react';
import { eliteStacks } from '@/lib/stacks-library';
import { compounds } from '@/lib/data';
import { usePlatform } from '@/context/PlatformContext';
import { buildEngineStackUrl, buildShopStackUrl, parseStackParam } from '@/lib/stack-url';
import { PageShell } from '@/components/ui/PageShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { TabBar } from '@/components/ui/TabBar';
import { SectionSkeleton } from '@/components/ui/SectionSkeleton';
import { DynamicStackBuilder } from './DynamicStackBuilder';
import { EliteStackCard } from './EliteStackCard';
import { ToolsPromoStrip } from '@/components/tools/ToolsPromoStrip';
import { getHubContext } from '@/lib/hub-context';
import { StackStartCompass } from './StackStartCompass';

// Only ever rendered behind the "Compare" tab — lazy so its compound-data
// and DataTable weight doesn't ship on first load for the (default) Catalog tab.
const StackComparisonTable = dynamic(
  () => import('./StackComparisonTable').then((m) => ({ default: m.StackComparisonTable })),
  { loading: () => <SectionSkeleton height="lg" /> },
);

type Tab = 'catalog' | 'builder' | 'compare';

const tabs = [
  { id: 'catalog' as const, label: 'Elite Stacks', icon: BookOpen },
  { id: 'builder' as const, label: 'Builder', icon: Wrench },
  { id: 'compare' as const, label: 'Compare', icon: Table2 },
];

export function StacksLibrary() {
  const { selected, setSelected } = usePlatform();
  const searchParams = useSearchParams();
  // NICO and the elite intervention cards both hand off stacks through
  // `?stack=<ids>&from=<source>`. PlatformContext remains the persistence
  // owner; this route-level fallback makes the important conversion handoff
  // reliable even if its provider hydration has not settled before this page.
  const stackParam = searchParams.get('stack');
  const incomingStack = useMemo(() => (stackParam ? parseStackParam(stackParam) : null), [stackParam]);
  const stackSource = searchParams.get('from');
  const sourceLabel =
    stackSource === 'nico'
      ? 'your NICO questionnaire'
      : stackSource === 'elite-home'
        ? 'an elite intervention'
        : null;
  const hasIncomingStack = sourceLabel !== null || (incomingStack?.length ?? 0) > 0;
  const viewParam = searchParams.get('view');
  const requestedTab = tabs.some((tab) => tab.id === viewParam) ? (viewParam as Tab) : 'catalog';

  const [selectedTab, setSelectedTab] = useState<Tab | null>(null);
  const tab = hasIncomingStack ? 'builder' : selectedTab ?? requestedTab;

  useEffect(() => {
    if (!incomingStack?.length) return;
    const isAlreadyLoaded =
      selected.length === incomingStack.length && selected.every((id, index) => id === incomingStack[index]);
    if (!isAlreadyLoaded) setSelected(incomingStack);
  }, [incomingStack, selected, setSelected]);

  useEffect(() => {
    if (hasIncomingStack) {
      requestAnimationFrame(() => {
        document.getElementById('stack-builder')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [hasIncomingStack]);

  return (
    <PageShell>
      <PageHeader
        icon={Layers}
        eyebrow="Stacks & Protocols"
        title="Stack Architect"
        description="Pre-built evidence-graded protocols with dosing, monitoring, and cost breakdowns. Build custom stacks with real-time synergy and contraindication analysis."
        meta={`${eliteStacks.length} elite stacks · ${compounds.length} stack-buildable compounds · Educational only`}
        theme="violet"
        variant="handoff"
        context={getHubContext('stacks')}
      />

      {sourceLabel && (
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-accent-violet/25 bg-accent-violet/5 px-4 py-3">
          <Sparkles className="h-4 w-4 shrink-0 text-accent-violet" aria-hidden="true" />
          <p className="text-sm text-[var(--color-text-secondary)]">
            <span className="font-semibold text-foreground">
              {stackSource === 'nico' ? 'Loaded from your NICO questionnaire' : 'Added from an elite intervention'}
            </span>
            {selected.length > 0 ? ` · ${selected.length} compound${selected.length === 1 ? '' : 's'}` : ''} — build from this evidence-led starting point, then review and verify your stack.
          </p>
        </div>
      )}

      <StackStartCompass />

      <div className="flex flex-wrap gap-3 mb-6">
        <Link
          href={selected.length > 0 ? buildShopStackUrl(selected) : '/shop'}
          className="focus-ring interactive inline-flex items-center gap-2 px-4 py-2 rounded-xl glass glass-hover text-sm font-semibold text-accent-amber"
        >
          <ShoppingBag className="w-4 h-4" />
          Protocol Shop — verify your stack
        </Link>
        <Link
          href={buildEngineStackUrl(selected)}
          className="focus-ring interactive inline-flex items-center gap-2 px-4 py-2 rounded-xl glass glass-hover text-sm font-semibold text-accent-cyan"
        >
          <Cpu className="w-4 h-4" />
          {selected.length > 0
            ? 'Score this stack in the Compound Engine'
            : 'Score a stack in the Compound Engine'}
        </Link>
      </div>

      <ToolsPromoStrip headline="Advanced Stack Simulator — age-adjusted dosing, risk index, hallmark radar" className="mb-8" />

      <TabBar
        tabs={tabs}
        active={tab}
        onChange={(id) => {
          setSelectedTab(id);
          if (id === 'builder') {
            setTimeout(() => document.getElementById('stack-builder')?.scrollIntoView({ behavior: 'smooth' }), 100);
          }
        }}
        theme="violet"
        ariaLabel="Stacks library sections"
        className="mb-8 justify-center sm:justify-start"
      />

      <motion.div
        key={tab}
        role="tabpanel"
        id={`panel-${tab}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {tab === 'catalog' && (
          <div className="space-y-4">
            <p className="text-label text-accent-violet">Pre-built protocols — expand for full breakdown</p>
            {eliteStacks.map((stack, i) => (
              <EliteStackCard key={stack.id} stack={stack} expanded={i === 0} />
            ))}
          </div>
        )}

        {tab === 'builder' && (
          <div id="stack-builder">
            <p className="text-label text-accent-violet mb-6">Dynamic builder — real-time synergy & safety analysis</p>
            <DynamicStackBuilder />
          </div>
        )}

        {tab === 'compare' && (
          <div>
            <p className="text-label text-accent-violet mb-6">Filter by goal, cost, and complexity</p>
            <StackComparisonTable />
          </div>
        )}
      </motion.div>

      {tab !== 'builder' && (
        <section className="mt-16 pt-10 border-t border-border" aria-label="Quick stack builder">
          <p className="text-label text-accent-violet mb-6 text-center">Quick Stack Builder</p>
          <div id="stack-builder">
            <DynamicStackBuilder />
          </div>
        </section>
      )}
    </PageShell>
  );
}