'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SectionShell } from '@/components/SectionShell';
import { JourneyTimeline } from '@/components/trust/JourneyTimeline';
import { journeyMilestones } from '@/lib/journey';

export function JourneySection() {
  return (
    <SectionShell
      id="journey"
      theme="amber"
      badge="Radical Transparency"
      title="The TNiC Journey"
      subtitle="Real N=1 experiments, actual protocol evolution, and honest labeling of personal data vs. population science."
      className="bg-[#0a0f1a]/60"
    >
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="card-base p-6 border-accent-amber/20">
          <p className="text-label text-accent-amber mb-2">Personal (N=1)</p>
          <p className="text-body-sm">
            Founder lab values and subjective outcomes. Sample size = 1. Your results will differ.
          </p>
        </div>
        <div className="card-base p-6">
          <p className="text-label text-accent-emerald mb-2">Population Science</p>
          <p className="text-body-sm">
            PubMed-cited mechanisms with Tier A/B/C evidence on every surface.
          </p>
        </div>
      </div>

      <JourneyTimeline milestones={journeyMilestones} />

      <Link
        href="/trust/journey"
        className="focus-ring interactive inline-flex items-center gap-2 mt-8 text-sm font-semibold text-accent-amber hover:text-accent-cyan rounded"
      >
        Full journey + your personal timeline <ArrowRight className="w-4 h-4" aria-hidden="true" />
      </Link>
    </SectionShell>
  );
}