import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Peptide } from '@/lib/types';
import { peptideCategoryMeta } from '@/lib/peptides-library';
import { themes } from '@/lib/design-system';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { PeptideLegalBadge } from './PeptideLegalBadge';

export function PeptideCard({ peptide }: { peptide: Peptide }) {
  const categoryMeta = peptideCategoryMeta[peptide.category];

  return (
    <Link
      href={`/peptides/${peptide.slug}`}
      className="focus-ring interactive glass glass-hover group flex h-full flex-col gap-3 rounded-2xl p-5"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className={`text-label ${themes[categoryMeta.theme].text}`}>{categoryMeta.label}</p>
          <p className="text-[10px] font-mono text-muted-foreground/70 mt-0.5">{peptide.pathway}</p>
        </div>
        <ArrowUpRight
          className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
          aria-hidden="true"
        />
      </div>
      <h3 className="heading-card text-base">{peptide.name}</h3>
      <p className="text-body-sm leading-relaxed line-clamp-2">{peptide.tagline}</p>
      <div className="mt-auto flex flex-wrap gap-2 pt-2">
        <EvidenceTag tier={peptide.evidenceTier} size="sm" />
        <PeptideLegalBadge status={peptide.legalStatus} size="sm" />
      </div>
    </Link>
  );
}
