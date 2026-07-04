'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Scale, ArrowRight, Pill, Layers } from 'lucide-react';
import { evidenceComparisons } from '@/lib/comparisons';
import { EvidenceTag } from '@/components/trust/EvidenceTag';

const categoryIcon = {
  compound: Pill,
  stack: Layers,
  form: Scale,
};

const categoryAccent: Record<string, string> = {
  compound: 'var(--accent-cyan)',
  stack:    'var(--accent-violet)',
  form:     'var(--accent-amber)',
};

export function HomepageCompareRow() {
  return (
    <section className="py-16 md:py-20 border-b border-border bg-background section-glow-cyan">
      <div className="container-page">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <p className="text-label text-accent-cyan mb-3">EVIDENCE TOOLS</p>
            <h2 className="heading-section">
              Head-to-head{' '}
              <span style={{ color: 'var(--accent-cyan)' }}>comparisons</span>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl text-sm leading-relaxed">
              {evidenceComparisons.length} neutral evidence tables — NMN vs NR, Berberine vs Metformin, and more.
              Every row PMID-anchored. Zero shop bias.
            </p>
          </div>
          <Link
            href="/library/compare"
            className="focus-ring inline-flex items-center gap-2 text-sm font-semibold text-accent-cyan border border-accent-cyan/20 bg-accent-cyan/[0.06] px-5 py-2.5 rounded-xl hover:bg-accent-cyan/[0.12] transition shrink-0"
          >
            All {evidenceComparisons.length} comparisons <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {evidenceComparisons.map((comp, i) => {
            const Icon = categoryIcon[comp.category];
            const accent = categoryAccent[comp.category] ?? 'var(--accent-cyan)';

            return (
              <motion.div
                key={comp.slug}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  href={`/library/compare/${comp.slug}`}
                  className="focus-ring group block h-full rounded-2xl border border-border/60 overflow-hidden transition-all duration-300 hover:border-white/15"
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.01) 100%)' }}
                >
                  {/* VS pill header */}
                  <div className="px-5 pt-5 pb-4 border-b border-white/[0.05]">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${accent}18` }}>
                        <Icon className="w-3.5 h-3.5" style={{ color: accent }} />
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: accent }}>
                        {comp.category} · Tier {comp.evidenceTier}
                      </span>
                      <EvidenceTag tier={comp.evidenceTier} size="sm" className="ml-auto" />
                    </div>

                    {/* VS matchup badges */}
                    <div className="flex items-center gap-2">
                      <span
                        className="flex-1 text-center text-xs font-bold py-2 rounded-lg truncate"
                        style={{ background: `${accent}14`, color: accent }}
                      >
                        {comp.labelA}
                      </span>
                      <span className="text-[10px] font-black text-muted-foreground shrink-0 w-7 text-center">
                        VS
                      </span>
                      <span
                        className="flex-1 text-center text-xs font-bold py-2 rounded-lg truncate"
                        style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--foreground)' }}
                      >
                        {comp.labelB}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-sm mb-2 transition-colors group-hover:text-accent-cyan line-clamp-1">
                      {comp.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                      {comp.subtitle}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {comp.rows.length} evidence rows
                      </span>
                      <span
                        className="inline-flex items-center gap-1 text-[11px] font-semibold transition-colors group-hover:gap-2"
                        style={{ color: accent }}
                      >
                        Compare <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom link to guide */}
        <div className="mt-8 text-center">
          <Link
            href="/longevity-supplements-guide"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-accent-cyan transition-colors"
          >
            See all compounds ranked by evidence →{' '}
            <span className="text-accent-cyan font-semibold">Longevity Supplements Guide 2026</span>
          </Link>
        </div>
      </div>
    </section>
  );
}