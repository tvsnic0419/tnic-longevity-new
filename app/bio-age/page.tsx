import type { Metadata } from 'next';
import { Activity } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
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
    <div className="pb-24">
      <div className="container-page py-12">
          {/* Header */}
          <PageHeader
            icon={Activity}
            eyebrow="Biological Age Engine · v2"
            title="How Old Are Your Cells?"
            description="4 steps. 5 domains. One score that matters more than your birthday. Get your biological age estimate and a personalized anti-aging protocol — calibrated to your actual metrics."
            theme="emerald"
          />
          <div className="flex flex-wrap items-center justify-center gap-6 -mt-6 mb-12 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Metabolic markers
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Inflammatory burden
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-500" />
              NAD+ & hormonal vitality
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-violet-500" />
              Lifestyle optimization
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
    </div>
  );
}
