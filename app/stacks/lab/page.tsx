import { Suspense } from 'react';
import { CombinationLab } from '@/components/combination-lab/CombinationLab';
import { StructuredData } from '@/components/seo/StructuredData';
import { CinematicHubHero } from '@/components/viz/CinematicHubHero';
import { buildBreadcrumbSchema } from '@/lib/seo';
import { seoRoutes } from '@/lib/seo-routes';
import { COMPOUND_COUNT } from '@/lib/library-modules';
import { hallmarkLibrary } from '@/lib/hallmarks-library';
import { stackInteractions } from '@/lib/stack-analysis';

// Honest stats for the hero — counted from the real dataset, never invented.
const labStats = [
  { value: String(COMPOUND_COUNT), label: 'Compounds' },
  { value: String(stackInteractions.length), label: 'Curated interactions' },
  { value: String(hallmarkLibrary.length), label: 'Hallmark systems' },
];

export const metadata = seoRoutes.stacksLab();

export default function CombinationLabPage() {
  return (
    <>
      <StructuredData
        schemas={[
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Stack Architect', path: '/stacks' },
            { name: 'Combination Lab', path: '/stacks/lab' },
          ]),
        ]}
      />
      <CinematicHubHero
        hue="violet"
        kicker="Combination Lab"
        title={
          <>
            Watch what each addition <em>actually</em> changes.
          </>
        }
        lead="Add compounds one at a time and see every pair classified — synergy, complementarity, redundancy, antagonism — with the marginal contribution and the full score itemized. Curated interactions are marked demonstrated; ontology-derived links are labeled as the mechanistic hypotheses they are."
        stats={labStats}
        primary={{ href: '#lab', label: 'Open the lab' }}
        secondary={{ href: '/stacks', label: 'Back to Stack Architect' }}
      />
      <Suspense fallback={<div className="container-page py-20 text-muted-foreground">Loading combination lab…</div>}>
        <CombinationLab />
      </Suspense>
    </>
  );
}
