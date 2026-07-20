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
  Network,
  BarChart3,
  Trophy,
  ArrowRight,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { TabBar } from '@/components/ui/TabBar';
import { SectionSkeleton } from '@/components/ui/SectionSkeleton';
import { EvidenceTagLegend } from '@/components/trust/EvidenceTag';
import { toolsRegistry, type ToolId } from '@/lib/registry';
import { ToolDisclaimer } from './ToolDisclaimer';
import { ToolPreviewGlyph } from './ToolPreviewGlyph';
import { AgingPaceStudio } from './AgingPaceStudio';

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
} as const;

const toolAccents: Record<ToolId, string> = {
  simulator:  'var(--accent-violet)',
  network:    'var(--accent-cyan)',
  protocol:   'var(--accent-emerald)',
  biomarker:  'var(--accent-amber)',
  impact:     'var(--accent-rose)',
  healthspan: 'var(--accent-emerald)',
};

// 'healthspan' is now the flagship Biological Age Trajectory studio, rendered as
// the featured hero at the top of the page rather than as a tab panel. It stays
// in the registry (SEO/search-palette copy, deep-link target) but is filtered
// out of the tab picker so it isn't offered twice.
const TAB_TOOLS = toolsRegistry.filter((t) => t.id !== 'healthspan');

const tabs = TAB_TOOLS.map((t) => ({
  id: t.id,
  label: t.label,
  icon: tabIcons[t.id],
  badge: t.badge,
}));

function isTabTool(id: string | null): id is ToolId {
  return !!id && TAB_TOOLS.some((t) => t.id === id);
}

export function ToolsHub() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [active, setActive] = useState<ToolId>(isTabTool(tabParam) ? tabParam : 'simulator');

  useEffect(() => {
    if (isTabTool(tabParam)) setActive(tabParam);
  }, [tabParam]);

  // Legacy/flagship deep-link: /tools?tab=healthspan scrolls to the studio hero.
  useEffect(() => {
    if (tabParam === 'healthspan') {
      document.getElementById('biological-age-trajectory')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [tabParam]);

  const onTabChange = useCallback((id: ToolId) => {
    setActive(id);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', id);
    window.history.replaceState({}, '', url.toString());
  }, []);

  const activeTool = TAB_TOOLS.find((t) => t.id === active) ?? TAB_TOOLS[0];

  return (
    <section className="canvas-scrim min-h-screen pt-6 md:pt-8 pb-20">
      <div className="container-page">
        <PageHeader
          icon={Calculator}
          eyebrow="Interactive Tools"
          title="Longevity Decision Engine"
          description="Six evidence-graded tools that turn library knowledge into actionable protocols. Rule-based engines with transparent reasoning — not generative AI."
          theme="violet"
          as="h1"
        />

        {/* Flagship: stack-driven biological-age trajectory studio */}
        <div id="biological-age-trajectory" className="mb-10 scroll-mt-24">
          <AgingPaceStudio />
        </div>

        <Link
          href="/elite-8"
          className="focus-ring block mb-8 card-premium border border-accent-amber/25 bg-gradient-to-br from-accent-amber/8 to-transparent rounded-2xl p-5 md:p-6 hover:border-accent-amber/40 transition group"
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

        {/* Visual tool picker grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
          {TAB_TOOLS.map((t) => {
            const Icon = tabIcons[t.id];
            const accent = toolAccents[t.id];
            const isActive = active === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onTabChange(t.id)}
                className={`focus-ring group text-left rounded-xl p-4 border transition-all duration-200 ${
                  isActive
                    ? 'card-premium border-opacity-60 shadow-lg'
                    : 'glass glass-hover border-border/40'
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
                      className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full border"
                      style={{ color: accent, borderColor: `color-mix(in srgb, ${accent} 30%, transparent)`, background: `color-mix(in srgb, ${accent} 10%, transparent)` }}
                    >
                      {t.badge}
                    </span>
                  )}
                </div>
                <p className="font-semibold text-sm leading-tight" style={isActive ? { color: accent } : {}}>
                  {t.label}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5 mb-3 leading-snug line-clamp-2">
                  {t.shortLabel}
                </p>
                <ToolPreviewGlyph tool={t.id} color={accent} />
              </button>
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
        </div>

        <div className="mt-12">
          <ToolDisclaimer variant="warning" />
        </div>
      </div>
    </section>
  );
}