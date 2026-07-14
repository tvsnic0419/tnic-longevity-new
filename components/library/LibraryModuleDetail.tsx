'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Layers, FlaskConical, AlertTriangle, Scale, Network, Sparkles } from 'lucide-react';
import Link from 'next/link';
import type { LibraryModule } from '@/lib/library-modules';
import type { ComparisonLink } from '@/lib/comparison-relations';
import type { GuideLink } from '@/lib/library-graph';
import { libraryCategoryMeta } from '@/lib/library-modules';
import { hallmarkLibrary } from '@/lib/hallmarks-library';
import { compounds } from '@/lib/data';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { MdxRenderer } from './MdxRenderer';
import { CompoundBuyerGuidePanel } from './CompoundBuyerGuide';
import { LifestylePillarPanel } from './LifestylePillarPanel';
import { PathwaySynthesis } from './PathwaySynthesis';
import { EmergentEffectsView } from './EmergentEffectsView';
import { getBuyerGuideByModuleSlug } from '@/lib/buyer-guides';
import type { LifestyleSlug } from '@/lib/lifestyle-pillars';
import { ModuleContextStrip } from './ModuleContextStrip';
import { recordModuleVisit } from '@/lib/recent-modules';
import { getPathwaysForCompound, getEmergentEffectsForCompound } from '@/lib/relations';
import { GlassCard } from '@/components/ui/GlassPanel';
import { RevealItem } from '@/components/ui/RevealItem';

