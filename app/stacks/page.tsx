import { Suspense } from 'react';
import Link from 'next/link';
import { SectionSkeleton } from '@/components/ui/SectionSkeleton';
import { StacksLibrary } from '@/components/stacks/StacksLibrary';
import { StructuredData } from '@/components/seo/StructuredData';
import { CinematicHubHero } from '@/components/viz/CinematicHubHero';
import { seoRoutes } from '@/lib/seo-routes';
import { buildHowToSchema, buildBreadcrumbSchema } from '@/lib/seo';
import { compounds } from '@/lib/data';
import { COMPOUND_COUNT } from '@/lib/library-modules';
import { eliteInterventions } from '@/lib/elite-interventions';
import { stackPresets } from '@/lib/presets';

// Honest stats for the hero — unique undirected synergy edges in the dataset.
const synergyPairs = new Set<string>();
for (const c of compounds) {
  for (const s of c.synergies) synergyPairs.add([c.id, s].sort().join('|'));
}
const stackStats = [
  { value: String(Object.keys(stackPresets).length), label: 'Graded presets' },
  { value: String(COMPOUND_COUNT), label: 'Compounds' },
  { value: String(synergyPairs.size), label: 'Synergy pairs' },
  { value: String(eliteInterventions.length), label: 'Elite interventions' },
];

export const metadata = seoRoutes.stacks();

const stackHowTo = buildHowToSchema({
  name: 'How to Build a Longevity Supplement Stack with TNiC',
  description: 'Evidence-based process for assembling a compound stack targeting specific hallmarks of aging — with synergy scoring, contraindication checks, and protocol export.',
  path: '/stacks',
  totalTime: 'PT15M',
  steps: [
    { name: 'Choose a stack preset or start custom', text: `Select one of ${Object.keys(stackPresets).length} evidence-graded presets (${Object.values(stackPresets).map((p) => p.label).join(', ')}) or add individual compounds.` },
    { name: 'Review synergy connections', text: 'The Stack Architect visualizes compound synergy edges — NMN + Resveratrol (SIRT1 dual activation), GlyNAC + Sulforaphane + R-ALA (NRF2 triad), and 21 other mechanistic pairs.' },
    { name: 'Check for contraindications', text: 'The tool flags known negative interactions (e.g. high-dose NMN + NR simultaneously, Rapamycin + immunosuppressants) and Rx-only compounds requiring physician sign-off.' },
    { name: 'Set dosing and timing schedule', text: 'Each compound has a protocol-matched timing recommendation (AM fasted, with food, PM) based on the clinical trials that established efficacy.' },
    { name: 'Export your protocol', text: 'Generate a printable PDF or JSON export of your complete stack — compound names, doses, timing, synergies, and PubMed references.' },
  ],
});

export default function StacksPage() {
  return (
    <>
      <StructuredData schemas={[
        stackHowTo,
        buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Stack Architect', path: '/stacks' },
        ]),
      ]} />
      <CinematicHubHero
        hue="violet"
        kicker="Stack Architect"
        title={<>Build the stack the <em>evidence</em> would build.</>}
        lead="Presets graded on human trials, live synergy scoring, contraindication flags, and a protocol you can export — assembled from the same dataset that powers every compound module."
        stats={stackStats}
        primary={{ href: '/nico', label: 'Find your personalized stack' }}
        secondary={{ href: '/library', label: 'Browse compounds' }}
      />
      <div className="container-page mt-8">
        <Link
          href="/stacks/lab"
          className="focus-ring interactive block rounded-xl border border-border bg-card/50 px-5 py-4 text-body-sm hover:border-accent-violet/40"
        >
          <span className="text-label mr-2 text-accent-violet">NEW</span>
          <span className="text-foreground">
            Combination Lab — progressive relationship analysis, marginal contribution, and
            explainable scoring for your stack
          </span>
          <span className="ml-1 text-accent-violet" aria-hidden="true">→</span>
        </Link>
      </div>
      <Suspense fallback={<SectionSkeleton height="lg" label="Loading stacks…" />}>
        <StacksLibrary />
      </Suspense>
    </>
  );
}