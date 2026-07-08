import { ExternalLink } from 'lucide-react';
import type { SourceCitation as CitationType } from '@/lib/types';
import { citationTypeLabels, formatCitationShort, pubmedUrl } from '@/lib/trust';
import { EvidenceTag } from './EvidenceTag';
import type { EvidenceTier } from '@/lib/types';

interface SourceCitationProps {
  citation: CitationType;
  compact?: boolean;
  showType?: boolean;
  evidenceTier?: EvidenceTier;
}

export function SourceCitation({ citation, compact = false, showType = true, evidenceTier }: SourceCitationProps) {
  const link = citation.pmid
    ? pubmedUrl(citation.pmid)
    : citation.doi
      ? `https://doi.org/${citation.doi}`
      : citation.url;

  if (compact) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="focus-ring interactive text-caption text-accent-cyan hover:text-accent-emerald inline-flex items-center gap-1 rounded"
      >
        {formatCitationShort(citation)}
        <ExternalLink className="w-3 h-3 shrink-0" aria-hidden="true" />
        <span className="sr-only">Opens {citation.title} in new tab</span>
      </a>
    );
  }

  return (
    <article className="card-base p-4 md:p-5">
      <div className="flex flex-wrap items-start gap-2 mb-2">
        {evidenceTier && <EvidenceTag tier={evidenceTier} size="sm" />}
        {showType && (
          <span className="text-label text-muted-foreground">{citationTypeLabels[citation.type]}</span>
        )}
      </div>
      <h4 className="heading-card mb-1 leading-snug">{citation.title}</h4>
      <p className="text-caption mb-2">
        {citation.authors && <span>{citation.authors} · </span>}
        <em>{citation.journal}</em> · {citation.year}
      </p>
      {citation.summary && (
        <p className="text-body-sm mb-3">{citation.summary}</p>
      )}
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring interactive text-sm font-semibold text-accent-cyan hover:text-accent-emerald inline-flex items-center gap-1.5 rounded"
        >
          {citation.pmid ? `PubMed ${citation.pmid}` : 'View source'}
          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
        </a>
      )}
    </article>
  );
}

/** Quick PMID link when full citation object isn't needed */
export function PmidLink({ pmid, label }: { pmid: string; label?: string }) {
  return (
    <a
      href={pubmedUrl(pmid)}
      target="_blank"
      rel="noopener noreferrer"
      className="focus-ring interactive text-caption text-accent-cyan hover:text-accent-emerald inline-flex items-center gap-1 rounded"
    >
      {label ?? `PMID: ${pmid}`}
      <ExternalLink className="w-3 h-3" aria-hidden="true" />
    </a>
  );
}