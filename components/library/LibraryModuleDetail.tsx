'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Layers, FlaskConical, HeartPulse, AlertTriangle, Scale, Pill, ShoppingBag, Info, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import type { LibraryModule, LibraryModuleCategory } from '@/lib/library-modules';
import type { ComparisonLink } from '@/lib/comparison-relations';
import type { GuideLink, RelatedCompoundLink } from '@/lib/library-graph';
import { getModulePath, libraryCategoryMeta } from '@/lib/library-modules';
import { hallmarkLibrary } from '@/lib/hallmarks-library';
import { compounds } from '@/lib/data';
import { getEdgeExplanation } from '@/lib/hero-network';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { MdxRenderer } from './MdxRenderer';
import { CompoundBuyerGuidePanel } from './CompoundBuyerGuide';
import { ProductPickCard } from '@/components/shop/ProductPickCard';
import { getProductPick } from '@/lib/product-picks';
import { LifestylePillarPanel } from './LifestylePillarPanel';
import { getBuyerGuideByModuleSlug } from '@/lib/buyer-guides';
import type { LifestyleSlug } from '@/lib/lifestyle-pillars';
import { ModuleContextStrip } from './ModuleContextStrip';
import { CompoundGlancePanel } from './CompoundGlancePanel';
import { ModuleGlancePanel } from './ModuleGlancePanel';
import { recordModuleVisit } from '@/lib/recent-modules';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { ContentByline } from '@/components/trust/ContentByline';
import { AffiliateDisclosure } from '@/components/trust/AffiliateDisclosure';
import { libraryModuleTitles } from '@/lib/breadcrumb-titles';

/**
 * Category -> icon + full static Tailwind class strings. Deliberately not
 * interpolated (e.g. `icon-badge-${theme}`) — Tailwind's build-time scanner
 * only detects literal class names in source, so a runtime template
 * literal here would silently fail to generate the CSS at all.
 */
const categoryVisual: Record<
  LibraryModuleCategory,
  { icon: LucideIcon; badgeClass: string; glowClass: string; textClass: string }
> = {
  compounds: { icon: FlaskConical, badgeClass: 'icon-badge-cyan', glowClass: 'glow-cyan', textClass: 'text-accent-cyan' },
  synergies: { icon: Layers, badgeClass: 'icon-badge-violet', glowClass: 'glow-violet', textClass: 'text-accent-violet' },
  lifestyle: { icon: HeartPulse, badgeClass: 'icon-badge-amber', glowClass: 'glow-amber', textClass: 'text-accent-amber' },
  guides: { icon: BookOpen, badgeClass: 'icon-badge-emerald', glowClass: 'glow-emerald', textClass: 'text-accent-emerald' },
};

