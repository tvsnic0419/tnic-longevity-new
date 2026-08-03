'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Dna, Network, Pill } from 'lucide-react';
import Link from 'next/link';
import type { HallmarkLibraryEntry } from '@/lib/types';
import type { CompoundLink } from '@/lib/library-graph';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { PageHeader } from '@/components/ui/PageHeader';
import { RevealCard } from '@/components/ui/RevealCard';
import { HallmarkVisual } from './HallmarkVisual';
import { getHallmarkVisual } from '@/lib/hallmark-visuals';
import { InterventionExplorer } from './InterventionExplorer';
import { HallmarkNotesPanel } from './HallmarkNotesPanel';
import { MdxRenderer } from './MdxRenderer';
import { ContextRail } from '@/components/ui/ContextRail';
import { getHallmarkContext } from '@/lib/hub-context';
import { SystemsSynthesisView } from './SystemsSynthesisView';
import { HALLMARK_VISUALS } from '@/components/illustrations/HallmarkVisuals';
import { ContentByline } from '@/components/trust/ContentByline';

export function HallmarkDetail({
  hallmark,
  mdxBody,
  targetingCompounds = [],
  compoundHrefs = {},
  lastUpdated,
  author,
  reviewer,
}: {
  hallmark: HallmarkLibraryEntry;
  mdxBody: string | null;
  targetingCompounds?: CompoundLink[];
  compoundHrefs?: Record<string, string>;
  lastUpdated?: string;
  author?: string;
  reviewer?: string;
}) {
  const MechanismVisual = HALLMARK_VISUALS[hallmark.id];
  const visualMeta = getHallmarkVisual(hallmark.visual);

  return (
    <div className="min-h-screen canvas-scrim text-foreground pt-6 md:pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <Link
          href="/library"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent-cyan transition mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Anti-Aging Library
        </Link>
        <ContentByline
          author={author}
          lastUpdated={lastUpdated}
          reviewer={reviewer}
          className="mb-8"
        />

        <div className="grid lg:grid-cols-12 gap-10">
          <div className="order-2 lg:order-1 lg:col-span-4 space-y-6">
            <HallmarkVisual
              visual={hallmark.visual}
              coverage={hallmark.coverage}
              number={hallmark.number}
            />
            {MechanismVisual && (
              <GlassPanel depth="mid" className="overflow-hidden rounded-xl">
                <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider px-4 pt-3 pb-1">
                  Mechanism Diagram
                </p>
                <MechanismVisual className="w-full" />
              </GlassPanel>
            )}
            <HallmarkNotesPanel hallmark={hallmark} />
          </div>

          <div className="order-1 lg:order-2 min-w-0 lg:col-span-8 space-y-10">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <PageHeader
                icon={Dna}
                eyebrow={`Hallmark ${hallmark.number} of 12`}
                title={hallmark.title}
                description={hallmark.tagline}
                theme={visualMeta.theme}
                as="h1"
                align="left"
              />
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{hallmark.summary}</p>
              <GlassPanel depth="mid" className="rounded-xl p-5 mb-4">
                <p className="text-[10px] font-mono text-accent-violet uppercase mb-2">Mechanism</p>
                <p className="text-sm text-foreground/80 leading-relaxed">{hallmark.mechanism}</p>
                {hallmark.keyMolecules && hallmark.keyMolecules.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-border/30">
                    <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider self-center mr-1">Key targets:</span>
                    {hallmark.keyMolecules.map((mol) => (
                      <span
                        key={mol}
                        className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-accent-violet/10 text-accent-violet border border-accent-violet/25 select-all"
                      >
                        {mol}
                      </span>
                    ))}
                  </div>
                )}
              </GlassPanel>
              <GlassPanel depth="mid" className="rounded-xl p-5">
                <p className="text-[10px] font-mono text-accent-amber uppercase mb-2">Why it matters</p>
                <p className="text-sm text-foreground/80 leading-relaxed">{hallmark.whyItMatters}</p>
              </GlassPanel>
            </motion.div>

            <ContextRail {...getHallmarkContext(hallmark)} theme="cyan" variant="compact" />

            {mdxBody && (
              <div className="gradient-border p-6 md:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-4 h-4 text-accent-cyan" />
                  <p className="text-[10px] font-mono text-accent-cyan uppercase">Deep dive (MDX)</p>
                </div>
                <MdxRenderer content={mdxBody} />
              </div>
            )}

            {targetingCompounds.length > 0 && (
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Pill className="w-4 h-4 text-accent-cyan" />
                    <p className="text-[10px] font-mono text-accent-cyan uppercase tracking-wider">
                      Compounds targeting {hallmark.title}
                    </p>
                  </div>
                  <Link
                    href="/library/compounds"
                    className="text-xs font-semibold text-accent-cyan hover:text-accent-emerald transition shrink-0"
                  >
                    All compounds →
                  </Link>
                </div>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {targetingCompounds.slice(0, 12).map((compound, i) => (
                    <li key={compound.slug}>
                      <RevealCard index={i} depth="mid" className="glass-hover rounded-xl">
                        <Link
                          href={`/library/compounds/${compound.slug}`}
                          className="focus-ring interactive group flex items-center justify-between gap-3 rounded-xl p-4"
                        >
                          <span className="text-sm font-semibold text-foreground group-hover:text-accent-cyan transition truncate">
                            {compound.name}
                          </span>
                          <EvidenceTag tier={compound.evidence} size="sm" className="shrink-0" />
                        </Link>
                      </RevealCard>
                    </li>
                  ))}
                </ul>
                {targetingCompounds.length > 12 && (
                  <p className="mt-4 text-xs text-muted-foreground">
                    Showing the 12 best-evidenced of{' '}
                    <Link
                      href="/library/compounds"
                      className="font-semibold text-accent-cyan hover:text-accent-emerald transition"
                    >
                      {targetingCompounds.length} compounds mapped to {hallmark.title}
                    </Link>
                    .
                  </p>
                )}
              </div>
            )}

            <div>
              <p className="text-[10px] font-mono text-accent-emerald uppercase tracking-wider mb-4">
                Intervention Explorer — ranked by evidence
              </p>
              <InterventionExplorer
                interventions={hallmark.interventions}
                hallmarkTitle={hallmark.title}
                compoundHrefs={compoundHrefs}
              />
            </div>

            {/* Systems Synthesis */}
            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <Network className="w-4 h-4 text-accent-violet" />
                  <p className="text-[10px] font-mono text-accent-violet uppercase tracking-wider">
                    System Effects — cross-hallmark synthesis
                  </p>
                </div>
                <Link
                  href="/library/systems"
                  className="text-xs font-semibold text-accent-violet hover:text-accent-violet/80 transition shrink-0"
                >
                  Full Systems Map →
                </Link>
              </div>
              <SystemsSynthesisView hallmarkId={hallmark.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}