'use client';

import { useState } from 'react';
import { Link2, Copy, FileText, CheckCircle2 } from 'lucide-react';
import type { EvidenceComparison } from '@/lib/comparisons';
import {
  buildCompareOgSnippet,
  buildCompareShareMarkdown,
  buildCompareShareText,
  buildCompareShareUrl,
} from '@/lib/compare-share';

interface CompareShareCardProps {
  comparison: EvidenceComparison;
  compact?: boolean;
}

type CopyKind = 'link' | 'text' | 'markdown' | null;

export function CompareShareCard({ comparison, compact = false }: CompareShareCardProps) {
  const [copied, setCopied] = useState<CopyKind>(null);

  const copy = async (kind: CopyKind, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(kind);
      setTimeout(() => setCopied(null), 2500);
    } catch {
      /* ignore */
    }
  };

  const shareUrl = buildCompareShareUrl(comparison.slug);
  const ogSnippet = buildCompareOgSnippet(comparison);

  if (compact) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          copy('link', shareUrl);
        }}
        className="focus-ring inline-flex items-center gap-1 text-[10px] font-semibold text-muted-foreground hover:text-accent-cyan mt-2"
        title="Copy comparison link"
      >
        {copied === 'link' ? <CheckCircle2 className="w-3 h-3" /> : <Link2 className="w-3 h-3" />}
        {copied === 'link' ? 'Copied' : 'Copy link'}
      </button>
    );
  }

  return (
    <div
      id={`compare-share-${comparison.slug}`}
      className="glass rounded-xl p-5 border border-accent-cyan/20"
    >
      <div className="flex items-center gap-2 mb-2">
        <Link2 className="w-4 h-4 text-accent-cyan" />
        <p className="text-label text-accent-cyan">Share this comparison</p>
      </div>
      <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{ogSnippet}</p>
      <code className="block text-[10px] font-mono text-muted-foreground truncate mb-4">{shareUrl}</code>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => copy('link', shareUrl)}
          className="focus-ring inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-accent-cyan/15 border border-accent-cyan/25 text-accent-cyan hover:bg-accent-cyan/25 transition"
        >
          {copied === 'link' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
          {copied === 'link' ? 'Copied' : 'Copy link'}
        </button>
        <button
          type="button"
          onClick={() => copy('text', buildCompareShareText(comparison))}
          className="focus-ring inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold glass hover:border-accent-violet/30 transition"
        >
          {copied === 'text' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied === 'text' ? 'Copied' : 'Social snippet'}
        </button>
        <button
          type="button"
          onClick={() => copy('markdown', buildCompareShareMarkdown(comparison))}
          className="focus-ring inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold glass hover:border-accent-emerald/30 transition"
        >
          {copied === 'markdown' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
          {copied === 'markdown' ? 'Copied' : 'Markdown'}
        </button>
      </div>
    </div>
  );
}