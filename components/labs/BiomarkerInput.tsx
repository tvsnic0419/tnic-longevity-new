'use client';
/* eslint-disable react-hooks/set-state-in-effect --
   The mount/URL-driven effect(s) below set state from client-only sources
   (localStorage, window, or URL search params) or trigger entrance animations.
   These cannot run during SSR, so the initial setState is intentional and not a
   value derivable during render. Reviewed 2026-06-21; safe to keep. */

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export const LABS_PARTNER_TAB_EVENT = 'tnic:labs-partner-tab';
import { Plus, Upload, FileText, ClipboardPaste, CheckCircle2, AlertCircle } from 'lucide-react';
import { biomarkers } from '@/lib/data';
import { LABS_CSV_TEMPLATE, parseLabsCsv, getLabStatus, parseOptimalRange } from '@/lib/labs';
import { usePlatform } from '@/context/PlatformContext';
import { PartnerImportPanel } from './PartnerImportPanel';

type InputMode = 'single' | 'panel' | 'upload' | 'partner';

export function BiomarkerInput() {
  const { addLab, importLabs } = usePlatform();
  const searchParams = useSearchParams();
  const markerParam = searchParams.get('marker');
  const validMarker =
    markerParam && biomarkers.some((b) => b.id === markerParam) ? markerParam : biomarkers[0].id;

  const [mode, setMode] = useState<InputMode>('single');
  const [markerId, setMarkerId] = useState(validMarker);
  const [value, setValue] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [panelDate, setPanelDate] = useState(new Date().toISOString().slice(0, 10));
  const [panelValues, setPanelValues] = useState<Record<string, string>>({});
  const [uploadMsg, setUploadMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [pasteText, setPasteText] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (markerParam && biomarkers.some((b) => b.id === markerParam)) {
      setMarkerId(markerParam);
      setMode('single');
    }
  }, [markerParam]);

  useEffect(() => {
    const openPartner = () => setMode('partner');
    window.addEventListener(LABS_PARTNER_TAB_EVENT, openPartner);
    return () => window.removeEventListener(LABS_PARTNER_TAB_EVENT, openPartner);
  }, []);

  const addSingle = () => {
    const num = parseFloat(value);
    if (isNaN(num)) return;
    addLab(markerId, num, date);
    setValue('');
    setUploadMsg({ type: 'success', text: `Logged ${biomarkers.find((b) => b.id === markerId)?.name}` });
    setTimeout(() => setUploadMsg(null), 2500);
  };

  const addPanel = () => {
    let count = 0;
    for (const b of biomarkers) {
      const v = parseFloat(panelValues[b.id] ?? '');
      if (!isNaN(v)) {
        addLab(b.id, v, panelDate);
        count++;
      }
    }
    if (count > 0) {
      setPanelValues({});
      setUploadMsg({ type: 'success', text: `Logged ${count} markers from panel` });
      setTimeout(() => setUploadMsg(null), 2500);
    }
  };

  const handleCsv = (text: string) => {
    const { entries, errors } = parseLabsCsv(text);
    if (entries.length === 0) {
      setUploadMsg({ type: 'error', text: errors[0] ?? 'No valid rows found' });
      return;
    }
    const count = importLabs(entries);
    const errNote = errors.length ? ` (${errors.length} rows skipped)` : '';
    setUploadMsg({ type: 'success', text: `Imported ${count} readings${errNote}` });
    setPasteText('');
    setTimeout(() => setUploadMsg(null), 4000);
  };

  const onFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => handleCsv(e.target?.result as string);
    reader.readAsText(file);
  };

  const modes: { id: InputMode; label: string }[] = [
    { id: 'single', label: 'Single Marker' },
    { id: 'panel', label: 'Full Panel' },
    { id: 'upload', label: 'Upload CSV' },
    { id: 'partner', label: 'Partner Beta' },
  ];

  return (
    <div className="gradient-border p-6">
      <div className="flex flex-wrap gap-2 mb-5">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              mode === m.id
                ? 'bg-accent-rose text-black'
                : 'glass text-muted-foreground hover:text-foreground'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {uploadMsg && (
        <div
          className={`flex items-center gap-2 text-xs mb-4 px-3 py-2 rounded-lg ${
            uploadMsg.type === 'success'
              ? 'bg-accent-emerald/10 text-accent-emerald'
              : 'bg-accent-rose/10 text-accent-rose'
          }`}
        >
          {uploadMsg.type === 'success' ? (
            <CheckCircle2 className="w-3.5 h-3.5" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5" />
          )}
          {uploadMsg.text}
        </div>
      )}

      {mode === 'single' && (
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Biomarker</label>
            <select
              value={markerId}
              onChange={(e) => setMarkerId(e.target.value)}
              className="input-base"
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
                step="0.01"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="e.g. 1.2"
                className="input-base"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Test Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-base"
              />
            </div>
          </div>
          {(() => {
            const bm = biomarkers.find((b) => b.id === markerId);
            const num = parseFloat(value);
            const status = !isNaN(num) ? getLabStatus(markerId, num) : null;
            const range = bm ? parseOptimalRange(bm.optimal) : null;
            const statusColor =
              status === 'optimal' ? 'var(--accent-emerald)'
              : status === 'watch' ? 'var(--accent-amber)'
              : status === 'critical' ? 'var(--accent-rose)'
              : 'var(--muted-foreground)';
            const pct = range && !isNaN(num)
              ? Math.min(100, Math.max(0, ((num - range.min) / (range.max - range.min)) * 100))
              : null;
            return (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-caption">
                    Optimal: <span className="font-mono">{bm?.optimal} {bm?.unit}</span>
                  </span>
                  {status && (
                    <span
                      className="text-[9px] font-bold font-mono px-2 py-0.5 rounded-full"
                      style={{
                        color: statusColor,
                        background: `color-mix(in srgb, ${statusColor} 12%, transparent)`,
                        border: `1px solid color-mix(in srgb, ${statusColor} 25%, transparent)`,
                      }}
                    >
                      {status.toUpperCase()}
                    </span>
                  )}
                </div>
                {pct !== null && (
                  <div className="h-1 rounded-full bg-muted/40 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: statusColor }}
                    />
                  </div>
                )}
                {bm?.critical && (
                  <p className="text-[9px] text-caption/60">Critical threshold: {bm.critical} {bm.unit}</p>
                )}
              </div>
            );
          })()}
          <button
            onClick={addSingle}
            className="w-full flex items-center justify-center gap-2 bg-accent-rose text-black py-3 rounded-xl font-semibold text-sm hover:bg-accent-cyan transition-all"
          >
            <Plus className="w-4 h-4" /> Log Result
          </button>
        </div>
      )}

      {mode === 'panel' && (
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Panel Date</label>
            <input
              type="date"
              value={panelDate}
              onChange={(e) => setPanelDate(e.target.value)}
              className="input-base"
            />
          </div>
          <p className="text-[10px] font-mono text-accent-rose uppercase">Enter values from your blood panel (leave blank to skip)</p>
          <div className="grid sm:grid-cols-2 gap-3 max-h-[320px] overflow-y-auto pr-1">
            {biomarkers.map((b) => (
              <div key={b.id} className="glass rounded-xl p-3">
                <label className="text-xs font-semibold text-foreground/80 block mb-1">{b.name}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.01"
                    value={panelValues[b.id] ?? ''}
                    onChange={(e) => setPanelValues((prev) => ({ ...prev, [b.id]: e.target.value }))}
                    placeholder={b.optimal}
                    className="input-base flex-1 !min-h-10"
                  />
                  <span className="text-[10px] text-caption shrink-0">{b.unit}</span>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={addPanel}
            className="w-full flex items-center justify-center gap-2 bg-accent-rose text-black py-3 rounded-xl font-semibold text-sm hover:bg-accent-cyan transition-all"
          >
            <Plus className="w-4 h-4" /> Log Panel
          </button>
        </div>
      )}

      {mode === 'upload' && (
        <div className="space-y-4">
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file) onFile(file);
            }}
            className="border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-accent-rose/30 transition"
          >
            <Upload className="w-8 h-8 text-accent-rose mx-auto mb-3" />
            <p className="text-sm font-semibold mb-1">Drop CSV or click to upload</p>
            <p className="text-xs text-muted-foreground">Processed locally — file never leaves your browser</p>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,.txt"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onFile(file);
                e.target.value = '';
              }}
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground block mb-1 flex items-center gap-2">
              <ClipboardPaste className="w-3.5 h-3.5" /> Or paste CSV
            </label>
            <textarea
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder={LABS_CSV_TEMPLATE.split('\n')[0]}
              rows={4}
              className="input-base font-mono text-xs resize-none !min-h-[6rem]"
            />
            <button
              onClick={() => pasteText && handleCsv(pasteText)}
              disabled={!pasteText.trim()}
              className="mt-2 text-xs font-semibold text-accent-rose hover:text-accent-cyan transition disabled:opacity-40"
            >
              Parse & Import
            </button>
          </div>

          <details className="glass rounded-xl p-4">
            <summary className="text-xs font-semibold text-muted-foreground cursor-pointer flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" /> CSV Template Format
            </summary>
            <pre className="mt-3 text-[10px] font-mono text-caption overflow-x-auto whitespace-pre">
              {LABS_CSV_TEMPLATE}
            </pre>
          </details>
        </div>
      )}

      {mode === 'partner' && <PartnerImportPanel />}
    </div>
  );
}