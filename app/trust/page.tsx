import { TrustHub } from '@/components/trust/TrustHub';
import { StructuredData } from '@/components/seo/StructuredData';
import { CinematicHubHero } from '@/components/viz/CinematicHubHero';
import { HubSplitInstrument } from '@/components/viz/HubSplitInstrument';
import { seoRoutes } from '@/lib/seo-routes';
import { buildBreadcrumbSchema, buildOrganizationSchema } from '@/lib/seo';
import { compounds } from '@/lib/data';
import { COMPOUND_COUNT } from '@/lib/library-modules';
import { hallmarkLibrary } from '@/lib/hallmarks-library';
import { TIER_COLOR_VAR } from '@/lib/trust';
import type { EvidenceTier } from '@/lib/types';

// Real citation depth — unique PMIDs cited across every graded compound.
const pmidSet = new Set<string>();
for (const c of compounds) {
  for (const s of c.studies) if (s.pmid) pmidSet.add(s.pmid);
}
const trustByTier: Record<EvidenceTier, number> = { A: 0, B: 0, C: 0 };
for (const c of compounds) trustByTier[c.evidence] += 1;

export const metadata = seoRoutes.trust();

function buildTrustSchemas() {
  return [
    buildOrganizationSchema(),
    buildBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Trust', path: '/trust' },
    ]),
  ];
}

export default function TrustPage() {
  return (
    <>
      <StructuredData schemas={buildTrustSchemas()} />
      <CinematicHubHero
        hue="emerald"
        kicker="Trust Center"
        title={<>Evidence you can <em>audit</em>.</>}
        lead="Every grade, dose, and claim traces back to named human trials — with a public methodology, a corrections log, and no pay-for-placement, ever."
        stats={[
          { value: String(COMPOUND_COUNT), label: 'Compounds graded', href: '/library/compounds' },
          { value: String(pmidSet.size), label: 'PubMed citations' },
          { value: 'A–C', label: 'Evidence tiers', href: '/trust/methodology' },
          { value: String(hallmarkLibrary.length), label: 'Hallmarks of aging', href: '/hallmarks' },
        ]}
        primary={{ href: '/trust/methodology', label: 'How we grade the evidence' }}
        secondary={{ href: '/corrections', label: 'Corrections log' }}
        figure={
          <HubSplitInstrument
            kicker="Graded compounds"
            total={compounds.length}
            totalLabel="in the scored set"
            rows={(['A', 'B', 'C'] as EvidenceTier[]).map((tier) => ({
              key: tier,
              label: `Tier ${tier}`,
              count: trustByTier[tier],
              color: TIER_COLOR_VAR[tier],
            }))}
            href="/trust/methodology"
            hrefLabel="How we grade →"
          />
        }
        figureCaption="Evidence split · derived from the scored compound set"
      />
      <TrustHub />
    </>
  );
}