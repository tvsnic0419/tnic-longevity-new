import { Suspense } from 'react';
import { StacksLibrary } from '@/components/stacks/StacksLibrary';
import { StructuredData } from '@/components/seo/StructuredData';
import { seoRoutes } from '@/lib/seo-routes';
import { buildHowToSchema, buildBreadcrumbSchema } from '@/lib/seo';

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
      <Suspense fallback={<div className="container-page py-20 text-muted-foreground">Loading stacks…</div>}>
        <StacksLibrary />
      </Suspense>
    </>
  );
}