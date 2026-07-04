'use client';
/* eslint-disable react-hooks/set-state-in-effect --
   The mount/URL-driven effect(s) below set state from client-only sources
   (localStorage, window, or URL search params) or trigger entrance animations.
   These cannot run during SSR, so the initial setState is intentional and not a
   value derivable during render. Reviewed 2026-06-21; safe to keep. */

import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FlaskConical, LineChart, Lightbulb, Dna, Shield, Download, FileJson } from 'lucide-react';
import { exportLabsPartnerJsonString } from '@/lib/lab-partner-export';
import { analyzeLabs } from '@/lib/lab-analysis';
import { usePlatform } from '@/context/PlatformContext';
import { PageShell } from '@/components/ui/PageShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { TabBar } from '@/components/ui/TabBar';
import { StatStrip } from '@/components/ui/StatStrip';
import { Button } from '@/components/ui/Button';
import { UserFlowGuide } from './UserFlowGuide';
import { BiomarkerInput } from './BiomarkerInput';
import { LabTrendDashboard } from './LabTrendDashboard';
import { HallmarkRiskPanel } from './HallmarkRiskPanel';
import { LabRecommendations } from './LabRecommendations';
import { PrivacyPanel } from './PrivacyPanel';
import { ToolsPromoStrip } from '@/components/tools/ToolsPromoStrip';
import { LabPartnerPanel } from './LabPartnerPanel';
import { getHubContext } from '@/lib/hub-context';

type Tab = 'input' | 'trends' | 'risk' | 'insights' | 'privacy';

const tabs = [
  { id: 'input' as const, label: 'Input', icon: FlaskConical },
  { id: 'trends' as const, label: 'Trends', icon: LineChart },
  { id: 'risk' as const, label: 'Risk', icon: Dna },
  { id: 'insights' as const, label: 'Insights', icon: Lightbulb },
  { id: 'privacy' as const, label: 'Privacy', icon: Shield },
];

export function LabHub() {
  const { labs, selected, exportLabsCsv } = usePlatform();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const initialTab =
    tabParam && tabs.some((t) => t.id === tabParam) ? (tabParam as Tab) : 'input';
  const [tab, setTab] = useState<Tab>(initialTab);

  useEffect(() => {
    if (tabParam && tabs.some((t) => t.id === tabParam)) {
      setTab(tabParam as Tab);
    }
  }, [tabParam]);

  const analysis = useMemo(() => analyzeLabs(labs, selected), [labs, selected]);

  const downloadCsv = () => {
    const blob = new Blob([exportLabsCsv()], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tnic-labs-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPartnerJson = () => {
    const json = exportLabsPartnerJsonString(labs);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tnic-labs-partner-v1-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PageShell>
      <PageHeader
        icon={FlaskConical}
        eyebrow="Lab Analysis & Tracking Hub"
        title="Your Biomarkers. Your Data. Your Insights."
        description="Log lab results, visualize trends, map risks to the 12 Hallmarks of Aging, and get stack-aware recommendations — all processed locally in your browser."
        theme="rose"
        context={getHubContext('labs')}
      />

      {analysis.markersTracked > 0 && (
        <StatStrip
          stats={[
            { label: 'Healthspan Score', value: analysis.healthspanScore, color: 'text-accent-rose' },
            { label: 'Markers Tracked', value: analysis.markersTracked, color: 'text-accent-cyan' },
            { label: 'Optimal', value: analysis.markersOptimal, color: 'text-accent-emerald' },
            { label: 'Watch', value: analysis.markersWatch, color: 'text-accent-amber' },
            { label: 'Panel Coverage', value: `${analysis.dataCompleteness}%`, color: 'text-accent-violet' },
          ]}
        />
      )}

      <ToolsPromoStrip headline="Biomarker Impact Calculator — which interventions move your labs most" className="mb-8" />

      <UserFlowGuide currentStep={tabs.findIndex((t) => t.id === tab) + 1} />

      {(() => {
        const elevatedRisks = analysis.hallmarkRisks.filter(
          (r) => r.riskLevel === 'high' || r.riskLevel === 'elevated',
        ).length;
        const badgedTabs = tabs.map((t) => ({
          ...t,
          badge:
            t.id === 'risk' && elevatedRisks > 0
              ? `${elevatedRisks} ↑`
              : t.id === 'insights' && analysis.recommendations.length > 0
                ? `${analysis.recommendations.length}`
                : undefined,
        }));
        return (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <TabBar tabs={badgedTabs} active={tab} onChange={setTab} theme="rose" ariaLabel="Lab hub sections" />
            {labs.length > 0 && (
              <div className="flex flex-wrap gap-2 shrink-0 self-start sm:self-center">
                <Button variant="secondary" icon={Download} onClick={downloadCsv}>
                  Export CSV
                </Button>
                <Button variant="secondary" icon={FileJson} onClick={downloadPartnerJson}>
                  Partner JSON
                </Button>
              </div>
            )}
          </div>
        );
      })()}

      {analysis.topConcern && (
        <div className="card-base px-4 py-3 mb-6 border-accent-amber/20 text-body-sm" role="status">
          <strong className="text-accent-amber">Top concern:</strong> {analysis.topConcern}
          {analysis.topWin && <span className="text-muted-foreground"> · Win: {analysis.topWin}</span>}
        </div>
      )}

      <motion.div
        key={tab}
        role="tabpanel"
        id={`panel-${tab}`}
        aria-labelledby={`tab-${tab}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {tab === 'input' && (
          <div className="max-w-2xl mx-auto">
            <BiomarkerInput />
          </div>
        )}

        {tab === 'trends' && (
          analysis.snapshots.length > 0 ? (
            <LabTrendDashboard snapshots={analysis.snapshots} />
          ) : (
            <EmptyState message="Log your first lab result to unlock trend visualization." onAction={() => setTab('input')} />
          )
        )}

        {tab === 'risk' && (
          <div className="max-w-3xl mx-auto">
            <HallmarkRiskPanel risks={analysis.hallmarkRisks} healthspanScore={analysis.healthspanScore} />
          </div>
        )}

        {tab === 'insights' && (
          <div className="max-w-2xl mx-auto">
            <p className="text-label text-accent-rose mb-4">Personalized recommendations · synced with active stack</p>
            <LabRecommendations recommendations={analysis.recommendations} />
          </div>
        )}

        {tab === 'privacy' && (
          <div className="max-w-3xl mx-auto">
            <PrivacyPanel />
          </div>
        )}
      </motion.div>

      <LabPartnerPanel />
    </PageShell>
  );
}

function EmptyState({ message, onAction }: { message: string; onAction: () => void }) {
  return (
    <div className="card-base p-10 md:p-12 text-center">
      <p className="text-body-sm mb-5">{message}</p>
      <Button variant="secondary" theme="rose" onClick={onAction}>
        Go to Input →
      </Button>
    </div>
  );
}