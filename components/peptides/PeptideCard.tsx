import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Peptide } from '@/lib/types';
import { peptideCategoryMeta } from '@/lib/peptides-library';
import { themes } from '@/lib/design-system';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { PeptideLegalBadge } from './PeptideLegalBadge';

export function PeptideCard({ peptide }: { peptide: Peptide }) {
  const categoryMeta = peptideCategoryMeta[peptide.category];
  const accent = themes[categoryMeta.theme].cssVar;

  return (
    <Link
      href={`/peptides/${peptide.slug}`}
      style={{ ['--card-accent' as string]: accent }}
      className="premium-card focus-ring group h-full gap-3 p-5"
    >
      <div className="flex items-start justify-between gap-2">
        <p className={`text-label ${themes[categoryMeta.theme].text}`}>{categoryMeta.label}</p>
        <ArrowUpRight
          className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:[color:var(--card-accent)]"
          aria-hidden="true"
        />
      </div>
      <h3 className="font-display flex items-center gap-2 text-lg font-medium tracking-tight text-foreground transition-colors group-hover:[color:var(--card-accent)]">
        <span
          aria-hidden="true"
          className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
          style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
        />
        {peptide.name}
      </h3>
      <p className="text-body-sm leading-relaxed line-clamp-2">{peptide.tagline}</p>
      <div className="mt-auto flex flex-wrap gap-2 pt-2">
        <EvidenceTag tier={peptide.evidenceTier} size="sm" />
        <PeptideLegalBadge status={peptide.legalStatus} size="sm" />
      </div>
    </Link>
  );
}
