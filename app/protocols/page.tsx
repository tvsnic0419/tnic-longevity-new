import { Compass, Scale, Wand2 } from 'lucide-react';
import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { CinematicHubHero } from '@/components/viz/CinematicHubHero';
import { HubSplitInstrument } from '@/components/viz/HubSplitInstrument';
import { ProtocolExplorer } from '@/components/protocols/ProtocolExplorer';
import { DecisionSteps } from '@/components/ui/DecisionSteps';
import { buildPageMetadata } from '@/lib/seo';
import { protocols } from '@/lib/protocols';
import { hallmarkLibrary } from '@/lib/hallmarks-library';
import { TIER_COLOR_VAR } from '@/lib/trust';
import type { EvidenceTier } from '@/lib/types';

export const metadata = buildPageMetadata({
  title: 'Protocol Library — Evidence-Based Longevity Stacks',
  description:
    'Curated, mechanism-linked supplement protocols — NRF2 defense, NAD⁺ mitochondrial, cardiovascular, senolytic, cognition, metabolic, and more — each with dosing choreography and links to the evidence for every compound.',
  path: '/protocols',
  keywords: [
    'longevity supplement stack',
    'NAD+ stack',
    'NRF2 protocol',
    'senolytic protocol',
    'cardiovascular supplement stack',
    'nootropic stack',
  ],
});

export default function ProtocolsPage() {
  const protocolByTier: Record<EvidenceTier, number> = { A: 0, B: 0, C: 0 };
  for (const p of protocols) protocolByTier[p.evidence] += 1;

  return (
    <SubPageLayout>
      <CinematicHubHero
        hue="violet"
        kicker="The Protocol Library"
        // No PageHeader on this hub, so the cover headline is the page's h1.
        titleAsHeading
        title={<>Stacks that <em>make sense</em>.</>}
        lead="Not a pile of pills — a set of curated, evidence-based protocols where each compound has a job and a time. Every stack targets a specific system, layers compounds that cover each other's gaps, and links to the evidence behind every choice."
        stats={[
          { value: String(protocols.length), label: 'Protocols' },
          { value: 'A–C', label: 'Evidence-graded', href: '/trust/methodology' },
          { value: 'AM/PM', label: 'Timed choreography' },
          { value: String(hallmarkLibrary.length), label: 'Hallmarks covered', href: '/hallmarks' },
        ]}
        primary={{ href: '/stacks', label: 'Build your own in Stack Architect' }}
        secondary={{ href: '/library', label: 'Browse compounds' }}
        figure={
          <HubSplitInstrument
            kicker="Protocol grades"
            total={protocols.length}
            totalLabel="curated stacks"
            rows={(['A', 'B', 'C'] as EvidenceTier[]).map((tier) => ({
              key: tier,
              label: `Tier ${tier}`,
              count: protocolByTier[tier],
              color: TIER_COLOR_VAR[tier],
            }))}
            href="/stacks"
            hrefLabel="Build your own →"
          />
        }
        figureCaption="Evidence split · derived from the protocol registry"
      />

      <div className="container-page pb-20">
        <DecisionSteps
          className="mb-8"
          eyebrow="A considered protocol path"
          title="Each protocol is a plan, not a pile."
          detail="Start with the system you want to understand, inspect its authored structure and evidence context, then use Stack Architect only when you want to explore your own configuration."
          theme="violet"
          steps={[
            { title: 'Choose a system', detail: 'Use a focus lens to orient the curated protocol library.', href: '#protocol-explorer', icon: Compass },
            { title: 'Inspect the structure', detail: 'Compare timing, compound count, targets, and evidence tier.', href: '#protocol-explorer', icon: Scale },
            { title: 'Open the workspace', detail: 'Explore a stack with transparent coverage and interaction checks.', href: '/stacks', icon: Wand2 },
          ]}
        />
        <div id="protocol-explorer">
          <ProtocolExplorer />
        </div>
      </div>
    </SubPageLayout>
  );
}
