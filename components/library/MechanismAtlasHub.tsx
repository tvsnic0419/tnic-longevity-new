'use client';

import Link from 'next/link';
import { Network, ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { MechanismAtlas } from '@/components/library/MechanismAtlas';
import { getHubContext } from '@/lib/hub-context';
import { mechanismAtlas } from '@/lib/mechanism-atlas';

const RELATED = [
  { href: '/library', label: 'The 12 Hallmarks', sub: 'Full mechanism + ranked interventions for each' },
  { href: '/library/pathways', label: 'The 6 Pathways', sub: 'Every lever on each convergence pathway, with synthesis' },
  { href: '/library/compounds/nmn', label: 'Compound modules', sub: 'Dosing, evidence tiers, and monitoring for each lever' },
  { href: '/peptides', label: 'The Peptides Library', sub: 'Evidence tier and legal status for the peptide levers' },
];

export function MechanismAtlasHub() {
  const { hallmarks, pathways, levers } = mechanismAtlas;

  return (
    <section className="py-6 md:py-8">
      <PageHeader
        icon={Network}
        eyebrow="Library · Mechanism Tools"
        title="The Mechanism Atlas"
        description="Every hallmark of aging, every convergence pathway, and every compound and peptide lever TNiC covers — in one wired map. Trace any hallmark to the levers that reach it, or any lever back to the biology it touches."
        theme="cyan"
        align="left"
        context={getHubContext('atlas')}
      />

      <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
        <span className="px-2.5 py-1 rounded-full border border-accent-cyan/25 bg-accent-cyan/5 text-accent-cyan">
          {hallmarks.length} hallmarks
        </span>
        <span className="px-2.5 py-1 rounded-full border border-accent-violet/25 bg-accent-violet/5 text-accent-violet">
          {pathways.length} pathways
        </span>
        <span className="px-2.5 py-1 rounded-full border border-accent-emerald/25 bg-accent-emerald/5 text-accent-emerald">
          {levers.length} levers
        </span>
      </div>

      <div className="mt-6">
        <MechanismAtlas />
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mt-10">
        {RELATED.map((r) => (
          <Link
            key={r.href}
            href={r.href}
            className="focus-ring interactive group flex items-start justify-between gap-3 glass glass-hover rounded-xl p-4"
          >
            <span>
              <span className="block text-sm font-semibold text-foreground group-hover:text-accent-cyan transition-colors">
                {r.label}
              </span>
              <span className="block text-xs text-muted-foreground mt-0.5">{r.sub}</span>
            </span>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent-cyan group-hover:translate-x-0.5 transition shrink-0 mt-0.5" />
          </Link>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-8 max-w-2xl">
        Every edge in this atlas is derived from the pathway data, not authored separately — a lever connects to a
        hallmark only when a convergence pathway genuinely links them. Relationships are mechanistic synthesis; always
        confirm the evidence tier on each compound module before acting.
      </p>
    </section>
  );
}
