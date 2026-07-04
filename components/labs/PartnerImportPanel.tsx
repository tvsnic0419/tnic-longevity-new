'use client';

import { useRef, useState } from 'react';
import {
  Upload,
  FileJson,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Server,
} from 'lucide-react';
import { usePlatform } from '@/context/PlatformContext';
import {
  parsePartnerCsv,
  parsePartnerJson,
  PARTNER_CSV_TEMPLATE,
  PARTNER_JSON_EXAMPLE,
} from '@/lib/lab-partner-import';
import { labPartnerApiSpec } from '@/lib/lab-partner-api';

export function PartnerImportPanel() {
  const { importLabs } = usePlatform();
  const [jsonText, setJsonText] = useState('');
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [apiLoading, setApiLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const applyResult = (entries: { markerId: string; value: number; date: string }[], errors: string[]) => {
    if (entries.length === 0) {
      setMsg({ type: 'error', text: errors[0] ?? 'No valid entries' });
      return;
    }
    const count = importLabs(entries);
    const errNote = errors.length ? ` (${errors.length} warnings)` : '';
    setMsg({ type: 'success', text: `Imported ${count} partner results${errNote}` });
    setJsonText('');
    setTimeout(() => setMsg(null), 5000);
  };

  const handleCsv = (text: string) => {
    const result = parsePartnerCsv(text);
    applyResult(result.entries, result.errors);
  };

  const handleJsonLocal = (text: string) => {
    try {
      const parsed = JSON.parse(text);
      const result = parsePartnerJson(parsed);
      applyResult(result.entries, result.errors);
    } catch {
      setMsg({ type: 'error', text: 'Invalid JSON' });
    }
  };

  const handleJsonApi = async () => {
    if (!jsonText.trim()) return;
    setApiLoading(true);
    try {
      const parsed = JSON.parse(jsonText);
      const res = await fetch('/api/labs/partner-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setMsg({ type: 'error', text: data.errors?.[0] ?? 'API import failed' });
        return;
      }
      applyResult(data.entries, data.errors ?? []);
    } catch {
      setMsg({ type: 'error', text: 'API request failed — try local parse' });
    } finally {
      setApiLoading(false);
    }
  };

  return (
    <div id="partner-import" className="space-y-4">
      <p className="text-xs text-muted-foreground">
        <span className="font-mono text-accent-rose uppercase">Beta</span> — Import TNiC Partner
        v1 exports (CSV or JSON). Processed locally unless you use the API normalize button.
      </p>

      {msg && (
        <div
          className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg ${
            msg.type === 'success'
              ? 'bg-accent-emerald/10 text-accent-emerald'
              : 'bg-accent-rose/10 text-accent-rose'
          }`}
        >
          {msg.type === 'success' ? (
            <CheckCircle2 className="w-3.5 h-3.5" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5" />
          )}
          {msg.text}
        </div>
      )}

      <div
        onClick={() => fileRef.current?.click()}
        className="border-2 border-dashed border-accent-rose/30 rounded-2xl p-6 text-center cursor-pointer hover:border-accent-rose/50 transition"
      >
        <Upload className="w-7 h-7 text-accent-rose mx-auto mb-2" />
        <p className="text-sm font-semibold">Drop partner CSV</p>
        <p className="text-xs text-muted-foreground">TNiC Partner Export v1 format</p>
        <input
          ref={fileRef}
          type="file"
          accept=".csv,.txt,.json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
              const text = ev.target?.result as string;
              if (file.name.endsWith('.json')) {
                setJsonText(text);
                handleJsonLocal(text);
              } else {
                handleCsv(text);
              }
            };
            reader.readAsText(file);
            e.target.value = '';
          }}
        />
      </div>

      <div>
        <label className="text-xs text-muted-foreground flex items-center gap-2 mb-1">
          <FileJson className="w-3.5 h-3.5" /> Partner JSON
        </label>
        <textarea
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          placeholder={JSON.stringify(PARTNER_JSON_EXAMPLE, null, 2)}
          rows={6}
          className="input-base font-mono text-xs resize-none !min-h-[8rem]"
        />
        <div className="flex flex-wrap gap-2 mt-2">
          <button
            type="button"
            onClick={() => jsonText && handleJsonLocal(jsonText)}
            disabled={!jsonText.trim()}
            className="text-xs font-semibold text-accent-rose hover:text-accent-cyan disabled:opacity-40"
          >
            Parse locally
          </button>
          <button
            type="button"
            onClick={handleJsonApi}
            disabled={!jsonText.trim() || apiLoading}
            className="text-xs font-semibold text-accent-cyan hover:text-accent-emerald disabled:opacity-40 inline-flex items-center gap-1"
          >
            <Server className="w-3 h-3" />
            {apiLoading ? 'Normalizing…' : 'Via API normalize'}
          </button>
        </div>
      </div>

      <details className="glass rounded-xl p-4">
        <summary className="text-xs font-semibold cursor-pointer">Partner CSV template</summary>
        <pre className="mt-3 text-[10px] font-mono text-caption overflow-x-auto whitespace-pre">
          {PARTNER_CSV_TEMPLATE}
        </pre>
        <p className="text-[10px] text-muted-foreground mt-3">
          API: <code className="text-accent-cyan">POST {labPartnerApiSpec.endpoints[0].path}</code>
        </p>
        <a
          href="/api/labs/partner-import"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-accent-cyan hover:underline inline-flex items-center gap-1 mt-2"
        >
          View API GET spec <ExternalLink className="w-3 h-3" />
        </a>
        <p className="text-[10px] text-muted-foreground mt-3">
          Round-trip: use <strong>Partner JSON</strong> export on the Labs hub to download TNiC Partner v1
          JSON from your logged biomarkers, then re-import here or POST to the API.
        </p>
      </details>
    </div>
  );
}