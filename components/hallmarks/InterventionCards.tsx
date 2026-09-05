import type { HallmarkIntervention } from '@/lib/types';
import { TIER_CHIP_CLASS_STRONG } from '@/lib/trust';
import { compounds } from '@/lib/data';

/**
 * Renders a hallmark's evidence-graded intervention list, sourced from
 * lib/hallmarks-library.ts — the single canonical data set — instead of the
 * hand-maintained arrays each hallmark page used to hardcode independently.
 * Dose comes from the matching Compound record when the intervention has a
 * compoundId; lifestyle/clinical/emerging interventions show a category tag
 * in that slot instead, since they have no dosage to report.
 */

// Evidence-tier chip styling now comes from lib/trust.ts. The comment that
// used to sit here said "must match EvidenceTag / trust.ts" — an import is a
// stronger guarantee than a comment.

const CATEGORY_LABEL: Record<HallmarkIntervention['category'], string> = {
  compound: 'Compound',
  lifestyle: 'Lifestyle',
  clinical: 'Clinical',
  emerging: 'Emerging',
};

export function InterventionCards({ interventions }: { interventions: HallmarkIntervention[] }) {
  const sorted = [...interventions].sort((a, b) => a.rank - b.rank);

  return (
    <div className="space-y-5">
      {sorted.map((iv) => {
        const compound = iv.compoundId ? compounds.find((c) => c.id === iv.compoundId) : undefined;
        return (
          <div key={iv.id} className="premium-card p-6">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className="font-bold text-foreground text-lg">{iv.name}</h3>
              <span className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold ${TIER_CHIP_CLASS_STRONG[iv.evidence]}`}>
                Tier {iv.evidence}
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">{iv.description}</p>
            <div className="flex flex-wrap gap-3 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-card border border-border/60 text-muted-foreground">
                <strong className="text-foreground">{compound ? 'Dose:' : 'Type:'}</strong>{' '}
                {compound ? compound.dose : CATEGORY_LABEL[iv.category]}
              </span>
              {iv.pmid && (
                <a
                  href={`https://pubmed.ncbi.nlm.nih.gov/${iv.pmid}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-card border border-border/60 text-accent-cyan hover:border-accent-cyan/40 transition-colors"
                >
                  PMID {iv.pmid}
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
