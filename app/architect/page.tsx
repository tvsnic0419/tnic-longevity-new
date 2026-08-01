import { Suspense } from 'react';
import { ProtocolConstellation } from '@/components/architect/ProtocolConstellation';
import { CinematicHubHero } from '@/components/viz/CinematicHubHero';
import { StructuredData } from '@/components/seo/StructuredData';
import { seoRoutes } from '@/lib/seo-routes';
import { buildBreadcrumbSchema } from '@/lib/seo';
import { compounds } from '@/lib/data/compounds';
import { hallmarks } from '@/lib/data/hallmarks';

export const metadata = seoRoutes.architect();

const synergyPairs = new Set<string>();
for (const c of compounds) {
  for (const s of c.synergies) synergyPairs.add([c.id, s].sort().join('|'));
}

const architectStats = [
  { value: String(compounds.length), label: 'Compounds mapped' },
  { value: String(hallmarks.length), label: 'Hallmarks of aging' },
  { value: String(synergyPairs.size), label: 'Synergy pairs' },
];

export default function ArchitectPage() {
  return (
    <>
      <StructuredData
        schemas={[
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'The Protocol Constellation', path: '/architect' },
          ]),
        ]}
      />
      <CinematicHubHero
        hue="cyan"
        kicker="The Protocol Constellation"
        title={<>Every compound, mapped to the <em>hallmark</em> it targets.</>}
        lead="Twelve hallmarks of aging anchor the map. Every evidence-graded compound threads to the ones it addresses — select compounds to build a protocol, and watch synergy connections light up between them in real time."
        stats={architectStats}
        primary={{ href: '/quiz', label: 'Not sure where to start? Take The Nico Starter Questionnaire' }}
        secondary={{ href: '/stacks', label: 'Go to Stack Architect' }}
      />
      <div className="container-page py-12 md:py-16">
        <Suspense fallback={<div className="py-20 text-center text-muted-foreground">Loading constellation…</div>}>
          <ProtocolConstellation />
        </Suspense>
      </div>
    </>
  );
}
