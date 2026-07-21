import type { UpdateCategory, UpdateHistoryEntry } from '@/lib/types';

const categoryStyle: Record<UpdateCategory, string> = {
  feature: 'text-accent-cyan bg-accent-cyan/10',
  evidence: 'text-accent-emerald bg-accent-emerald/10',
  safety: 'text-accent-rose bg-accent-rose/10',
  content: 'text-accent-violet bg-accent-violet/10',
  design: 'text-accent-amber bg-accent-amber/10',
};

interface UpdateHistoryListProps {
  entries: UpdateHistoryEntry[];
}

export function UpdateHistoryList({ entries }: UpdateHistoryListProps) {
  return (
    <div className="space-y-4" role="feed" aria-label="Platform update history">
      {entries.map((entry) => (
        <article key={`${entry.version}-${entry.date}`} className="card-base p-5 md:p-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="font-mono text-sm font-bold text-foreground">v{entry.version}</span>
            <time className="text-caption">{entry.date}</time>
            <span className={`text-label px-2 py-0.5 rounded-full ${categoryStyle[entry.category]}`}>
              {entry.category}
            </span>
          </div>
          <h3 className="heading-card text-base mb-3">{entry.title}</h3>
          <ul className="space-y-1.5">
            {entry.changes.map((change) => (
              <li key={change} className="text-body-sm flex gap-2">
                <span className="text-accent-emerald shrink-0" aria-hidden="true">•</span>
                {change}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}