export function LibraryModuleDetail({
  module,
  mdxBody,
  comparisons = [],
  guide,
}: {
  module: LibraryModule;
  mdxBody: string | null;
  comparisons?: ComparisonLink[];
  guide?: GuideLink;
}) {
  const categoryMeta = libraryCategoryMeta[module.category];
  const relatedHallmarks = hallmarkLibrary.filter((h) => module.relatedHallmarkIds.includes(h.id));
  const relatedCompound = module.compoundId ? compounds.find((c) => c.id === module.compoundId) : null;
  const synergyCompounds = module.synergyCompoundIds
    ?.map((id) => compounds.find((c) => c.id === id))
    .filter(Boolean) ?? [];
  const buyerGuide =
    module.category === 'compounds' ? getBuyerGuideByModuleSlug(module.slug) : undefined;
  const compoundPathways = module.compoundId ? getPathwaysForCompound(module.compoundId) : [];
  const compoundEmergentEffects = module.compoundId ? getEmergentEffectsForCompound(module.compoundId) : [];

  useEffect(() => {
    recordModuleVisit(module);
  }, [module]);

  return (
    <div className="min-h-screen section-deep text-foreground pt-6 md:pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <Link
          href="/library#content-modules"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent-cyan transition mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Library
        </Link>

        <div className="grid lg:grid-cols-12 gap-10">
          <aside className="lg:col-span-4 space-y-6">
            {module.category === 'lifestyle' && (
              <LifestylePillarPanel slug={module.slug as LifestyleSlug} />
            )}

            <div className="card-elevated p-6">
              <p className="text-[10px] font-mono text-accent-cyan tracking-widest mb-2 uppercase">
                {categoryMeta.label}
              </p>
              <EvidenceTag tier={module.evidenceTier} size="lg" className="mb-4" href="/trust/methodology" />
              <h2 className="text-lg font-bold mb-4">Module outline</h2>
              <ol className="space-y-2">
                {module.outline.map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                    <span className="text-accent-cyan font-mono text-xs shrink-0">{String(i + 1).padStart(2, '0')}</span>
                    {item}
                  </li>
                ))}
              </ol>
            </div>

            {relatedHallmarks.length > 0 && (
              <GlassCard depth="mid" rounded="rounded-xl" className="!p-5">
                <p className="text-[10px] font-mono text-accent-violet uppercase mb-3">Related hallmarks</p>
                <ul className="space-y-2">
                  {relatedHallmarks.map((h) => (
                    <li key={h.id}>
                      <Link
                        href={`/library/${h.slug}`}
                        className="text-sm text-muted-foreground hover:text-accent-cyan transition"
                      >
                        #{h.number} {h.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            )}

            {relatedCompound && (
              <GlassCard depth="mid" rounded="rounded-xl" className="!p-5">
                <p className="text-[10px] font-mono text-accent-emerald uppercase mb-3">TNiC compound</p>
                <p className="text-sm font-semibold text-foreground">{relatedCompound.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{relatedCompound.dose} · {relatedCompound.timing}</p>
                <Link href="/stacks" className="text-xs text-accent-cyan hover:text-accent-emerald mt-3 inline-block">
                  Add to stack →
                </Link>
              </GlassCard>
            )}

            {synergyCompounds.length > 0 && (
              <GlassCard depth="mid" rounded="rounded-xl" className="!p-5">
                <p className="text-[10px] font-mono text-accent-emerald uppercase mb-3">Stack compounds</p>
                <ul className="space-y-2">
                  {synergyCompounds.map((c) => (
                    <li key={c!.id} className="text-sm text-muted-foreground">
                      {c!.name}
                    </li>
                  ))}
                </ul>
                <Link href="/stacks" className="text-xs text-accent-cyan hover:text-accent-emerald mt-3 inline-block">
                  Open Stack Architect →
                </Link>
              </GlassCard>
            )}

            {module.relatedSynergySlugs && module.relatedSynergySlugs.length > 0 && (
              <GlassCard depth="mid" rounded="rounded-xl" className="!p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Layers className="w-4 h-4 text-accent-cyan" />
                  <p className="text-[10px] font-mono text-accent-cyan uppercase">Related synergies</p>
                </div>
                <ul className="space-y-2">
                  {module.relatedSynergySlugs.map((slug) => (
                    <li key={slug}>
                      <Link
                        href={`/library/synergies/${slug}`}
                        className="text-sm text-muted-foreground hover:text-accent-cyan transition"
                      >
                        {slug.replace(/-/g, ' ')}
                      </Link>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            )}

            {comparisons.length > 0 && (
              <GlassCard depth="mid" rounded="rounded-xl" className="!p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Scale className="w-4 h-4 text-accent-cyan" />
                  <p className="text-[10px] font-mono text-accent-cyan uppercase">Compare {module.title}</p>
                </div>
                <ul className="space-y-2.5">
                  {comparisons.map((comparison, i) => (
                    <li key={comparison.slug}>
                      <RevealItem index={i}>
                        <Link
                          href={`/library/compare/${comparison.slug}`}
                          className="focus-ring interactive group flex items-center justify-between gap-2 rounded-md"
                        >
                          <span className="text-sm text-muted-foreground group-hover:text-accent-cyan transition truncate">
                            {comparison.labelA} vs {comparison.labelB}
                          </span>
                          <EvidenceTag tier={comparison.evidenceTier} className="shrink-0" />
                        </Link>
                      </RevealItem>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            )}

            {guide && (
              <Link
                href={guide.href}
                className="focus-ring interactive flex items-center gap-3 glass glass-hover rounded-xl p-4"
              >
                <BookOpen className="w-5 h-5 text-accent-emerald shrink-0" />
                <div>
                  <p className="text-sm font-semibold">{guide.label}</p>
                  <p className="text-xs text-muted-foreground">Full buyer&rsquo;s guide — dosing, forms, evidence</p>
                </div>
              </Link>
            )}

            <Link
              href="/labs"
              className="focus-ring interactive flex items-center gap-3 glass glass-hover rounded-xl p-4"
            >
              <FlaskConical className="w-5 h-5 text-accent-cyan shrink-0" />
              <div>
                <p className="text-sm font-semibold">Labs hub</p>
                <p className="text-xs text-muted-foreground">Track biomarkers for this module</p>
              </div>
            </Link>
          </aside>

          <div className="lg:col-span-8 space-y-8">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <ModuleContextStrip module={module} />
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{module.title}</h1>
              <p className="text-lg text-muted-foreground mb-4">{module.tagline}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{module.summary}</p>
            </motion.div>

            {module.requiresDisclaimer && (
              <div className="rounded-xl p-5 border border-accent-amber/30 bg-accent-amber/5 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-accent-amber shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-200 mb-1">Prescription / educational only</p>
                  <p className="text-sm text-muted-foreground">
                    This module is for informed physician discussions. TNiC does not prescribe or recommend self-medication.{' '}
                    <Link href="/trust/disclaimers" className="text-accent-cyan hover:text-accent-emerald">
                      Read disclaimers
                    </Link>
                  </p>
                </div>
              </div>
            )}

            {buyerGuide && (
              <CompoundBuyerGuidePanel guide={buyerGuide} />
            )}

            {mdxBody ? (
              <div className="gradient-border p-6 md:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-4 h-4 text-accent-cyan" />
                  <p className="text-[10px] font-mono text-accent-cyan uppercase">Deep dive</p>
                </div>
                <MdxRenderer content={mdxBody} />
              </div>
            ) : (
              <div className="glass rounded-xl p-8 text-center text-muted-foreground">
                Content module in progress. Outline available in sidebar.
              </div>
            )}

            {compoundPathways.length > 0 && (
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Network className="w-4 h-4 text-accent-violet" />
                  <p className="text-[10px] font-mono text-accent-violet uppercase">
                    Systems pathways — {compoundPathways.length} mapped
                  </p>
                </div>
                <PathwaySynthesis compoundId={module.compoundId} />
              </div>
            )}

            {compoundEmergentEffects.length > 0 && (
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-accent-violet" />
                  <p className="text-[10px] font-mono text-accent-violet uppercase">
                    Emergent effects — {compoundEmergentEffects.length} mapped
                  </p>
                </div>
                <EmergentEffectsView compoundId={module.compoundId} />
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <Link
                href="/stacks"
                className="focus-ring interactive inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-cyan/10 border border-accent-cyan/30 text-sm font-semibold text-accent-cyan hover:bg-accent-cyan/20"
              >
                Build your stack
              </Link>
              <Link
                href="/labs"
                className="focus-ring interactive inline-flex items-center gap-2 px-4 py-2 rounded-lg glass glass-hover text-sm font-semibold text-foreground/80"
              >
                Open Labs hub
              </Link>
              <Link
                href="/trust"
                className="focus-ring interactive inline-flex items-center gap-2 px-4 py-2 rounded-lg glass glass-hover text-sm font-semibold text-foreground/80"
              >
                Evidence methodology
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}