'use client';

import { useState } from 'react';
import { Download, Copy, FileText, Braces, CheckCircle2 } from 'lucide-react';
import { citationRegistry } from '@/lib/trust';
import { buildCitationBibTeX, buildCitationJson } from '@/lib/citation-export';

type CopyKind = 'bibtex' | 'json' | null;

function downloadFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function CitationExportPanel() {
  const [copied, setCopied] = useState<CopyKind>(null);

  const bibtex = buildCitationBibTeX();
  const json = buildCitationJson();

  const copy = async (kind: CopyKind, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(kind);
      setTimeout(() => setCopied(null), 2500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="glass rounded-xl p-5 border border-accent-emerald/20">
      <div className="flex items-center gap-2 mb-2">
        <Download className="w-4 h-4 text-accent-emerald" aria-hidden="true" />
        <p className="text-label text-accent-emerald">Export citation bundle</p>
      </div>
      <p className="text-body-sm mb-4">
        Download or copy all {citationRegistry.length} indexed PMIDs as BibTeX or structured JSON — for
        researchers, literature reviews, and citation managers.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => copy('bibtex', bibtex)}
          className="focus-ring inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-accent-emerald/15 border border-accent-emerald/25 text-accent-emerald hover:bg-accent-emerald/25 transition"
        >
          {copied === 'bibtex' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied === 'bibtex' ? 'Copied' : 'Copy BibTeX'}
        </button>
        <button
          type="button"
          onClick={() => downloadFile('tnic-citations.bib', bibtex, 'application/x-bibtex')}
          className="focus-ring inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold glass hover:border-accent-emerald/30 transition"
        >
          <FileText className="w-3.5 h-3.5" />
          Download .bib
        </button>
        <button
          type="button"
          onClick={() => copy('json', json)}
          className="focus-ring inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold glass hover:border-accent-cyan/30 transition"
        >
          {copied === 'json' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Braces className="w-3.5 h-3.5" />}
          {copied === 'json' ? 'Copied' : 'Copy JSON'}
        </button>
        <button
          type="button"
          onClick={() => downloadFile('tnic-citations.json', json, 'application/json')}
          className="focus-ring inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold glass hover:border-accent-cyan/30 transition"
        >
          <Download className="w-3.5 h-3.5" />
          Download .json
        </button>
      </div>
    </div>
  );
}