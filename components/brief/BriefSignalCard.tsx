'use client';

import { useState } from 'react';
import { Check, Copy, Share2 } from 'lucide-react';
import type { EvidenceTier } from '@/lib/types';
import { EvidenceTrace } from '@/components/trust/EvidenceTrace';

interface BriefSignalCardProps {
  id: string;
  issueNumber: number;
  date: string;
  headline: string;
  summary: string;
  takeaway: string;
  evidenceTier: EvidenceTier;
  pmids: string[];
}

export function BriefSignalCard({
  id,
  issueNumber,
  date,
  headline,
  summary,
  takeaway,
  evidenceTier,
  pmids,
}: BriefSignalCardProps) {
  const [copied, setCopied] = useState(false);
  const url = typeof window === 'undefined' ? `https://tnic.help/brief#${id}` : `${window.location.origin}/brief#${id}`;
  const shareText = `TNiC Protocol Brief ${String(issueNumber).padStart(2, '0')}: ${headline}\n\n${takeaway}\n\nEvidence: Tier ${evidenceTier} · ${pmids.length} cited ${pmids.length === 1 ? 'source' : 'sources'}`;

  const copySignal = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${url}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      // Clipboard access is best-effort. The rendered issue remains usable.
    }
  };

  const shareSignal = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `Protocol Brief ${String(issueNumber).padStart(2, '0')}`, text: shareText, url });
        return;
      } catch {
        // Native share can be cancelled; copy remains the graceful fallback.
      }
    }
    await copySignal();
  };

  return (
    <section className="card-floating card-shine relative overflow-hidden rounded-3xl p-6 md:p-8" aria-labelledby="featured-signal-title">
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent-violet/15 blur-3xl" aria-hidden="true" />
      <div className="relative">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent-violet/30 bg-accent-violet/10 px-3 py-1.5 text-micro font-mono uppercase tracking-[0.12em] text-accent-violet">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-violet shadow-[0_0_10px_var(--accent-violet)]" aria-hidden="true" />
            This week&apos;s signal
          </div>
          <p className="text-caption font-mono text-muted-foreground">Issue {String(issueNumber).padStart(2, '0')} · {date}</p>
        </div>

        <div className="grid gap-7 lg:grid-cols-[minmax(0,1.35fr)_minmax(16rem,.65fr)] lg:items-end">
          <div>
            <p className="text-label text-accent-violet mb-3">What changed</p>
            <h2 id="featured-signal-title" className="heading-section max-w-3xl">{headline}</h2>
            <p className="text-body-sm mt-4 max-w-3xl leading-relaxed text-muted-foreground">{summary}</p>
          </div>
          <aside className="rounded-2xl border border-accent-violet/25 bg-accent-violet/[0.07] p-5">
            <p className="text-label text-accent-violet mb-2">The signal</p>
            <p className="text-sm font-medium leading-relaxed">{takeaway}</p>
          </aside>
        </div>

        <EvidenceTrace
          tier={evidenceTier}
          sourceCount={pmids.length}
          reviewedLabel="PMID-curated"
          href={`#${id}`}
          className="mt-6 border-accent-violet/20 bg-accent-violet/[0.04]"
        />

        <div className="mt-6 flex flex-wrap gap-3">
          <a href={`#${id}`} className="focus-ring btn-gradient rounded-full text-sm !px-5">
            Read the signal
          </a>
          <button type="button" onClick={shareSignal} className="focus-ring press btn-ghost-premium inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold">
            <Share2 className="h-4 w-4" aria-hidden="true" />
            Share cited card
          </button>
          <button type="button" onClick={copySignal} className="focus-ring press inline-flex items-center gap-2 rounded-full border border-border bg-background/30 px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-accent-violet/40 hover:text-foreground">
            {copied ? <Check className="h-4 w-4 text-accent-emerald" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
            {copied ? 'Copied' : 'Copy signal'}
          </button>
        </div>
        <p className="mt-4 text-caption">Educational research signal, not medical advice. Read the cited source and inspect the linked module before making any decision.</p>
      </div>
    </section>
  );
}
