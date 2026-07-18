import Link from 'next/link';
import { peptideLibrary, peptideCategoryMeta } from '@/lib/peptides-library';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { PeptideLegalBadge } from './PeptideLegalBadge';
import { themes } from '@/lib/design-system';

/**
 * Page-specific replacement for the generic What/Why/Next context rail — all
 * 8 peptides' evidence tier and legal status at a glance, in one table,
 * before anyone reads a single mechanism paragraph.
 */
export function PeptideLegalMatrix() {
  return (
    <div className="mt-8 mx-auto max-w-3xl" role="group" aria-label="Peptide evidence and legal status matrix">
      <p className="text-label mb-4 text-center">Every peptide, tier and legal status at a glance</p>
      <div className="rounded-2xl glass overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[560px]">
          <thead>
            <tr className="border-b border-border/60 text-caption uppercase tracking-wide">
              <th scope="col" className="px-4 py-3 font-medium">Peptide</th>
              <th scope="col" className="px-4 py-3 font-medium">Category</th>
              <th scope="col" className="px-4 py-3 font-medium">Evidence</th>
              <th scope="col" className="px-4 py-3 font-medium">Legal status</th>
            </tr>
          </thead>
          <tbody>
            {peptideLibrary.map((peptide) => {
              const categoryMeta = peptideCategoryMeta[peptide.category];
              return (
                <tr key={peptide.id} className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/peptides/${peptide.slug}`} className="focus-ring interactive font-semibold text-foreground hover:text-accent-rose rounded">
                      {peptide.name}
                    </Link>
                  </td>
                  <td className={`px-4 py-3 text-xs ${themes[categoryMeta.theme].text}`}>{categoryMeta.label}</td>
                  <td className="px-4 py-3">
                    <EvidenceTag tier={peptide.evidenceTier} size="sm" showTooltip={false} />
                  </td>
                  <td className="px-4 py-3">
                    <PeptideLegalBadge status={peptide.legalStatus} size="sm" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
