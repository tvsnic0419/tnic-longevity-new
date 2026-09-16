import { Suspense } from 'react';
import { CombinationLab } from '@/components/combination-lab/CombinationLab';
import { StructuredData } from '@/components/seo/StructuredData';
import { CinematicHubHero } from '@/components/viz/CinematicHubHero';
import { HubSplitInstrument } from '@/components/viz/HubSplitInstrument';
import { buildBreadcrumbSchema } from '@/lib/seo';
import { seoRoutes } from '@/lib/seo-routes';
import { COMPOUND_COUNT } from '@/lib/library-modules';
import { hallmarkLibrary } from '@/lib/hallmarks-library';
import { stackInteractions, type InteractionType } from '@/lib/stack-analysis';
import { PageConnections } from '@/components/ui/PageConnections';
import { clusterFrom } from '@/lib/page-connections';
import { ContinueTrail } from '@/components/ui/WalkCard';

// Honest stats for the hero — counted from the real dataset, never invented.
const labStats = [
  { value: String(COMPOUND_COUNT), label: 'Compounds' },
  { value: String(stackInteractions.length), label: 'Curated interactions' },
  { value: String(hallmarkLibrary.length), label: 'Hallmark systems' },
];

export const metadata = seoRoutes.stacksLab();

const INTERACTION_ORDER: InteractionType[] = ['synergy', 'caution', 'contraindication'];
const INTERACTION_META: Record<InteractionType, { label: string; color: string }> = {
  synergy: { label: 'Synergy', color: 'var(--status-optimal)' },
  caution: { label: 'Caution', color: 'var(--status-watch)' },
  contraindication: { label: 'Contraindication', color: 'var(--status-critical)' },
};

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
        figure={
          <HubSplitInstrument
            kicker="Curated interactions"
            total={stackInteractions.length}
            totalLabel="authored pairs"
            rows={INTERACTION_ORDER.map((type) => ({
              key: type,
              label: INTERACTION_META[type].label,
              count: stackInteractions.filter((i) => i.type === type).length,
              color: INTERACTION_META[type].color,
            }))}
            href="/stacks"
            hrefLabel="Back to Stack Architect →"
          />
        }
        figureCaption="Interaction split · derived from the authored pair set"
      />
      <Suspense fallback={<div className="container-page py-20 text-muted-foreground">Loading combination lab…</div>}>
        <CombinationLab />
      </Suspense>
      {/* This page's body is a client island behind Suspense, so it
          server-rendered almost no in-body links — a reader arriving from
          search, and every crawler, saw a shell that connected to nothing. */}
      <div className="container-page pb-16">
        <ContinueTrail
          title="From Combination Lab."
          items={[
            { href: '/stacks', kicker: 'Decide', title: 'Back to Stack Architect', detail: 'Load the scored set into the main builder.', accent: 'violet' },
            { href: '/tools?tab=simulator', kicker: 'Tools', title: 'Run Stack Simulator', detail: 'Pair-level synergy and risk on the same set.', accent: 'cyan' },
            { href: '/shop', kicker: 'Verify', title: 'Verify stack', detail: 'Buyer checklists for the compounds you kept.', accent: 'amber' },
            { href: '/library', kicker: 'Explore', title: 'Explore the library', detail: 'Evidence modules for every compound in the lab.', accent: 'emerald' },
          ]}
        />
        <PageConnections cluster={clusterFrom('decide', '/stacks/lab')} accent="violet" id="stacks-lab-decide-connections" />
        <PageConnections cluster={clusterFrom('verify', '/stacks/lab')} accent="amber" id="stacks-lab-verify-connections" className="mt-6" />
      </div>
    </>
  );
}
