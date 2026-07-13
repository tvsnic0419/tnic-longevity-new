import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StudyRef } from '@/lib/types';

/** A real, verifiable citation — title, journal·year, and a PubMed link. */
export function Citation({ study, className }: { study: StudyRef; className?: string }) {
  return (
    <div className={className}>
      <p className="text-sm font-medium leading-snug mb-1">{study.title}</p>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span className="font-mono">{study.journal} · {study.year}</span>
        <a
          href={`https://pubmed.ncbi.nlm.nih.gov/${study.pmid}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring inline-flex items-center gap-1 text-accent-cyan hover:underline rounded"
        >
          PMID {study.pmid}
          <ExternalLink className="w-3 h-3" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

/** A list of citations with hairline dividers — the canonical evidence block. */
export function CitationList({ studies, className }: { studies: StudyRef[]; className?: string }) {
  return (
    <ul className={cn('divide-y divide-border border border-border rounded-xl overflow-hidden', className)}>
      {studies.map((s) => (
        <li key={s.pmid} className="p-4">
          <Citation study={s} />
        </li>
      ))}
    </ul>
  );
}
