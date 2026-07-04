'use client';

import Link from 'next/link';
import { ArrowRight, Scale, ExternalLink } from 'lucide-react';
import type { EvidenceComparison, CompareVerdict } from '@/lib/comparisons';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { CompareShareCard } from '@/components/library/CompareShareCard';
import { cn } from '@/lib/utils';

const verdictStyle: Record<CompareVerdict, string> = {
  a: 'text-accent-cyan bg-accent-cyan/10 border-accent-cyan/20',
  b: 'text-accent-violet bg-accent-violet/10 border-accent-violet/20',
  tie: 'text-accent-emerald bg-accent-emerald/10 border-accent-emerald/20',
  context: 'text-accent-amber bg-accent-amber/10 border-accent-amber/20',
};

const verdictLabel: Record<CompareVerdict, (a: string, b: string) => string> = {
  a: (a) => `${a} edge`,
  b: (_, b) => `${b} edge`,
  tie: () => 'Even',
  context: () => 'Depends on goal',
};

interface EvidenceCompareTableProps {
  comparison: EvidenceComparison;
}

export function EvidenceCompareTable({ comparison }: EvidenceCompareTableProps) {
  const { labelA, labelB, rows } = comparison;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-3">
        <EvidenceTag tier={comparison.evidenceTier} size="md" />
        <span className="text-caption font-mono capitalize">{comparison.category} comparison</span>
      </div>

      <p className="text-body-sm text-muted-foreground leading-relaxed max-w-3xl">
        {comparison.summary}
      </p>

      <div className="rounded-2xl border border-border overflow-hidden">
        <div className="grid grid-cols-[1.2fr_1fr_1fr_auto] gap-0 bg-muted/30 border-b border-border text-[10px] font-mono uppercase tracking-wider">
          <div className="p-4 text-muted-foreground">Dimension</div>
          <div className="p-4 text-accent-cyan border-l border-border">{labelA}</div>
          <div className="p-4 text-accent-violet border-l border-border">{labelB}</div>
          <div className="p-4 text-muted-foreground border-l border-border hidden sm:block w-28">Verdict</div>
        </div>

        {rows.map((row, i) => (
          <div
            key={row.dimension}
            className={cn(
              'grid grid-cols-1 sm:grid-cols-[1.2fr_1fr_1fr_auto] gap-0 border-b border-border last:border-b-0',
              i % 2 === 0 ? 'bg-card/20' : 'bg-transparent',
            )}
          >
            <div className="p-4 sm:border-r border-border">
              <p className="text-sm font-semibold">{row.dimension}</p>
              {row.note && (
                <p className="text-xs text-muted-foreground mt-1">{row.note}</p>
              )}
            </div>
            <div className="p-4 border-t sm:border-t-0 sm:border-r border-border">
              <p className="text-[10px] font-mono text-accent-cyan sm:hidden mb-1">{labelA}</p>
              <p className="text-sm text-muted-foreground">{row.a}</p>
            </div>
            <div className="p-4 border-t sm:border-t-0 sm:border-r border-border">
              <p className="text-[10px] font-mono text-accent-violet sm:hidden mb-1">{labelB}</p>
              <p className="text-sm text-muted-foreground">{row.b}</p>
            </div>
            <div className="p-4 border-t sm:border-t-0 border-border flex items-start gap-2">
              <span
                className={cn(
                  'text-[10px] font-mono px-2 py-1 rounded-full border shrink-0',
                  verdictStyle[row.verdict],
                )}
              >
                {verdictLabel[row.verdict](labelA, labelB)}
              </span>
              {row.pmid && (
                <a
                  href={`https://pubmed.ncbi.nlm.nih.gov/${row.pmid}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-mono text-muted-foreground hover:text-accent-cyan inline-flex items-center gap-0.5"
                >
                  PMID <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="gradient-border p-6">
        <div className="flex items-center gap-2 mb-2">
          <Scale className="w-4 h-4 text-accent-emerald" />
          <p className="text-label text-accent-emerald">TNiC verdict</p>
        </div>
        <p className="text-sm leading-relaxed">{comparison.verdict}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass rounded-xl p-5">
          <p className="text-label text-accent-cyan mb-3">Choose {labelA} when</p>
          <ul className="space-y-2">
            {comparison.whenChooseA.map((item) => (
              <li key={item} className="text-sm text-muted-foreground flex gap-2">
                <ArrowRight className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="glass rounded-xl p-5">
          <p className="text-label text-accent-violet mb-3">Choose {labelB} when</p>
          <ul className="space-y-2">
            {comparison.whenChooseB.map((item) => (
              <li key={item} className="text-sm text-muted-foreground flex gap-2">
                <ArrowRight className="w-4 h-4 text-accent-violet shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <CompareShareCard comparison={comparison} />

      <div className="flex flex-wrap gap-3">
        {comparison.relatedHrefs.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="focus-ring interactive glass glass-hover px-4 py-2 rounded-lg text-sm font-semibold"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}