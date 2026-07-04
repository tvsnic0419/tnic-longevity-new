'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';
import { MarkerChart } from '@/components/charts/MarkerChart';
import { biomarkers } from '@/lib/data';
import { getLabStatus } from '@/lib/labs';
import type { MarkerSnapshot } from '@/lib/lab-analysis';
import type { LabEntry } from '@/lib/labs';
import { usePlatform } from '@/context/PlatformContext';

const statusColor = {
  optimal: 'text-accent-emerald bg-accent-emerald/10',
  watch: 'text-accent-amber bg-accent-amber/10',
  critical: 'text-accent-rose bg-accent-rose/10',
};

const trendIcon = {
  improving: { icon: TrendingUp, color: 'text-accent-emerald' },
  declining: { icon: TrendingDown, color: 'text-accent-rose' },
  stable: { icon: Minus, color: 'text-muted-foreground' },
  unknown: { icon: Minus, color: 'text-caption' },
};

interface LabTrendDashboardProps {
  snapshots: MarkerSnapshot[];
}

export function LabTrendDashboard({ snapshots }: LabTrendDashboardProps) {
  const { labs } = usePlatform();
  const [selected, setSelected] = useState(snapshots[0]?.markerId ?? biomarkers[0].id);

  const activeSnapshot = snapshots.find((s) => s.markerId === selected);
  const activeBiomarker = biomarkers.find((b) => b.id === selected);
  const chartEntries = labs.filter((e) => e.markerId === selected);

  const markersWithTrends = snapshots.filter((s) => s.readingCount >= 2);

  return (
    <div className="space-y-6">
      {/* Overview sparkline grid */}
      <div>
        <p className="text-[10px] font-mono text-accent-rose uppercase tracking-wider mb-3 flex items-center gap-2">
          <BarChart3 className="w-3.5 h-3.5" /> Marker Overview
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {snapshots.map((snap) => {
            const TrendIco = trendIcon[snap.trend].icon;
            const isActive = selected === snap.markerId;
            return (
              <motion.button
                key={snap.markerId}
                layout
                onClick={() => setSelected(snap.markerId)}
                className={`glass rounded-xl p-4 text-left transition-all ${
                  isActive ? 'ring-1 ring-rose-400/40 bg-accent-rose/5' : 'hover:border-border'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-xs font-semibold truncate pr-2">{snap.name}</h4>
                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${statusColor[snap.status]}`}>
                    {snap.status}
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold font-mono">{snap.value}</p>
                    <p className="text-[9px] text-caption">{snap.date}</p>
                  </div>
                  <TrendIco className={`w-4 h-4 ${trendIcon[snap.trend].color}`} />
                </div>
                {snap.readingCount >= 2 && (
                  <div className="mt-2 h-10">
                    <MarkerChart markerId={snap.markerId} entries={labs} height={40} />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Detailed chart */}
      {activeSnapshot && activeBiomarker && (
        <div className="gradient-border p-6">
          {(() => {
            const sorted = chartEntries.sort((a, b) => a.date.localeCompare(b.date));
            const prev = sorted.length >= 2 ? sorted[sorted.length - 2] : null;
            const delta = prev ? activeSnapshot.value - prev.value : null;
            const deltaSign = delta !== null ? (delta > 0 ? '+' : '') : '';
            const statusColorVar =
              activeSnapshot.status === 'optimal' ? 'var(--accent-emerald)'
              : activeSnapshot.status === 'watch' ? 'var(--accent-amber)'
              : 'var(--accent-rose)';
            return (
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-bold">{activeBiomarker.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Optimal: {activeBiomarker.optimal} {activeBiomarker.unit} · Critical: {activeBiomarker.critical}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 justify-end mb-1">
                    <p className="text-3xl font-bold font-mono">{activeSnapshot.value}</p>
                    <span
                      className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full"
                      style={{
                        color: statusColorVar,
                        background: `color-mix(in srgb, ${statusColorVar} 12%, transparent)`,
                        border: `1px solid color-mix(in srgb, ${statusColorVar} 25%, transparent)`,
                      }}
                    >
                      {activeSnapshot.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <p className="text-[10px] text-caption">{activeSnapshot.readingCount} readings</p>
                    {delta !== null && (
                      <p
                        className="text-[10px] font-mono font-semibold"
                        style={{ color: delta === 0 ? 'var(--muted-foreground)' : delta > 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}
                      >
                        {deltaSign}{delta.toFixed(1)} vs prev
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {chartEntries.length >= 2 ? (
            <>
              <MarkerChart markerId={selected} entries={labs} height={160} />
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                {chartEntries
                  .sort((a, b) => a.date.localeCompare(b.date))
                  .map((e: LabEntry) => (
                    <div key={e.id} className="glass rounded-lg py-2 px-1">
                      <p className="text-[9px] text-caption">{e.date}</p>
                      <p className="text-sm font-mono font-bold">{e.value}</p>
                      <p className={`text-[9px] ${statusColor[getLabStatus(e.markerId, e.value)].split(' ')[0]}`}>
                        {getLabStatus(e.markerId, e.value)}
                      </p>
                    </div>
                  ))}
              </div>
            </>
          ) : (
            <div className="h-40 flex items-center justify-center text-sm text-muted-foreground">
              Log 2+ readings for {activeBiomarker.name} to visualize trends
            </div>
          )}
        </div>
      )}

      {markersWithTrends.length === 0 && snapshots.length > 0 && (
        <p className="text-xs text-caption text-center">
          Add repeat tests over time to unlock trend analysis and trajectory insights.
        </p>
      )}
    </div>
  );
}