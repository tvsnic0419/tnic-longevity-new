'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Scale, ArrowRight, Pill, Layers } from 'lucide-react';
import { evidenceComparisons } from '@/lib/comparisons';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { CompareShareCard } from '@/components/library/CompareShareCard';
import { PageHeader } from '@/components/ui/PageHeader';

const categoryIcon = {
  compound: Pill,
  stack: Layers,
  form: Scale,
};

export function CompareHub() {
  return (
    <section className="py-6 md:py-8">
      <PageHeader
        icon={Scale}
        eyebrow="Library · Evidence Tools"
        title="Evidence Comparison Tables"
        description="Neutral head-to-head tables — NMN vs NR, stack vs stack, form vs form. Every row anchored to PMID literature or honest mechanistic gaps. No shop bias."
        theme="cyan"
        align="left"
      />

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        {evidenceComparisons.map((comp, i) => {
          const Icon = categoryIcon[comp.category];
          return (
            <motion.div
              key={comp.slug}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`/library/compare/${comp.slug}`}
                className="focus-ring block glass glass-hover rounded-2xl p-6 h-full group"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-accent-cyan" />
                    <span className="text-[10px] font-mono text-muted-foreground uppercase">
                      {comp.category}
                    </span>
                  </div>
                  <EvidenceTag tier={comp.evidenceTier} size="sm" />
                </div>
                <h2 className="text-lg font-bold mb-1 group-hover:text-accent-cyan transition">
                  {comp.title}
                </h2>
                <p className="text-sm text-muted-foreground mb-4">{comp.subtitle}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-accent-violet">
                    {comp.labelA} vs {comp.labelB}
                  </span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent-cyan group-hover:translate-x-1 transition" />
                </div>
                <CompareShareCard comparison={comp} compact />
              </Link>
            </motion.div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground mt-8 max-w-2xl">
        Comparisons are educational — not medical advice. When trials conflict, we label Tier honestly and
        recommend labs over marketing.
      </p>
    </section>
  );
}