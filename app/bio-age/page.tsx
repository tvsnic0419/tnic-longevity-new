import type { Metadata } from 'next';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { BioAgeWizard } from '@/components/bio-age/BioAgeWizard';

export const metadata: Metadata = {
  title: 'Biological Age Calculator | TNiC Longevity',
  description:
    'Estimate your biological age across 5 domains — Metabolic, Inflammatory, Hormonal, Mitochondrial, and Lifestyle — and get a personalized anti-aging compound protocol.',
  openGraph: {
    title: 'Biological Age Calculator | TNiC Longevity',
    description: 'How old are your cells? Find out in 4 steps and get your personalized longevity protocol.',
  },
};

export default function BioAgePage() {
  return (
    <div className="min-h-screen canvas-scrim text-foreground">
      <Nav />
      <main id="main-content" tabIndex={-1} className="pt-20 pb-24">
        <div className="container-page py-12">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-emerald/10 border border-accent-emerald/20 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald animate-pulse" />
              <span className="text-xs font-medium text-accent-emerald tracking-widest uppercase">
                Biological Age Engine · v2
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-4">
              How Old Are
              <br />
              <span className="text-accent-emerald">Your Cells?</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              4 steps. 5 domains. One score that matters more than your birthday.
              Get your biological age estimate and a personalized anti-aging protocol —
              calibrated to your actual metrics.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent-emerald" />
                Metabolic markers
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent-amber" />
                Inflammatory burden
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent-cyan" />
                NAD+ & hormonal vitality
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent-violet" />
                Lifestyle optimization
              </div>
            </div>
          </div>

          <BioAgeWizard />

          {/* Science callout */}
          <div className="max-w-2xl mx-auto mt-12 grid sm:grid-cols-3 gap-4 text-center">
            {[
              { label: 'Scoring algorithm', value: 'Levine et al. 2018', sub: 'Aging Cell — PhenoAge methodology' },
              { label: 'Domains scored', value: '5 biomarker clusters', sub: 'Metabolic · Inflammatory · Hormonal · Mito · Lifestyle' },
              { label: 'Data storage', value: 'Browser only', sub: 'Nothing leaves your device' },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-border/50 bg-card/30 p-4">
                <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                <p className="text-sm font-semibold text-foreground">{item.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
