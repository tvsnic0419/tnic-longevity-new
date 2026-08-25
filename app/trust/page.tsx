import { TrustHub } from '@/components/trust/TrustHub';
import { HALLMARK_COUNT } from '@/lib/stats';
import { StructuredData } from '@/components/seo/StructuredData';
import { CinematicHubHero } from '@/components/viz/CinematicHubHero';
import { seoRoutes } from '@/lib/seo-routes';
import { buildBreadcrumbSchema, buildOrganizationSchema } from '@/lib/seo';
import { compounds } from '@/lib/data/compounds';
import { COMPOUND_COUNT } from '@/lib/library-modules';

// Real citation depth — unique PMIDs cited across every graded compound.
const pmidSet = new Set<string>();
for (const c of compounds) {
  for (const s of c.studies) if (s.pmid) pmidSet.add(s.pmid);
}

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
          { value: String(COMPOUND_COUNT), label: 'Compounds graded' },
          { value: String(pmidSet.size), label: 'PubMed citations' },
          { value: 'A–C', label: 'Evidence tiers' },
          { value: String(HALLMARK_COUNT), label: 'Hallmarks of aging' },
        ]}
        primary={{ href: '/trust/methodology', label: 'How we grade the evidence' }}
      />
      <TrustHub />
    </>
  );
}