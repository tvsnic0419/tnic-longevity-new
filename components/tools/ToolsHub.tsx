'use client';
/* eslint-disable react-hooks/set-state-in-effect --
   The mount/URL-driven effect(s) below set state from client-only sources
   (localStorage, window, or URL search params) or trigger entrance animations.
   These cannot run during SSR, so the initial setState is intentional and not a
   value derivable during render. Reviewed 2026-06-21; safe to keep. */

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Layers,
  Wand2,
  FlaskConical,
  TrendingUp,
  Calculator,
  Cpu,
  Network,
  BarChart3,
  Package,
  Trophy,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { TabBar } from '@/components/ui/TabBar';
import { SectionSkeleton } from '@/components/ui/SectionSkeleton';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { RevealCard } from '@/components/ui/RevealCard';
import { EvidenceTagLegend } from '@/components/trust/EvidenceTag';
import { toolsRegistry, type ToolId } from '@/lib/registry';
import { ToolDisclaimer } from './ToolDisclaimer';
import { ContextRail } from '@/components/ui/ContextRail';
import { getToolContext } from '@/lib/hub-context';

const StackSimulatorTool = dynamic(
  () => import('./StackSimulatorTool').then((m) => ({ default: m.StackSimulatorTool })),
  { loading: () => <SectionSkeleton height="lg" /> },
);
const StackNetworkTool = dynamic(
  () => import('./StackNetworkTool').then((m) => ({ default: m.StackNetworkTool })),
  { loading: () => <SectionSkeleton height="lg" /> },
);
const ProtocolEngineTool = dynamic(
  () => import('./ProtocolEngineTool').then((m) => ({ default: m.ProtocolEngineTool })),
  { loading: () => <SectionSkeleton height="lg" /> },
);
const BiomarkerDashboardTool = dynamic(
  () => import('./BiomarkerDashboardTool').then((m) => ({ default: m.BiomarkerDashboardTool })),
  { loading: () => <SectionSkeleton height="lg" /> },
);
const HealthspanEstimatorTool = dynamic(
  () => import('./HealthspanEstimatorTool').then((m) => ({ default: m.HealthspanEstimatorTool })),
  { loading: () => <SectionSkeleton height="lg" /> },
);
const InventoryForecastTool = dynamic(
  () => import('./InventoryForecastTool').then((m) => ({ default: m.InventoryForecastTool })),
  { loading: () => <SectionSkeleton height="lg" /> },
);
const BiomarkerImpactTool = dynamic(
  () => import('./BiomarkerImpactTool').then((m) => ({ default: m.BiomarkerImpactTool })),
  { loading: () => <SectionSkeleton height="lg" /> },
);

const tabIcons = {
  simulator: Layers,
  network: Network,
  protocol: Wand2,
  biomarker: FlaskConical,
  impact: BarChart3,
  healthspan: TrendingUp,
  inventory: Package,
} as const;

const toolAccents: Record<ToolId, string> = {
  simulator:  'var(--accent-violet)',
  network:    'var(--accent-cyan)',
  protocol:   'var(--accent-emerald)',
  biomarker:  'var(--accent-amber)',
  impact:     'var(--accent-rose)',
  healthspan: 'var(--accent-emerald)',
  inventory:  'var(--accent-cyan)',
};

const tabs = toolsRegistry.map((t) => ({
  id: t.id,
  label: t.label,
  icon: tabIcons[t.id],
  badge: t.badge,
}));

type DecisionTone = 'violet' | 'cyan' | 'amber' | 'emerald';

type DecisionRoute = {
  title: string;
  detail: string;
  toolId?: ToolId;
  href?: string;
  icon: LucideIcon;
  tone: DecisionTone;
};

const decisionRoutes: DecisionRoute[] = [
  {
    title: 'Check a stack',
    detail: 'Review synergy, interaction cautions, and coverage before you make changes.',
    toolId: 'simulator' as ToolId,
    icon: Layers,
    tone: 'violet',
  },
  {
    title: 'Spot a conflict',
    detail: 'See the pair-level network behind a stack and inspect the cautions.',
    toolId: 'network' as ToolId,
    icon: Network,
    tone: 'cyan',
  },
  {
    title: 'Understand a lab',
    detail: 'Explore trends and model context with explicit educational guardrails.',
    toolId: 'biomarker' as ToolId,
    icon: FlaskConical,
    tone: 'amber',
  },
  {
    title: 'Find a starting point',
    detail: 'Use NICO to explore an evidence-graded starter stack by your stated goal.',
    href: '/nico',
    icon: Wand2,
    tone: 'emerald',
  },
] as const;

