'use client';

import { useMemo, useState } from 'react';
import { Copy, FileText, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { usePlatform } from '@/context/PlatformContext';
import { analyzeStack } from '@/lib/stack-analysis';
import { runBiomarkerDashboard } from '@/lib/tools/biomarker-dashboard';
import {
  buildDashboardStatusMarkdown,
  downloadDashboardStatusPng,
  type DashboardStatusSnapshot,
} from '@/lib/dashboard-status-export';

function formatDaysAgo(dateStr: string): string {
  const days = Math.floor(
    (Date.now() - new Date(dateStr + 'T12:00:00').getTime()) / (1000 * 60 * 60 * 24),
  );
  if (days <= 0) return 'Today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

export function DashboardStatusExport() {
  const { selected, selectedCompounds, score, profile, defenseProfile, labs } = usePlatform();
  const [copied, setCopied] = useState(false);
  const analysis = analyzeStack(selected);

  const snapshot = useMemo((): DashboardStatusSnapshot => {
    const activeProtocol =
      selectedCompounds.length > 0
        ? selectedCompounds.map((c) => c.name.split(' ')[0]).join(' + ')
        : 'No active stack';

    const latestLabDate =
      labs.length > 0
        ? labs.reduce((max, e) => (e.date > max ? e.date : max), labs[0].date)
        : null;

    const insights = labs.length > 0 ? runBiomarkerDashboard(labs, selected, 'gsh', 24) : null;

    return {
      activeProtocol,
      compoundCount: selected.length,
      evidenceTier: analysis.evidenceTier,
      synergyScore: score,
      biologicalAge: profile.scanned ? defenseProfile.biologicalAge : '—',
      defenseScanned: profile.scanned,
      latestLabDate,
      labEntryCount: labs.length,
      hallmarkCount: analysis.hallmarkCount,
      topWin: insights?.topWin ?? undefined,
      exportedAt: new Date().toISOString(),
    };
  }, [selected, selectedCompounds, score, profile, defenseProfile, labs, analysis]);

  const markdown = useMemo(() => buildDashboardStatusMarkdown(snapshot), [snapshot]);

  const copyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* ignore */
    }
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tnic-status-${snapshot.exportedAt.slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const labLabel = snapshot.latestLabDate
    ? formatDaysAgo(snapshot.latestLabDate)
    : 'Not logged';

  return (
    <div className="pt-4 border-t border-border space-y-3">
      <p className="text-caption text-muted-foreground">N=1 export</p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={copyMarkdown}
          className="focus-ring inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold glass hover:border-accent-cyan/30 transition"
        >
          {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-accent-emerald" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy markdown'}
        </button>
        <button
          type="button"
          onClick={downloadMarkdown}
          className="focus-ring inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold glass hover:border-accent-violet/30 transition"
        >
          <FileText className="w-3.5 h-3.5" />
          Download .md
        </button>
        <button
          type="button"
          onClick={() => downloadDashboardStatusPng(snapshot)}
          className="focus-ring inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold glass hover:border-accent-emerald/30 transition"
        >
          <ImageIcon className="w-3.5 h-3.5" />
          PNG snapshot
        </button>
      </div>
      <p className="text-micro text-muted-foreground font-mono">
        Synergy {snapshot.synergyScore} · Labs {labLabel} · {snapshot.exportedAt.slice(0, 10)}
      </p>
    </div>
  );
}