import { Suspense } from 'react';
import { StacksLibrary } from '@/components/stacks/StacksLibrary';
import { StructuredData } from '@/components/seo/StructuredData';
import { CinematicHubHero } from '@/components/viz/CinematicHubHero';
import { seoRoutes } from '@/lib/seo-routes';
import { buildHowToSchema, buildBreadcrumbSchema } from '@/lib/seo';
import { compounds } from '@/lib/data';
import { COMPOUND_COUNT } from '@/lib/library-modules';
import { eliteInterventions } from '@/lib/elite-interventions';

// Honest stats for the hero — unique undirected synergy edges in the dataset.
const synergyPairs = new Set<string>();
for (const c of compounds) {
  for (const s of c.synergies) synergyPairs.add([c.id, s].sort().join('|'));
}
const stackStats = [
  { value: '6', label: 'Graded presets' },
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
    { name: 'Choose a stack preset or start custom', text: 'Select one of 6 evidence-graded presets (NRF2 Defense, NAD+ Restoration, Mitochondrial Health, Senolytic Protocol, Foundation Tier, Elite Protocol) or add individual compounds.' },
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
        primary={{ href: '/quiz', label: 'Take The NICO Starter Questionnaire' }}
        secondary={{ href: '/library', label: 'Browse compounds' }}
      />
      <Suspense fallback={<div className="container-page py-20 text-muted-foreground">Loading stacks…</div>}>
        <StacksLibrary />
      </Suspense>
    </>
  );
}