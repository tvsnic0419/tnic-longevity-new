'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, TrendingUp, TrendingDown, Minus, Download } from 'lucide-react';
import { SectionShell } from '@/components/SectionShell';
import { MarkerChart } from '@/components/charts/MarkerChart';
import { biomarkers } from '@/lib/data';
import { getLabStatus, isTrendGood } from '@/lib/labs';
import { usePlatform } from '@/context/PlatformContext';

const statusColor = {
  optimal: 'text-accent-emerald bg-accent-emerald/10',
  watch: 'text-accent-amber bg-accent-amber/10',
  critical: 'text-accent-rose bg-accent-rose/10',
};

export function LabTracker() {
  const { labs, addLab, clearLabs, exportLabsCsv } = usePlatform();
  const [markerId, setMarkerId] = useState(biomarkers[0].id);
  const [value, setValue] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [chartMarker, setChartMarker] = useState<string | null>(null);

  const addEntry = () => {
    const num = parseFloat(value);
    if (isNaN(num)) return;
    addLab(markerId, num, date);
    setValue('');
    setChartMarker(markerId);
  };

  const downloadCsv = () => {
    const blob = new Blob([exportLabsCsv()], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tnic-labs-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const latestByMarker = biomarkers
    .map((b) => {
      const markerEntries = labs
        .filter((e) => e.markerId === b.id)
        .sort((a, c) => c.date.localeCompare(a.date));
      const latest = markerEntries[0];
      const previous = markerEntries[1];
      const trend = latest && previous
        ? latest.value < previous.value ? 'down' as const : latest.value > previous.value ? 'up' as const : 'flat' as const
        : null;
      return { biomarker: b, latest, trend, count: markerEntries.length };
    })
    .filter((x) => x.latest);

  const activeChart = chartMarker ?? latestByMarker[0]?.biomarker.id ?? null;

  return (
    <SectionShell
      id="labs"
      mod="MOD-LAB-11"
      theme="rose"
      badge="Lab Tracker"
      title="Your Lab Data — Stored Locally"
      subtitle="The highest-ROI tool on this platform. Log biomarker values from your bloodwork, track trends over time, and compare against optimal ranges. Data never leaves your browser."
      className="bg-background"
    >
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="gradient-border p-6">
          <p className="text-[10px] font-mono text-accent-rose uppercase mb-4">Add Lab Result</p>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Marker</label>
              <select
                value={markerId}
                onChange={(e) => setMarkerId(e.target.value)}
                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-accent-rose/50"
              >
                {biomarkers.map((b) => (
                  <option key={b.id} value={b.id} className="bg-zinc-900">
                    {b.name} ({b.unit})
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Value</label>
                <input
                  type="number"
                  step="0.1"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="e.g. 1.2"
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-accent-rose/50"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-accent-rose/50"
                />
              </div>
            </div>
            <button
              onClick={addEntry}
              className="w-full flex items-center justify-center gap-2 bg-accent-rose text-black py-3 rounded-xl font-semibold text-sm hover:bg-accent-cyan transition-all"
            >
              <Plus className="w-4 h-4" /> Log Result
            </button>
            <p className="text-[10px] text-caption">
              Optimal range for {biomarkers.find((b) => b.id === markerId)?.name}:{' '}
              {biomarkers.find((b) => b.id === markerId)?.optimal} {biomarkers.find((b) => b.id === markerId)?.unit}
            </p>
          </div>

          {activeChart && labs.filter((e) => e.markerId === activeChart).length >= 2 && (
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-[10px] font-mono text-accent-rose uppercase mb-2">
                Trend — {biomarkers.find((b) => b.id === activeChart)?.name}
              </p>
              <MarkerChart markerId={activeChart} entries={labs} />
            </div>
          )}
        </div>

        <div className="space-y-4">
          {latestByMarker.length === 0 ? (
            <div className="glass rounded-2xl p-8 text-center">
              <p className="text-muted-foreground text-sm">No lab entries yet.</p>
              <p className="text-xs text-caption mt-2">
                Start with hs-CRP, glutathione index, or NAD+ relative score from your last panel.
              </p>
            </div>
          ) : (
            latestByMarker.map(({ biomarker: b, latest, trend, count }) => {
              const status = getStatus(b.id, latest!.value);
              const trendGood = trend && trend !== 'flat' ? isTrendGood(b.id, trend) : null;
              return (
                <motion.button
                  key={b.id}
                  layout
                  type="button"
                  onClick={() => setChartMarker(b.id)}
                  className={`glass rounded-2xl p-5 w-full text-left transition-all ${
                    chartMarker === b.id ? 'ring-1 ring-rose-400/40' : 'hover:border-border'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-sm">{b.name}</h3>
                      <p className="text-[10px] text-muted-foreground">{b.optimal} {b.unit} optimal</p>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColor[status]}`}>
                      {status}
                    </span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-bold font-mono">{latest!.value}</p>
                      <p className="text-[10px] text-caption">{latest!.date} · {count} reading{count > 1 ? 's' : ''}</p>
                    </div>
                    {trend && (
                      <span className={`flex items-center gap-1 text-xs ${
                        trendGood === true ? 'text-accent-emerald' : trendGood === false ? 'text-accent-rose' : 'text-muted-foreground'
                      }`}>
                        {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : trend === 'down' ? <TrendingDown className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                        vs prior
                      </span>
                    )}
                  </div>
                </motion.button>
              );
            })
          )}

          {labs.length > 0 && (
            <div className="flex gap-4">
              <button
                onClick={downloadCsv}
                className="text-xs text-muted-foreground hover:text-accent-emerald flex items-center gap-1 transition"
              >
                <Download className="w-3 h-3" /> Export CSV
              </button>
              <button
                onClick={clearLabs}
                className="text-xs text-caption hover:text-accent-rose flex items-center gap-1 transition"
              >
                <Trash2 className="w-3 h-3" /> Clear all
              </button>
            </div>
          )}
        </div>
      </div>
    </SectionShell>
  );
}

function getStatus(markerId: string, value: number) {
  return getLabStatus(markerId, value);
}