export function LibraryModuleDetail({
  module,
  mdxBody,
  comparisons = [],
  guide,
  relatedCompounds = [],
  engineHref,
  pathways = [],
  lastUpdated,
  author,
  reviewer,
}: {
  module: LibraryModule;
  mdxBody: string | null;
  comparisons?: ComparisonLink[];
  guide?: GuideLink;
  relatedCompounds?: RelatedCompoundLink[];
  /** Molecular pathways this compound engages (server-resolved). */
  pathways?: { slug: string; name: string }[];
  /**
   * Deep link into the Compound Intelligence Engine pre-loaded with this
   * compound, or undefined when the engine hasn't curated it. Resolved on the
   * server so the engine's scoring dataset never reaches this client bundle.
   */
  engineHref?: string;
  /** Authorship / freshness signals from MDX frontmatter (E-E-A-T byline). */
  lastUpdated?: string;
  author?: string;
  reviewer?: string;
}) {
  const categoryMeta = libraryCategoryMeta[module.category];
  const relatedHallmarks = hallmarkLibrary.filter((h) => module.relatedHallmarkIds.includes(h.id));
  const relatedCompound = module.compoundId ? compounds.find((c) => c.id === module.compoundId) : null;
  const synergyCompounds = module.synergyCompoundIds
    ?.map((id) => compounds.find((c) => c.id === id))
    .filter(Boolean) ?? [];
  const buyerGuide =
    module.category === 'compounds' ? getBuyerGuideByModuleSlug(module.slug) : undefined;
  // A compound can have a verified pick without a full authored buyer guide
  // (e.g. R-ALA). Without this fallback its evidence page would carry no buy
  // path at all — surface the pick directly so the revenue action is never
  // missing where one exists.
  const fallbackPick =
    module.category === 'compounds' && !buyerGuide && module.compoundId
      ? getProductPick(module.compoundId)
      : undefined;
  // Library-first compounds have no canonical dataset entry to drive the rich
  // glance panel; surface the same shape from a live count of the PMIDs cited
  // in the deep-dive body so all 55 compound pages stay coherent.
  const mdxStudyCount =
    module.category === 'compounds' && !relatedCompound && mdxBody
      ? new Set(mdxBody.match(/\bPMID:?\s*(\d{7,8})\b/g)?.map((m) => m.replace(/\D/g, '')) ?? []).size
      : 0;
  // Distinct PMIDs cited anywhere in the deep-dive — the freshness/depth signal
  // shown in the byline, computed for every module (not only library-only ones).
  const citationCount = mdxBody
    ? new Set(mdxBody.match(/\bPMID:?\s*(\d{7,8})\b/g)?.map((m) => m.replace(/\D/g, '')) ?? []).size
    : 0;

  useEffect(() => {
    recordModuleVisit(module);
  }, [module]);

  return (
    <div className="min-h-screen canvas-scrim text-foreground pt-6 md:pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <Link
          href="/library#content-modules"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent-cyan transition mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Library
        </Link>
        <ContentByline
          author={author}
          lastUpdated={lastUpdated}
          reviewer={reviewer}
          citationCount={citationCount}
          className="mb-8"
        />

        <div className="grid lg:grid-cols-12 gap-10">
          <aside className="order-2 lg:order-1 lg:col-span-4 space-y-6">
            {module.category === 'lifestyle' && (
              <LifestylePillarPanel slug={module.slug as LifestyleSlug} />
            )}

            <div className="card-elevated p-6">
              <p className="text-micro font-mono text-accent-cyan tracking-widest mb-2 uppercase">
                {categoryMeta.label}
              </p>
              <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <EvidenceTag tier={module.evidenceTier} size="lg" href="/trust/methodology" />
                {module.category === 'compounds' && (
                  <Link
                    href={`/library/compounds?tiers=${module.evidenceTier}`}
                    className="focus-ring rounded text-xs text-muted-foreground hover:text-accent-cyan transition-colors"
                  >
                    See all Tier {module.evidenceTier} compounds →
                  </Link>
                )}
              </div>
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
              <GlassPanel depth="mid" className="rounded-xl p-5">
                <p className="text-micro font-mono text-accent-violet uppercase mb-3">Related hallmarks</p>
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
              </GlassPanel>
            )}

            {pathways.length > 0 && (
              <GlassPanel depth="mid" className="rounded-xl p-5">
                <p className="text-micro font-mono text-accent-cyan uppercase mb-3">Pathways engaged</p>
                <ul className="space-y-2">
                  {pathways.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/pathways/${p.slug}`}
                        className="text-sm text-muted-foreground hover:text-accent-cyan transition"
                      >
                        {p.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </GlassPanel>
            )}

            {relatedCompound && (
              <GlassPanel depth="mid" className="rounded-xl p-5">
                <p className="text-micro font-mono text-accent-emerald uppercase mb-3">TNiC compound</p>
                <p className="text-sm font-semibold text-foreground">{relatedCompound.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{relatedCompound.dose} · {relatedCompound.timing}</p>
                <Link href="/stacks" className="text-xs text-accent-cyan hover:text-accent-emerald mt-3 inline-block">
                  Add to stack →
                </Link>
              </GlassPanel>
            )}

            {/* Compound pages: each synergy partner with its real pair-specific
                mechanism (lib/synergy-mechanisms.ts) — the "why they pair" on
                the page, not just a list of names. */}
            {relatedCompound && relatedCompound.synergies.length > 0 && (
              <GlassPanel depth="mid" className="rounded-xl p-5">
                <p className="text-micro font-mono text-accent-emerald uppercase mb-3">Synergizes with</p>
                <ul className="space-y-3">
                  {relatedCompound.synergies.map((partnerId) => {
                    const partner = compounds.find((c) => c.id === partnerId);
                    if (!partner) return null;
                    const why = getEdgeExplanation(relatedCompound.id, partner.id).text;
                    return (
                      <li key={partnerId}>
                        <Link
                          href={`/library/compounds/${partner.id}`}
                          className="text-sm font-semibold text-foreground hover:text-accent-cyan transition"
                        >
                          {partner.name}
                        </Link>
                        <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{why}</p>
                      </li>
                    );
                  })}
                </ul>
                <Link href="/stacks" className="text-xs text-accent-cyan hover:text-accent-emerald mt-4 inline-block">
                  Open Stack Architect →
                </Link>
              </GlassPanel>
            )}

            {synergyCompounds.length > 0 && (
              <GlassPanel depth="mid" className="rounded-xl p-5">
                <p className="text-micro font-mono text-accent-emerald uppercase mb-3">Stack compounds</p>
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
              </GlassPanel>
            )}

            {module.relatedSynergySlugs && module.relatedSynergySlugs.length > 0 && (
              <GlassPanel depth="mid" className="rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Layers className="w-4 h-4 text-accent-cyan" />
                  <p className="text-micro font-mono text-accent-cyan uppercase">Related synergies</p>
                </div>
                <ul className="space-y-2">
                  {module.relatedSynergySlugs.map((slug) => (
                    <li key={slug}>
                      <Link
                        href={`/library/synergies/${slug}`}
                        className="text-sm text-muted-foreground hover:text-accent-cyan transition"
                      >
                        {libraryModuleTitles[`synergies/${slug}`] ?? slug.replace(/-/g, ' ')}
                      </Link>
                    </li>
                  ))}
                </ul>
              </GlassPanel>
            )}

            {comparisons.length > 0 && (
              <GlassPanel depth="mid" className="rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Scale className="w-4 h-4 text-accent-cyan" />
                  <p className="text-micro font-mono text-accent-cyan uppercase">Compare {module.title}</p>
                </div>
                <ul className="space-y-2.5">
                  {comparisons.map((comparison) => (
                    <li key={comparison.slug}>
                      <Link
                        href={`/library/compare/${comparison.slug}`}
                        className="focus-ring interactive group flex items-center justify-between gap-2 rounded-md"
                      >
                        <span className="text-sm text-muted-foreground group-hover:text-accent-cyan transition truncate">
                          {comparison.labelA} vs {comparison.labelB}
                        </span>
                        <EvidenceTag tier={comparison.evidenceTier} className="shrink-0" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </GlassPanel>
            )}

            {relatedCompounds.length > 0 && (
              <GlassPanel depth="mid" className="rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Pill className="w-4 h-4 text-accent-emerald" />
                  <p className="text-micro font-mono text-accent-emerald uppercase">Related compounds</p>
                </div>
                <ul className="space-y-2.5">
                  {relatedCompounds.map((rc) => (
                    <li key={rc.slug}>
                      <Link
                        href={`/library/compounds/${rc.slug}`}
                        className="focus-ring interactive group flex items-center justify-between gap-2 rounded-md"
                      >
                        <span className="text-sm text-muted-foreground group-hover:text-accent-cyan transition truncate">
                          {rc.name}
                        </span>
                        <EvidenceTag tier={rc.evidence} size="sm" className="shrink-0" />
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/library/compounds"
                  className="text-xs text-accent-cyan hover:text-accent-emerald mt-3 inline-block"
                >
                  All compounds →
                </Link>
              </GlassPanel>
            )}

            {guide && (
              <GlassPanel depth="mid" className="glass-hover rounded-xl">
                <Link
                  href={guide.href}
                  className="focus-ring interactive flex items-center gap-3 p-4"
                >
                  <BookOpen className="w-5 h-5 text-accent-emerald shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">{guide.label}</p>
                    <p className="text-xs text-muted-foreground">Full buyer&rsquo;s guide — dosing, forms, evidence</p>
                  </div>
                </Link>
              </GlassPanel>
            )}

            <GlassPanel depth="mid" className="glass-hover rounded-xl">
              <Link
                href="/labs"
                className="focus-ring interactive flex items-center gap-3 p-4"
              >
                <FlaskConical className="w-5 h-5 text-accent-cyan shrink-0" />
                <div>
                  <p className="text-sm font-semibold">Labs hub</p>
                  <p className="text-xs text-muted-foreground">Track biomarkers for this module</p>
                </div>
              </Link>
            </GlassPanel>
          </aside>

          <div className="order-1 lg:order-2 min-w-0 lg:col-span-8 space-y-8">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <ModuleContextStrip module={module} />
              <div className="flex items-start gap-4 mb-2">
                <span
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${categoryVisual[module.category].badgeClass} ${categoryVisual[module.category].glowClass}`}
                  aria-hidden="true"
                >
                  {(() => {
                    const CategoryIcon = categoryVisual[module.category].icon;
                    return <CategoryIcon className={`h-7 w-7 ${categoryVisual[module.category].textClass}`} />;
                  })()}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight pt-1">{module.title}</h1>
              </div>
              <p className="text-lg text-muted-foreground mb-4">{module.tagline}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{module.summary}</p>
            </motion.div>

            {relatedCompound ? (
              <CompoundGlancePanel compound={relatedCompound} />
            ) : (
              module.category === 'compounds' && (
                <ModuleGlancePanel module={module} studyCount={mdxStudyCount} />
              )
            )}

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

            {fallbackPick && (
              <div className="gradient-border p-6 md:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingBag className="w-4 h-4 text-accent-emerald" aria-hidden="true" />
                  <p className="text-micro font-mono text-accent-emerald uppercase">Verified pick</p>
                </div>
                <ProductPickCard pick={fallbackPick} />
                <AffiliateDisclosure className="mt-3" />
              </div>
            )}

            {/* Honest empty state for compounds with neither a buyer's-guide
                checklist nor a verified pick — never a fabricated buy card,
                just an honest note plus a real next step. Gated on
                'compounds' for the same reason buyerGuide/fallbackPick are:
                both are unconditionally undefined for every other category
                (synergies/lifestyle/guides), so without this clause the box
                would incorrectly render there too. */}
            {!buyerGuide && !fallbackPick && module.category === 'compounds' && (
              <div className="gradient-border p-6 md:p-8">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                  <p className="text-micro font-mono text-muted-foreground uppercase">No verified pick yet</p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  TNiC hasn&apos;t verified a manufacturer pick for {module.title} yet — picks are added
                  only after dose-matched COA verification, not before. See what TNiC has verified on{' '}
                  <Link href="/products" className="text-accent-cyan hover:underline">
                    Products
                  </Link>
                  , or take the{' '}
                  <Link href="/nico" className="text-accent-cyan hover:underline">
                    NICO Starter Questionnaire
                  </Link>{' '}
                  for a personalized stack from compounds that are covered.
                </p>
              </div>
            )}

            {mdxBody ? (
              <div className="gradient-border p-6 md:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-4 h-4 text-accent-cyan" />
                  <p className="text-micro font-mono text-accent-cyan uppercase">Deep dive</p>
                </div>
                <MdxRenderer content={mdxBody} selfHref={getModulePath(module)} />
              </div>
            ) : (
              <GlassPanel depth="mid" className="rounded-xl p-8 text-center text-muted-foreground">
                Content module in progress. Outline available in sidebar.
              </GlassPanel>
            )}

            <div className="flex flex-wrap gap-3">
              <Link
                href="/stacks"
                className="focus-ring interactive tnic-button-tonal inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
              >
                Build your stack
              </Link>
              {engineHref && (
                <GlassPanel depth="mid" className="glass-hover rounded-lg">
                  <Link
                    href={engineHref}
                    className="focus-ring interactive inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[var(--color-text-secondary)]"
                  >
                    See how this scores
                  </Link>
                </GlassPanel>
              )}
              <GlassPanel depth="mid" className="glass-hover rounded-lg">
                <Link
                  href="/labs"
                  className="focus-ring interactive inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[var(--color-text-secondary)]"
                >
                  Open Labs hub
                </Link>
              </GlassPanel>
              <GlassPanel depth="mid" className="glass-hover rounded-lg">
                <Link
                  href="/trust/methodology"
                  className="focus-ring interactive inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[var(--color-text-secondary)]"
                >
                  Evidence methodology
                </Link>
              </GlassPanel>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}