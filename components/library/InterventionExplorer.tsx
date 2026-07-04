'use client';

import { useState, useMemo } from 'react';
import { Filter } from 'lucide-react';
import type { HallmarkIntervention } from '@/lib/types';
import { compounds } from '@/lib/data';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { PmidLink } from '@/components/trust/SourceCitation';

const categoryLabels = {
  compound: 'Compound',
  lifestyle: 'Lifestyle',
  clinical: 'Clinical',
  emerging: 'Emerging',
};

export function InterventionExplorer({
  interventions,
  hallmarkTitle,
}: {
  interventions: HallmarkIntervention[];
  hallmarkTitle: string;
}) {
  const [filter, setFilter] = useState<'all' | HallmarkIntervention['category']>('all');
  const [tnicOnly, setTnicOnly] = useState(false);

  const sorted = useMemo(() => {
    let list = [...interventions].sort((a, b) => a.rank - b.rank);
    if (filter !== 'all') list = list.filter((i) => i.category === filter);
    if (tnicOnly) list = list.filter((i) => i.tnicAvailable);
    return list;
  }, [interventions, filter, tnicOnly]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <Filter className="w-4 h-4 text-muted-foreground" />
        {(['all', 'compound', 'lifestyle', 'clinical', 'emerging'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold transition ${
              filter === cat ? 'bg-accent-cyan text-black' : 'glass text-muted-foreground hover:text-foreground'
            }`}
          >
            {cat === 'all' ? 'All' : categoryLabels[cat]}
          </button>
        ))}
        <label className="flex items-center gap-2 text-[10px] text-muted-foreground ml-auto cursor-pointer">
          <input
            type="checkbox"
            checked={tnicOnly}
            onChange={(e) => setTnicOnly(e.target.checked)}
            className="accent-cyan-400"
          />
          TNiC compounds only
        </label>
      </div>

      <div className="space-y-2">
        {sorted.map((item) => (
          <div
            key={item.id}
            className={`glass rounded-xl p-4 flex gap-4 ${item.tnicAvailable ? 'border border-accent-cyan/10' : ''}`}
          >
            <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center shrink-0 font-mono text-sm font-bold text-muted-foreground">
              {item.rank}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h4 className="font-semibold text-sm">{item.name}</h4>
                <EvidenceTag tier={item.evidence} size="sm" />
                <span className="text-[10px] text-caption">{categoryLabels[item.category]}</span>
                {item.tnicAvailable && (
                  <span className="text-[10px] text-accent-cyan font-semibold">IN TNiC STACK</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
              <div className="flex flex-wrap gap-3 mt-2">
                <span className="text-[10px] font-mono text-caption">Impact: {item.impact}/10</span>
                {item.compoundId && (
                  <a href={`/#compounds`} className="text-[10px] text-accent-violet hover:underline">
                    View {compounds.find((c) => c.id === item.compoundId)?.name}
                  </a>
                )}
                {item.pmid && <PmidLink pmid={item.pmid} />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {sorted.length === 0 && (
        <p className="text-sm text-muted-foreground py-6 text-center">
          No interventions match filters for {hallmarkTitle}.
        </p>
      )}
    </div>
  );
}