const decisionToneClasses: Record<DecisionTone, { border: string; surface: string; text: string; icon: string }> = {
  violet: { border: 'border-accent-violet/25 hover:border-accent-violet/45', surface: 'bg-accent-violet/[0.055] hover:bg-accent-violet/[0.10]', text: 'text-accent-violet', icon: 'bg-accent-violet/[0.12] text-accent-violet' },
  cyan: { border: 'border-accent-cyan/25 hover:border-accent-cyan/45', surface: 'bg-accent-cyan/[0.055] hover:bg-accent-cyan/[0.10]', text: 'text-accent-cyan', icon: 'bg-accent-cyan/[0.12] text-accent-cyan' },
  amber: { border: 'border-accent-amber/25 hover:border-accent-amber/45', surface: 'bg-accent-amber/[0.055] hover:bg-accent-amber/[0.10]', text: 'text-accent-amber', icon: 'bg-accent-amber/[0.12] text-accent-amber' },
  emerald: { border: 'border-accent-emerald/25 hover:border-accent-emerald/45', surface: 'bg-accent-emerald/[0.055] hover:bg-accent-emerald/[0.10]', text: 'text-accent-emerald', icon: 'bg-accent-emerald/[0.12] text-accent-emerald' },
};

export function ToolsHub() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as ToolId | null;
  const [active, setActive] = useState<ToolId>(
    tabParam && toolsRegistry.some((t) => t.id === tabParam) ? tabParam : 'simulator',
  );

  useEffect(() => {
    if (tabParam && toolsRegistry.some((t) => t.id === tabParam)) {
      setActive(tabParam);
    }
  }, [tabParam]);

  const onTabChange = useCallback((id: ToolId) => {
    setActive(id);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', id);
    window.history.replaceState({}, '', url.toString());
  }, []);

  const activeTool = toolsRegistry.find((t) => t.id === active)!;

  return (
    <section className="canvas-scrim min-h-screen pt-6 md:pt-8 pb-20">
      <div className="container-page">
        <PageHeader
          icon={Calculator}
          eyebrow="Interactive Tools"
          title="Longevity Tools"
          description={`${toolsRegistry.length} evidence-graded calculators that turn library knowledge into practical models. Rule-based, transparent reasoning — not generative AI.`}
          theme="violet"
          cinematic
          as="h1"
        />

        <ContextRail
          {...getToolContext(active)}
          theme="cyan"
          variant="compact"
          className="mb-8 max-w-4xl mx-auto"
        />

        <section className="card-floating card-shine relative mb-8 overflow-hidden rounded-2xl p-5 md:p-6" aria-labelledby="tool-concierge-title">
          <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-accent-violet/15 blur-3xl" aria-hidden="true" />
          <div className="relative">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-micro font-mono uppercase tracking-[0.14em] text-accent-violet">Tool Concierge</p>
                <h2 id="tool-concierge-title" className="mt-2 text-xl font-bold tracking-tight">What are you trying to understand?</h2>
                <p className="mt-1 max-w-2xl text-body-sm text-muted-foreground">Choose the decision first. Each route opens a transparent tool, not a black-box answer.</p>
              </div>
              <p className="text-micro font-mono uppercase tracking-[0.12em] text-muted-foreground">Rule-based · inspectable</p>
            </div>
            <div className="mt-5 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
              {decisionRoutes.map((route) => {
                const Icon = route.icon;
                const tones = decisionToneClasses[route.tone];
                const content = (
                  <>
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tones.icon}`}><Icon className="h-4 w-4" aria-hidden="true" /></span>
                    <span className="min-w-0 flex-1"><span className={`text-sm font-semibold ${tones.text}`}>{route.title}</span><span className="mt-1 block text-caption leading-relaxed text-muted-foreground">{route.detail}</span></span>
                    <ArrowRight className={`mt-0.5 h-4 w-4 shrink-0 ${tones.text} transition-transform group-hover:translate-x-0.5`} aria-hidden="true" />
                  </>
                );
                const className = `focus-ring group flex min-h-32 items-start gap-3 rounded-xl border p-3.5 text-left transition-colors ${tones.border} ${tones.surface}`;
                return route.toolId ? (
                  <button key={route.title} type="button" onClick={() => onTabChange(route.toolId!)} className={className}>{content}</button>
                ) : (
                  <Link key={route.title} href={route.href ?? '/nico'} className={className}>{content}</Link>
                );
              })}
            </div>
          </div>
        </section>

        <GlassPanel depth="mid" className="mb-8 rounded-2xl">
          <Link
            href="/elite-8"
            className="focus-ring group block border border-accent-amber/25 bg-gradient-to-br from-accent-amber/8 to-transparent rounded-2xl p-5 md:p-6 hover:border-accent-amber/40 transition"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="icon-badge-amber w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                  <Trophy className="w-5 h-5 text-accent-amber" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-label text-accent-amber mb-1">Featured tool</p>
                  <h2 className="font-bold text-lg group-hover:text-accent-amber transition">Elite 8 Longevity Quotient</h2>
                  <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                    Eight interventions ranked by modeled LQ score — head-to-head compare, weight tuner, Rx disclaimers, and links to evidence modules.
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-amber shrink-0">
                Open ranking <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        </GlassPanel>

        <GlassPanel depth="mid" className="mb-8 rounded-2xl">
          <Link
            href="/compound-engine"
            className="focus-ring group block border border-accent-cyan/25 bg-gradient-to-br from-accent-cyan/8 to-transparent rounded-2xl p-5 md:p-6 hover:border-accent-cyan/40 transition"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="icon-badge-cyan w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                  <Cpu className="w-5 h-5 text-accent-cyan" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-label text-accent-cyan mb-1">Featured tool</p>
                  <h2 className="font-bold text-lg group-hover:text-accent-cyan transition">Compound Intelligence Engine</h2>
                  <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                    Score any compound on evidence, effect, breadth, bioavailability and safety — then resolve stack synergy, interaction cautions, and coverage across all 12 hallmarks of aging.
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-cyan shrink-0">
                Open engine <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        </GlassPanel>

        <GlassPanel depth="mid" className="mb-8 rounded-2xl">
          <Link
            href="/tools/pathway-architect"
            className="focus-ring group block border border-accent-violet/25 bg-gradient-to-br from-accent-violet/8 to-transparent rounded-2xl p-5 md:p-6 hover:border-accent-violet/40 transition"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="icon-badge-violet w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                  <Network className="w-5 h-5 text-accent-violet" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-label text-accent-violet mb-1">Featured tool</p>
                  <h2 className="font-bold text-lg group-hover:text-accent-violet transition">Pathway Architect</h2>
                  <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                    Build a protocol from curated compounds mapped to molecular pathways — live synergy, redundancy,
                    and interaction cautions, hallmark coverage, and a shareable link.
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-violet shrink-0">
                Open builder <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        </GlassPanel>

        {/* Visual tool picker grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
          {toolsRegistry.map((t, i) => {
            const Icon = tabIcons[t.id];
            const accent = toolAccents[t.id];
            const isActive = active === t.id;
            return (
              <RevealCard
                key={t.id}
                index={i}
                className={`h-full rounded-xl${isActive ? '' : ' glass-hover'}`}
              >
                <button
                  type="button"
                  onClick={() => onTabChange(t.id)}
                  className={`focus-ring group h-full w-full text-left rounded-xl p-4 border transition-all duration-200 ${
                    isActive
                      ? 'border-opacity-60 shadow-lg'
                      : 'border-border/40'
                  }`}
                  style={isActive ? { borderColor: `color-mix(in srgb, ${accent} 40%, transparent)` } : {}}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `color-mix(in srgb, ${accent} 14%, transparent)` }}
                    >
                      <Icon
                        className="w-4.5 h-4.5"
                        style={{ color: accent }}
                        aria-hidden="true"
                      />
                    </div>
                    {t.badge && (
                      <span
                        className="text-micro font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full border"
                        style={{ color: accent, borderColor: `color-mix(in srgb, ${accent} 30%, transparent)`, background: `color-mix(in srgb, ${accent} 10%, transparent)` }}
                      >
                        {t.badge}
                      </span>
                    )}
                  </div>
                  <p className="font-semibold text-sm leading-tight" style={isActive ? { color: accent } : {}}>
                    {t.label}
                  </p>
                  <p className="text-micro text-muted-foreground mt-0.5 leading-snug line-clamp-2">
                    {t.shortLabel}
                  </p>
                </button>
              </RevealCard>
            );
          })}
        </div>

        <div className="mb-8">
          <EvidenceTagLegend />
        </div>

        <TabBar
          tabs={tabs}
          active={active}
          onChange={onTabChange}
          theme="violet"
          ariaLabel="Longevity tools"
          className="mb-6"
        />

        <p className="text-body-sm text-muted-foreground mb-2 max-w-3xl">{activeTool.description}</p>
        <p className="text-caption text-caption mb-8 max-w-3xl">{activeTool.evidenceNote}</p>

        <div role="tabpanel" id={`panel-${active}`} aria-labelledby={`tab-${active}`}>
          {active === 'simulator' && <StackSimulatorTool />}
          {active === 'network' && <StackNetworkTool />}
          {active === 'protocol' && <ProtocolEngineTool />}
          {active === 'biomarker' && <BiomarkerDashboardTool />}
          {active === 'impact' && <BiomarkerImpactTool />}
          {active === 'healthspan' && <HealthspanEstimatorTool />}
          {active === 'inventory' && <InventoryForecastTool />}
        </div>

        <div className="mt-12">
          <ToolDisclaimer variant="warning" />
        </div>
      </div>
    </section>
  );
}