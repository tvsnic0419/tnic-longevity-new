import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Network } from 'lucide-react';
import { SystemsPage } from '@/components/library/SystemsPage';
import { PageHeader } from '@/components/ui/PageHeader';
import { PageConnections } from '@/components/ui/PageConnections';
import { clusterFrom } from '@/lib/page-connections';
import { ContinueTrail } from '@/components/ui/WalkCard';

export const metadata: Metadata = {
  // Absolute title so the `%s | TNiC` template doesn't double the brand.
  title: { absolute: 'Systems Synthesis | Hallmarks of Aging — TNiC' },
  description:
    'Explore the cross-hallmark effects, cascade propagation, shared molecular pathways, and emergent synergies across the 12 Hallmarks of Aging. Evidence-graded systems map.',
  // Self-canonical (was inheriting the homepage root canonical).
  alternates: { canonical: '/library/systems' },
  openGraph: {
    title: 'Hallmark Systems Map — TNiC',
    description: 'How do the 12 Hallmarks of Aging interact? Explore leverage scores, cascade effects, and emergent compound synergies.',
  },
};

export default function SystemsRoute() {
  return (
    // The page's identity is rendered HERE, on the server. <SystemsPage/> is a
    // client component that reads ?hallmark= via useSearchParams(), which makes
    // React bail this Suspense boundary to client-side rendering during
    // prerender — the initial HTML carried a BAILOUT_TO_CLIENT_SIDE_RENDERING
    // marker and an empty <main>, so this route published no heading, no prose
    // and no content at all to a crawler or an answer engine. The interactive
    // map stays in the island; what the page *is* no longer depends on JS.
    // See STYLE_GUIDE §14.
    <div className="min-h-screen canvas-scrim pt-6 md:pt-8">
      <div className="max-w-7xl mx-auto px-6">
        <PageHeader
          icon={Network}
          eyebrow="Systems Synthesis"
          title="Hallmark Systems Map"
          description="How do the 12 Hallmarks of Aging interact? Select a hallmark to explore its cross-system effects, molecular leverage score, shared pathways, and emergent synergies."
          theme="violet"
          align="left"
          context={{
            what: 'Cross-hallmark relationships, cascade propagation, and emergent synergy effects for all 12 Hallmarks of Aging.',
            why: 'Targeting one hallmark always ripples. Understanding leverage points and feedback loops lets you design interventions that address multiple hallmarks simultaneously.',
            next: 'Select any hallmark to explore its downstream cascade. High leverage-score hallmarks (mito, senescence, inflammation) affect the most downstream systems.',
          }}
        />
      </div>
      <Suspense fallback={<div className="min-h-screen" aria-busy="true" />}>
        <SystemsPage />
      </Suspense>
      {/* This page's body is a client island, so it server-rendered no
          in-body links at all — a reader arriving from search, and every
          crawler, saw a shell that connected to nothing. */}
      <div className="container-page pb-16">
        <ContinueTrail
          title="From the systems map."
          items={[
            { href: '/library', kicker: 'Explore', title: 'Back to the library', detail: 'Compound grid and hallmark atlas.', accent: 'cyan' },
            { href: '/pathways', kicker: 'Mechanisms', title: 'Pathway deep-dives', detail: 'NRF2, mTOR, SIRT1 and the rest.', accent: 'violet' },
            { href: '/stacks', kicker: 'Decide', title: 'Open Stack Architect', detail: 'Build coverage across connected systems.', accent: 'emerald' },
            { href: '/nico', kicker: 'Start', title: 'Start with NICO', detail: 'Personalize which systems to prioritize.', accent: 'amber' },
          ]}
        />
        <PageConnections cluster={clusterFrom('explore', '/library/systems')} accent="violet" id="systems-explore-connections" />
        <PageConnections cluster={clusterFrom('decide', '/library/systems')} accent="emerald" id="systems-decide-connections" className="mt-6" />
      </div>
    </div>
  );
}
