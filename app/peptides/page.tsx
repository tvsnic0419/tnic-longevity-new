import type { Metadata } from 'next';
import { Syringe } from 'lucide-react';
import { PeptideCard } from '@/components/peptides/PeptideCard';
import { PeptideLegalMatrix } from '@/components/peptides/PeptideLegalMatrix';
import { PageHeader } from '@/components/ui/PageHeader';
import { DisclaimerBanner } from '@/components/trust/DisclaimerBanner';
import { EvidenceTagLegend } from '@/components/trust/EvidenceTag';
import { peptideCategoryMeta, peptideLibrary, getPeptidesByCategory } from '@/lib/peptides-library';
import { disclaimers } from '@/lib/trust';
import { seoRoutes } from '@/lib/seo-routes';
import type { PeptideCategory } from '@/lib/types';

export const metadata: Metadata = seoRoutes.peptidesHub();

const categoryOrder: PeptideCategory[] = ['repair', 'metabolic', 'immune', 'growth-axis', 'mitochondrial'];

/**
 * Server-rendered like the homepage — every peptide name/tagline/category is
 * real crawlable markup, not a client-only shell. No interactive filtering
 * (unlike /library's search/facet UI) since 8 entries don't need it yet.
 */
export default function PeptidesHubPage() {
  const legalDisclaimer = disclaimers.find((d) => d.id === 'peptides-legal-status')!;

  return (
    <div className="py-8 md:py-10">
      <div className="container-page">
        <PageHeader
          icon={Syringe}
          eyebrow="Peptide Library"
          title="Anti-aging peptides, graded honestly."
          description="Eight of the most-discussed longevity peptides — evidence tier, mechanism, dosing patterns reported in the literature, and the legal status of every single one, stated plainly before anything else."
          theme="rose"
        />

        <PeptideLegalMatrix />

        <div className="mx-auto mb-10 mt-10 max-w-3xl md:mb-14">
          <DisclaimerBanner disclaimer={legalDisclaimer} showAppliesTo />
        </div>

        <div className="mx-auto mb-12 max-w-3xl">
          <p className="text-label mb-3 text-muted-foreground">Evidence tiers used on every page</p>
          <EvidenceTagLegend />
        </div>

        {categoryOrder.map((category) => {
          const items = getPeptidesByCategory(category);
          if (items.length === 0) return null;
          const meta = peptideCategoryMeta[category];

          return (
            <section key={category} aria-labelledby={`peptides-${category}-heading`} className="mb-14">
              <div className="mb-5">
                <h2 id={`peptides-${category}-heading`} className="heading-section mb-1 text-xl md:text-2xl">
                  {meta.label}
                </h2>
                <p className="text-body-sm">{meta.description}</p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((peptide) => (
                  <PeptideCard key={peptide.id} peptide={peptide} />
                ))}
              </div>
            </section>
          );
        })}

        <p className="text-caption mx-auto max-w-2xl text-center">
          {peptideLibrary.length} peptides covered · Evidence tiers and legal status reviewed{' '}
          {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} · Not medical advice —
          see full disclaimers.
        </p>
      </div>
    </div>
  );
}
