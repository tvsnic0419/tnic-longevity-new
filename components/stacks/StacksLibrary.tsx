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
            {selected.length > 0 ? ` · ${selected.length} compound${selected.length === 1 ? '' : 's'} ready to review` : ''}.
          </p>
        </div>
      )}

      {hasIncomingStack ? (
        <section className="mb-6 rounded-2xl border border-accent-violet/25 bg-accent-violet/[0.045] p-5 md:p-6" aria-labelledby="incoming-stack-title">
          <p className="text-label text-accent-violet">YOUR STARTING CONFIGURATION</p>
          <h2 id="incoming-stack-title" className="mt-2 text-xl font-bold tracking-tight text-foreground">Review the stack you just built.</h2>
          <p className="mt-1 max-w-2xl text-body-sm text-muted-foreground">The Builder is open below with your selected compounds. Confirm evidence and safety first; use verification and scoring only after you are comfortable with the configuration.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={selected.length > 0 ? buildShopStackUrl(selected) : '/shop'}
              className="focus-ring interactive inline-flex min-h-[var(--space-touch)] items-center gap-2 rounded-xl border border-accent-amber/30 bg-accent-amber/[0.05] px-4 text-sm font-semibold text-accent-amber hover:bg-accent-amber/10"
            >
              <ShoppingBag className="w-4 h-4" aria-hidden="true" />
              Verify this stack
            </Link>
            <Link
              href={buildEngineStackUrl(selected)}
              className="focus-ring interactive inline-flex min-h-[var(--space-touch)] items-center gap-2 rounded-xl border border-accent-cyan/30 bg-accent-cyan/[0.05] px-4 text-sm font-semibold text-accent-cyan hover:bg-accent-cyan/10"
            >
              <Cpu className="w-4 h-4" aria-hidden="true" />
              Score this configuration
            </Link>
          </div>
        </section>
      ) : (
        <>
          <StackStartCompass />
          <div className="mb-6 flex flex-wrap gap-3">
            <Link
              href={selected.length > 0 ? buildShopStackUrl(selected) : '/shop'}
              className="focus-ring interactive inline-flex min-h-[var(--space-touch)] items-center gap-2 rounded-xl glass glass-hover px-4 text-sm font-semibold text-accent-amber"
            >
              <ShoppingBag className="w-4 h-4" aria-hidden="true" />
              Protocol Shop — verify your stack
            </Link>
            <Link
              href={buildEngineStackUrl(selected)}
              className="focus-ring interactive inline-flex min-h-[var(--space-touch)] items-center gap-2 rounded-xl glass glass-hover px-4 text-sm font-semibold text-accent-cyan"
            >
              <Cpu className="w-4 h-4" aria-hidden="true" />
              {selected.length > 0 ? 'Score this stack in the Compound Engine' : 'Score a stack in the Compound Engine'}
            </Link>
          </div>
        </>
      )}

      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-caption text-muted-foreground">
          {tab === 'catalog' && 'Choose a curated protocol to inspect its authored evidence and coverage.'}
          {tab === 'builder' && 'Add or remove compounds while the live analysis checks coverage and cautions.'}
          {tab === 'compare' && 'Compare curated starting points by evidence, complexity, and coverage.'}
        </p>
        {tab !== 'builder' && (
          <button
            type="button"
            onClick={() => {
              setSelectedTab('builder');
              setTimeout(() => document.getElementById('stack-builder')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
            }}
            className="focus-ring inline-flex min-h-[var(--space-touch)] items-center gap-1.5 rounded-lg px-3 text-caption font-semibold text-accent-violet hover:bg-accent-violet/[0.08]"
          >
            <Wrench className="h-3.5 w-3.5" aria-hidden="true" />
            Open Builder
          </button>
        )}
      </div>

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

      <ToolsPromoStrip headline="Extend your review with advanced stack tools" className="mt-12" />

      {tab !== 'builder' && (
        <section className="mt-12 rounded-2xl border border-dashed border-border/80 bg-background/15 p-5 text-center" aria-label="Open the stack builder">
          <p className="text-label text-accent-violet">READY TO CUSTOMIZE?</p>
          <p className="mx-auto mt-2 max-w-xl text-body-sm text-muted-foreground">Open one focused builder when you are ready to add, remove, and inspect compounds with live coverage and safety analysis.</p>
          <button
            type="button"
            onClick={() => {
              setSelectedTab('builder');
              setTimeout(() => document.getElementById('stack-builder')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
            }}
            className="focus-ring mt-4 inline-flex min-h-[var(--space-touch)] items-center gap-2 rounded-xl bg-accent-violet px-4 text-sm font-bold text-black transition-colors hover:bg-accent-violet/90"
          >
            <Wrench className="h-4 w-4" aria-hidden="true" />
            Open Stack Builder
          </button>
        </section>
      )}
    </PageShell>
  );
}