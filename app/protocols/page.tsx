import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { CinematicHubHero } from '@/components/viz/CinematicHubHero';
import { ProtocolCard } from '@/components/protocols/ProtocolCard';
import { RevealItem } from '@/components/ui/RevealItem';
import { buildPageMetadata } from '@/lib/seo';
import { protocols } from '@/lib/protocols';

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
  return (
    <SubPageLayout>
      <CinematicHubHero
        hue="violet"
        kicker="The Protocol Library"
        title={<>Stacks that <em>make sense</em>.</>}
        lead="Not a pile of pills — a set of curated, evidence-based protocols where each compound has a job and a time. Every stack targets a specific system, layers compounds that cover each other's gaps, and links to the evidence behind every choice."
        stats={[
          { value: String(protocols.length), label: 'Protocols' },
          { value: 'A–C', label: 'Evidence-graded' },
          { value: 'AM/PM', label: 'Timed choreography' },
          { value: '12', label: 'Hallmarks covered' },
        ]}
        primary={{ href: '/stacks', label: 'Build your own in Stack Architect' }}
        secondary={{ href: '/library', label: 'Browse compounds' }}
      />

      <div className="container-page pb-20">
        <div className="mb-10 max-w-2xl">
          <p className="text-label text-accent-violet mb-3">How to read these</p>
          <h2 className="heading-section mb-3">Each protocol is a plan, not a pile.</h2>
          <div className="heading-accent-rule mb-4" aria-hidden="true" />
          <p className="text-body">
            Every stack shows what each compound does, when to take it, and which hallmarks of aging
            it targets. Start with one that matches your goal, tap any compound to read its evidence,
            and talk to a clinician before you begin.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {protocols.map((p, i) => (
            <RevealItem key={p.slug} index={i} className="h-full">
              <ProtocolCard protocol={p} />
            </RevealItem>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start gap-3 rounded-2xl border border-border/70 bg-card/30 p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-body-sm max-w-xl text-muted-foreground">
            Want a stack tuned to your own goals, biomarkers, and safety profile? The Stack Architect
            builds one for you — with synergy scoring and contraindication checks.
          </p>
          <Link
            href="/stacks"
            className="btn-gradient focus-ring group shrink-0 justify-center rounded-full text-sm !py-3 !px-6"
          >
            Open Stack Architect
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </SubPageLayout>
  );
}
