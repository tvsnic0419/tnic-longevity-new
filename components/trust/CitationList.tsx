import type { SourceCitation as CitationType } from '@/lib/types';
import { SourceCitation } from './SourceCitation';

interface CitationListProps {
  citations: CitationType[];
  title?: string;
  compact?: boolean;
}

export function CitationList({ citations, title = 'Sources', compact = false }: CitationListProps) {
  if (citations.length === 0) return null;

  return (
    <section aria-labelledby={title ? 'citation-list-heading' : undefined}>
      {title && (
        <h3 id="citation-list-heading" className="text-label text-accent-emerald mb-4">
          {title}
        </h3>
      )}
      <div className={compact ? 'flex flex-wrap gap-3' : 'space-y-3'}>
        {citations.map((c) =>
          compact ? (
            <SourceCitation key={c.id} citation={c} compact />
          ) : (
            <SourceCitation key={c.id} citation={c} />
          ),
        )}
      </div>
    </section>
  );
}