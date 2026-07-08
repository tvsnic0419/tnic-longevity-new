import { SITE } from './site';

export interface DashboardStatusSnapshot {
  activeProtocol: string;
  compoundCount: number;
  evidenceTier: string;
  synergyScore: number;
  biologicalAge: number | string;
  defenseScanned: boolean;
  latestLabDate: string | null;
  labEntryCount: number;
  hallmarkCount: number;
  topWin?: string;
  exportedAt: string;
}

export function buildDashboardStatusMarkdown(s: DashboardStatusSnapshot): string {
  return `# TNiC Longevity OS — Status Snapshot

*Exported ${s.exportedAt.slice(0, 10)} · N=1 journaling*

## Current status

| Metric | Value |
| --- | --- |
| Active protocol | ${s.activeProtocol} |
| Compounds | ${s.compoundCount} |
| Evidence tier | ${s.evidenceTier} |
| Synergy score | ${s.synergyScore} |
| Biological age | ${s.defenseScanned ? s.biologicalAge : 'Run defense scan'} |
| Lab entries | ${s.labEntryCount}${s.latestLabDate ? ` (latest ${s.latestLabDate})` : ''} |
| Hallmarks covered | ${s.hallmarkCount} |

${s.topWin ? `## Top win\n\n${s.topWin}\n` : ''}
---

Generated locally from [${SITE.url}/dashboard](${SITE.url}/dashboard) — data not transmitted to TNiC servers.

*Educational only — not medical advice.*
`;
}

/** Render status snapshot to PNG via canvas (no external deps) */
export function downloadDashboardStatusPng(s: DashboardStatusSnapshot, filename?: string): void {
  const canvas = document.createElement('canvas');
  const w = 560;
  const h = 340;
  canvas.width = w * 2;
  canvas.height = h * 2;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.scale(2, 2);
  ctx.fillStyle = '#030712';
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = '#22d3ee';
  ctx.font = '600 11px system-ui, sans-serif';
  ctx.fillText('TNiC LONGEVITY OS', 24, 32);

  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 18px system-ui, sans-serif';
  ctx.fillText('Status snapshot', 24, 58);

  let y = 88;
  const line = (label: string, value: string, color = '#f8fafc') => {
    ctx.fillStyle = '#64748b';
    ctx.font = '11px system-ui, sans-serif';
    ctx.fillText(label.toUpperCase(), 24, y);
    ctx.fillStyle = color;
    ctx.font = '600 15px system-ui, sans-serif';
    ctx.fillText(value, 24, y + 20);
    y += 44;
  };

  line('Active protocol', s.activeProtocol);
  line('Synergy score', String(s.synergyScore), '#a78bfa');
  line('Biological age', s.defenseScanned ? String(s.biologicalAge) : '—', '#fb7185');
  line('Labs', s.latestLabDate ? `${s.labEntryCount} · ${s.latestLabDate}` : `${s.labEntryCount} logged`);

  if (s.topWin) {
    ctx.fillStyle = '#64748b';
    ctx.font = '11px system-ui, sans-serif';
    ctx.fillText('TOP WIN', 24, y);
    ctx.fillStyle = '#34d399';
    ctx.font = '13px system-ui, sans-serif';
    const words = s.topWin.slice(0, 72) + (s.topWin.length > 72 ? '…' : '');
    ctx.fillText(words, 24, y + 18);
  }

  ctx.fillStyle = '#475569';
  ctx.font = '10px system-ui, sans-serif';
  ctx.fillText(`${s.exportedAt.slice(0, 10)} · tnic.help/dashboard`, 24, h - 16);

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename ?? `tnic-status-${s.exportedAt.slice(0, 10)}.png`;
    a.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
}