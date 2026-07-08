'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Network } from 'lucide-react';
import Link from 'next/link';
import type { HallmarkLibraryEntry } from '@/lib/types';
import { HallmarkVisual } from './HallmarkVisual';
import { InterventionExplorer } from './InterventionExplorer';
import { HallmarkNotesPanel } from './HallmarkNotesPanel';
import { MdxRenderer } from './MdxRenderer';
import { ContextRail } from '@/components/ui/ContextRail';
import { getHallmarkContext } from '@/lib/hub-context';
import { SystemsSynthesisView } from './SystemsSynthesisView';
import { HALLMARK_VISUALS } from '@/components/illustrations/HallmarkVisuals';

export function HallmarkDetail({
  hallmark,
  mdxBody,
}: {
  hallmark: HallmarkLibraryEntry;
  mdxBody: string | null;
}) {
  const MechanismVisual = HALLMARK_VISUALS[hallmark.id];

  return (
    <div className="min-h-screen bg-background text-foreground pt-6 md:pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <Link
          href="/library"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent-cyan transition mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Anti-Aging Library
        </Link>

        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-6">
            <HallmarkVisual
              visual={hallmark.visual}
              coverage={hallmark.coverage}
              number={hallmark.number}
            />
            {MechanismVisual && (
              <div className="glass rounded-xl overflow-hidden">
                <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider px-4 pt-3 pb-1">
                  Mechanism Diagram
                </p>
                <MechanismVisual className="w-full" />
              </div>
            )}
            <HallmarkNotesPanel hallmark={hallmark} />
          </div>

          <div className="lg:col-span-8 space-y-10">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <p className="font-mono text-[10px] text-accent-cyan tracking-widest mb-2">
                HALLMARK {hallmark.number} OF 12
              </p>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{hallmark.title}</h1>
              <p className="text-lg text-muted-foreground mb-6">{hallmark.tagline}</p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{hallmark.summary}</p>
              <div className="glass rounded-xl p-5 mb-4">
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
              </div>
              <div className="glass rounded-xl p-5">
                <p className="text-[10px] font-mono text-accent-amber uppercase mb-2">Why it matters</p>
                <p className="text-sm text-foreground/80 leading-relaxed">{hallmark.whyItMatters}</p>
              </div>
            </motion.div>

            <ContextRail {...getHallmarkContext(hallmark)} theme="cyan" />

            {mdxBody && (
              <div className="gradient-border p-6 md:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-4 h-4 text-accent-cyan" />
                  <p className="text-[10px] font-mono text-accent-cyan uppercase">Deep dive (MDX)</p>
                </div>
                <MdxRenderer content={mdxBody} />
              </div>
            )}

            <div>
              <p className="text-[10px] font-mono text-accent-emerald uppercase tracking-wider mb-4">
                Intervention Explorer — ranked by evidence
              </p>
              <InterventionExplorer
                interventions={hallmark.interventions}
                hallmarkTitle={hallmark.title}
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