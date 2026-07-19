'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Waypoints, ArrowRight, Orbit } from 'lucide-react';
import { pathways, type PathwayLever } from '@/lib/pathways';
import { compounds } from '@/lib/data';
import { peptideLibrary } from '@/lib/peptides-library';
import { themes } from '@/lib/design-system';
import { PageHeader } from '@/components/ui/PageHeader';
import { PathwayConstellation } from '@/components/library/PathwayConstellation';
import { getHubContext } from '@/lib/hub-context';

function leverLabel(l: PathwayLever): string {
  if (l.compoundId) return compounds.find((c) => c.id === l.compoundId)?.name ?? l.compoundId;
  if (l.peptideId) return peptideLibrary.find((p) => p.id === l.peptideId)?.name ?? l.peptideId;
  return l.name ?? '';
}

export function PathwaysHub() {
  return (
    <section className="py-6 md:py-8">
      <div className="items-center gap-10 lg:grid lg:grid-cols-12">
        <div className="lg:col-span-7">
          <PageHeader
            icon={Waypoints}
            eyebrow="Library · Mechanism Tools"
            title="Molecular Pathways"
            description="Compound and hallmark pages each show one slice of a pathway. This is the cross-cutting view — every compound and peptide lever that engages AMPK, NRF2, the sirtuin/NAD+ axis, mTOR, mitochondrial quality control, and senescence clearance, in one place."
            theme="violet"
            align="left"
            context={getHubContext('pathways')}
          />
          <Link
            href="/library/atlas"
            className="focus-ring interactive mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent-cyan glass glass-hover px-4 py-2 rounded-full glow-hover-cyan transition"
          >
            <Orbit className="w-4 h-4" aria-hidden="true" />
            See all six in the Mechanism Atlas
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>

        {/* Orbital map of all 6 pathways — hover/focus any node for a live
            preview. Same data as the grid below, browsable at a glance
            instead of read serially; the grid stays for full ranked detail. */}
        <div className="mt-8 lg:col-span-5 lg:mt-0">
          <PathwayConstellation />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-10">
        {pathways.map((p, i) => {
          const t = themes[p.theme];
          const primaryLevers = p.levers.filter((l) => l.strength === 'primary');
          return (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`/library/pathways/${p.slug}`}
                className="focus-ring block glass glass-hover rounded-2xl p-6 h-full group"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <span className={`text-[10px] font-mono uppercase tracking-widest ${t.text}`}>
                    {p.keyMolecules.slice(0, 3).join(' · ')}
                  </span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition shrink-0" />
                </div>
                <h2 className={`text-lg font-bold mb-1 group-hover:${t.text} transition-colors`}>
                  {p.name}
                </h2>
                <p className="text-sm text-muted-foreground mb-4">{p.tagline}</p>
                <div className="flex flex-wrap gap-1.5">
                  {primaryLevers.map((l) => (
                    <span
                      key={l.compoundId ?? l.peptideId ?? l.name}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${t.border} ${t.bg} ${t.text}`}
                    >
                      {leverLabel(l)}
                    </span>
                  ))}
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground mt-8 max-w-2xl">
        Pathway relationships are mechanistic synthesis, not a substitute for the evidence tier on each
        underlying compound — check the compound module for the actual human trial data before acting.
      </p>
    </section>
  );
}
