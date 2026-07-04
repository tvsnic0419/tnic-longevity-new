'use client';

import Link from 'next/link';
import { Newspaper, ExternalLink, ArrowRight, Radio } from 'lucide-react';
import { getAllBriefIssues } from '@/lib/brief-research-sync';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { PageHeader } from '@/components/ui/PageHeader';
import { BriefSubscribePanel } from './BriefSubscribePanel';
import { getHubContext } from '@/lib/hub-context';

const allIssues = getAllBriefIssues();
const researchCount = allIssues.filter((i) => i.source === 'research-intel').length;

export function ProtocolBriefHub() {
  return (
    <div>
      <PageHeader
        icon={Newspaper}
        eyebrow="Protocol Brief · Research Digest"
        title="PMID-Curated Drops"
        description={`Weekly research summaries tied to library updates — ${allIssues.length} issues in rotation (${researchCount} synced from Research Intel). Every headline links to actionable modules.`}
        theme="violet"
        align="left"
        context={getHubContext('brief')}
      />

      <BriefSubscribePanel />

      <div className="space-y-6">
        {allIssues.map((entry, i) => (
          <article
            key={entry.id}
            id={entry.id}
            className="glass rounded-2xl p-6 md:p-8 border border-border/80 scroll-mt-24"
          >
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <time className="text-caption font-mono">{entry.date}</time>
              <EvidenceTag tier={entry.evidenceTier} size="sm" />
              {i === 0 && (
                <span className="text-[10px] font-mono text-accent-violet uppercase tracking-wider">
                  Latest
                </span>
              )}
              {entry.source === 'research-intel' && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-accent-cyan uppercase tracking-wider">
                  <Radio className="w-3 h-3" aria-hidden="true" />
                  Research Intel sync
                </span>
              )}
            </div>

            <h2 className="text-xl font-bold mb-2">{entry.headline}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{entry.summary}</p>

            <div className="rounded-lg bg-accent-violet/5 border border-accent-violet/20 p-4 mb-4">
              <p className="text-label text-accent-violet mb-1">Takeaway</p>
              <p className="text-sm font-medium">{entry.takeaway}</p>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {entry.pmids.map((pmid) => (
                <a
                  key={pmid}
                  href={`https://pubmed.ncbi.nlm.nih.gov/${pmid}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring inline-flex items-center gap-1 text-[10px] font-mono text-muted-foreground hover:text-accent-cyan px-2 py-1 rounded bg-muted/50"
                >
                  PMID {pmid} <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {entry.libraryHrefs.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="focus-ring interactive text-xs font-semibold text-accent-cyan hover:underline inline-flex items-center gap-1"
                >
                  {link.label} <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </Link>
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-border/60">
              {entry.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-mono text-muted-foreground bg-muted/40 px-2 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}