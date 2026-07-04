'use client';

import { useCallback, useEffect, useState } from 'react';
import { Download, FileJson, FileText, Stethoscope, Table } from 'lucide-react';
import { usePlatform } from '@/context/PlatformContext';
import { downloadExport, type ExportFormat } from '@/lib/export-kit';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export const EXPORT_KIT_EVENT = 'tnic:export-kit-open';

const formats: {
  id: ExportFormat;
  label: string;
  desc: string;
  icon: typeof FileJson;
}[] = [
  {
    id: 'json',
    label: 'Full backup (JSON)',
    desc: 'Stack, profile, labs, checklist, notes, milestones',
    icon: FileJson,
  },
  {
    id: 'csv',
    label: 'Labs CSV',
    desc: 'Biomarker history for spreadsheets',
    icon: Table,
  },
  {
    id: 'stack-text',
    label: 'Stack summary',
    desc: 'Plain-text protocol for notes or sharing',
    icon: FileText,
  },
  {
    id: 'physician-md',
    label: 'Physician summary',
    desc: 'Markdown brief with cautions and interactions',
    icon: Stethoscope,
  },
];

export function ExportKitModal() {
  const { selected, profile, labs, checklist, hallmarkNotes, milestones } = usePlatform();
  const [open, setOpen] = useState(false);
  const [lastFormat, setLastFormat] = useState<ExportFormat | null>(null);

  const close = useCallback(() => setOpen(false), []);

  const runExport = useCallback(
    (format: ExportFormat) => {
      downloadExport(format, {
        stack: selected,
        profile,
        labs,
        checklist,
        hallmarkNotes,
        milestones,
      });
      setLastFormat(format);
      setTimeout(close, 400);
    },
    [selected, profile, labs, checklist, hallmarkNotes, milestones, close],
  );

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(EXPORT_KIT_EVENT, onOpen);
    return () => window.removeEventListener(EXPORT_KIT_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="presentation"
      onClick={close}
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Export kit"
        className="relative w-full max-w-lg glass rounded-2xl border border-border shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-lg font-bold">Export kit</h2>
          <p className="text-body-sm text-muted-foreground mt-1">
            Downloads stay on your device — nothing is sent to TNiC servers.
          </p>
        </div>

        <ul className="p-3 space-y-2">
          {formats.map((f) => {
            const Icon = f.icon;
            const disabled = f.id === 'csv' && labs.length === 0;
            return (
              <li key={f.id}>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => runExport(f.id)}
                  className={cn(
                    'focus-ring w-full flex items-start gap-3 rounded-xl border border-border p-3 text-left transition-colors',
                    disabled
                      ? 'opacity-40 cursor-not-allowed'
                      : 'hover:border-accent-cyan/40 hover:bg-accent-cyan/5',
                  )}
                >
                  <Icon className="w-5 h-5 text-accent-cyan shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{f.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
                    {disabled && (
                      <p className="text-caption text-accent-amber mt-1">Log labs first to export CSV</p>
                    )}
                  </div>
                  <Download className="w-4 h-4 text-muted-foreground shrink-0" aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>

        <div className="border-t border-border px-5 py-3 flex justify-end gap-2">
          {lastFormat && (
            <p className="text-caption text-accent-emerald mr-auto self-center">
              Downloaded {lastFormat.replace('-', ' ')}
            </p>
          )}
          <Button variant="ghost" size="sm" onClick={close}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}