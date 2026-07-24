import Link from 'next/link';
import type { HallmarkIntervention } from '@/lib/types';
import { compounds } from '@/lib/data';
import { libraryModules, getModulePath } from '@/lib/library-modules';

/**
 * Renders a hallmark's evidence-graded intervention list, sourced from
 * lib/hallmarks-library.ts — the single canonical data set — instead of the
 * hand-maintained arrays each hallmark page used to hardcode independently.
 * Dose comes from the matching Compound record when the intervention has a
 * compoundId; lifestyle/clinical/emerging interventions show a category tag
 * in that slot instead, since they have no dosage to report.
 */

// Canonical evidence-tier colors — must match EvidenceTag / trust.ts
// (A = clinical/emerald, B = emerging/cyan, C = preclinical/amber).
const TIER_CLASSES: Record<HallmarkIntervention['evidence'], string> = {
  A: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  B: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30',
  C: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
};

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
        const libraryModule = iv.compoundId
          ? libraryModules.find((m) => m.compoundId === iv.compoundId)
          : undefined;
        const href = libraryModule ? getModulePath(libraryModule) : undefined;
        return (
          <div key={iv.id} className="rounded-2xl border border-border/60 bg-card/40 p-6">
            <div className="flex items-start justify-between gap-4 mb-3">
              {href ? (
                <Link
                  href={href}
                  className="font-bold text-foreground text-lg hover:text-cyan-400 transition-colors underline decoration-dotted decoration-muted-foreground/40 underline-offset-4"
                >
                  {iv.name}
                </Link>
              ) : (
                <h3 className="font-bold text-foreground text-lg">{iv.name}</h3>
              )}
              <span className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold ${TIER_CLASSES[iv.evidence]}`}>
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
                  className="px-2.5 py-1 rounded-lg bg-card border border-border/60 text-cyan-400 hover:border-cyan-500/40 transition-colors"
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
