'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Cpu, Layers, Wrench, Table2, BookOpen, ShoppingBag } from 'lucide-react';
import { eliteStacks } from '@/lib/stacks-library';
import { stackPresets, type PresetKey } from '@/lib/presets';
import { usePlatform } from '@/context/PlatformContext';
import { buildEngineStackUrl, buildShopStackUrl } from '@/lib/stack-url';
import { PageShell } from '@/components/ui/PageShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { TabBar } from '@/components/ui/TabBar';
import { SectionSkeleton } from '@/components/ui/SectionSkeleton';
import { DynamicStackBuilder } from './DynamicStackBuilder';
import { EliteStackCard } from './EliteStackCard';
import { ToolsPromoStrip } from '@/components/tools/ToolsPromoStrip';
import { QuizStacksBanner } from './QuizStacksBanner';
import { getHubContext } from '@/lib/hub-context';

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

function isPresetKey(value: string | null): value is PresetKey {
  return value !== null && value in stackPresets;
}

export function StacksLibrary() {
  const { selected } = usePlatform();
  const searchParams = useSearchParams();
  const fromQuiz = searchParams.get('from') === 'quiz';
  const presetParam = searchParams.get('preset');
  const quizPreset = isPresetKey(presetParam) ? presetParam : null;

  const [tab, setTab] = useState<Tab>(fromQuiz ? 'builder' : 'catalog');

  useEffect(() => {
    if (fromQuiz) {
      requestAnimationFrame(() => {
        document.getElementById('stack-builder')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [fromQuiz]);

  return (
    <PageShell>
      <PageHeader
        icon={Layers}
        eyebrow="Stacks & Protocols"
        title="Stack Architect"
        description="Pre-built evidence-graded protocols with dosing, monitoring, and cost breakdowns. Build custom stacks with real-time synergy and contraindication analysis."
        meta={`${eliteStacks.length} elite stacks · 6 evidence-graded compounds · Educational only`}
        theme="violet"
        context={getHubContext('stacks')}
      />

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

      {fromQuiz && quizPreset && <QuizStacksBanner preset={quizPreset} />}

      <TabBar
        tabs={tabs}
        active={tab}
        onChange={(id) => {
          setTab(id);
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