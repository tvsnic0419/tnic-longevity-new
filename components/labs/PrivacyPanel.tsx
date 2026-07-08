'use client';

import { Shield, HardDrive, WifiOff, Trash2, Download, Lock, Clock } from 'lucide-react';
import { usePlatform } from '@/context/PlatformContext';
import { PRIVACY_PRINCIPLES, getStorageSummary } from '@/lib/privacy';
import { Badge } from '@/components/ui/Badge';

const principles = [
  {
    icon: HardDrive,
    title: 'Local-First Storage',
    desc: 'All lab readings persist in your browser only. No account, no server, no database.',
  },
  {
    icon: WifiOff,
    title: 'Zero Network Transmission',
    desc: 'CSV uploads are parsed in-memory. Values never leave your device during input or analysis.',
  },
  {
    icon: Lock,
    title: 'You Own the Data',
    desc: 'Export CSV or full platform JSON anytime. Delete all data with one click.',
  },
  {
    icon: Shield,
    title: 'No Third-Party Analytics on Labs',
    desc: 'Lab values are excluded from tracking. Analysis runs client-side — no API calls.',
  },
];

export function PrivacyPanel() {
  const {
    labs,
    clearLabs,
    exportLabsCsv,
    exportAll,
    privacyMode,
    setPrivacyMode,
    purgeAllHealthData,
  } = usePlatform();

  const summary = getStorageSummary(privacyMode);

  const downloadCsv = () => {
    const blob = new Blob([exportLabsCsv()], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tnic-labs-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAll = () => {
    const blob = new Blob([exportAll()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tnic-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-6 border border-accent-emerald/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-accent-emerald/10">
            <Shield className="w-5 h-5 text-accent-emerald" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Privacy-First Architecture</h3>
            <p className="text-xs text-muted-foreground">Your health-adjacent data never touches TNiC servers.</p>
          </div>
        </div>

        <ul className="space-y-2 mb-6">
          {PRIVACY_PRINCIPLES.map((p) => (
            <li key={p} className="text-xs text-muted-foreground flex gap-2">
              <span className="text-accent-emerald shrink-0">✓</span> {p}
            </li>
          ))}
        </ul>

        <div className="grid sm:grid-cols-2 gap-4">
          {principles.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="glass rounded-xl p-4">
                <Icon className="w-4 h-4 text-accent-emerald mb-2" aria-hidden="true" />
                <h4 className="font-semibold text-xs mb-1">{p.title}</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="glass rounded-xl p-5">
        <p className="text-[10px] font-mono text-muted-foreground uppercase mb-3">Storage mode</p>
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setPrivacyMode('local')}
            className={`focus-ring interactive px-4 py-2 rounded-lg text-xs font-semibold ${
              privacyMode === 'local'
                ? 'bg-accent-emerald/20 text-accent-emerald border border-accent-emerald/30'
                : 'glass text-muted-foreground'
            }`}
            aria-pressed={privacyMode === 'local'}
          >
            <HardDrive className="w-3.5 h-3.5 inline mr-1.5" aria-hidden="true" />
            Persistent (localStorage)
          </button>
          <button
            onClick={() => setPrivacyMode('session')}
            className={`focus-ring interactive px-4 py-2 rounded-lg text-xs font-semibold ${
              privacyMode === 'session'
                ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30'
                : 'glass text-muted-foreground'
            }`}
            aria-pressed={privacyMode === 'session'}
          >
            <Clock className="w-3.5 h-3.5 inline mr-1.5" aria-hidden="true" />
            Session only (clears on tab close)
          </button>
        </div>
        <div className="flex flex-wrap gap-2 text-[10px]">
          <Badge variant="info">{summary.labsCount} lab readings</Badge>
          {summary.hasStack && <Badge variant="default">Stack saved</Badge>}
          {summary.hasNotes && <Badge variant="default">Notes saved</Badge>}
        </div>
      </div>

      <div className="glass rounded-xl p-5">
        <p className="text-[10px] font-mono text-muted-foreground uppercase mb-3">Data controls</p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={downloadCsv}
            disabled={labs.length === 0}
            className="focus-ring flex items-center gap-2 text-xs font-semibold text-accent-emerald hover:text-accent-cyan transition disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" /> Export labs CSV ({labs.length})
          </button>
          <button
            onClick={downloadAll}
            className="focus-ring flex items-center gap-2 text-xs font-semibold text-accent-cyan hover:text-accent-emerald transition"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" /> Export full JSON
          </button>
          <button
            onClick={() => {
              if (labs.length > 0 && confirm('Delete all lab data? This cannot be undone.')) {
                clearLabs();
              }
            }}
            disabled={labs.length === 0}
            className="focus-ring flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-accent-rose transition disabled:opacity-40"
          >
            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" /> Delete labs only
          </button>
          <button
            onClick={() => {
              if (confirm('Purge ALL health data (labs, stack, profile, notes)? This cannot be undone.')) {
                purgeAllHealthData();
              }
            }}
            className="focus-ring flex items-center gap-2 text-xs font-semibold text-accent-rose/80 hover:text-accent-rose transition"
          >
            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" /> Purge everything
          </button>
        </div>
      </div>
    </div>
  );
}