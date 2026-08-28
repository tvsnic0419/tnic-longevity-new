'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, ClipboardCheck, ExternalLink, FileCheck2, ListFilter, Package, ShieldCheck, ShoppingBag } from 'lucide-react';
import { PRODUCT_PICKS, type ProductPick } from '@/lib/product-picks';
import { compounds } from '@/lib/data';
import { PageHeader } from '@/components/ui/PageHeader';
import { ContextRail } from '@/components/ui/ContextRail';
import { getHubContext } from '@/lib/hub-context';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { RevealCard } from '@/components/ui/RevealCard';
import type { EvidenceTier } from '@/lib/types';
import { DecisionSteps } from '@/components/ui/DecisionSteps';
import { FilterPill } from '@/components/ui/FilterPill';

const picks = Object.values(PRODUCT_PICKS).filter((p) => p.compoundId !== 'nr');

const libraryOnlyCompounds = compounds.filter((c) => !PRODUCT_PICKS[c.id]);

const hallmarkLabels: Record<string, string> = {
  mito: 'Mitochondria', genomic: 'DNA Integrity', epigenetic: 'Epigenetics',
  telomeres: 'Telomeres', proteostasis: 'Proteostasis', autophagy: 'Autophagy',
  senescence: 'Senescence', stem: 'Stem Cells', communication: 'Cell Signals',
  inflammation: 'Inflammation', dysbiosis: 'Microbiome', nutrient: 'Nutrient Sensing',
};

const productGoalFilters = [
  { id: 'all', label: 'All verified picks' },
  { id: 'mito', label: 'Energy & mitochondria' },
  { id: 'inflammation', label: 'Lower inflammation' },
  { id: 'genomic', label: 'DNA integrity' },
  { id: 'autophagy', label: 'Cellular cleanup' },
] as const;

function verifiedDateLabel(value?: string) {
  if (!value) return 'Review manufacturer details';
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(`${value}T00:00:00Z`),
  );
}

function ProductCard({ pick }: { pick: ProductPick }) {
  const compound = compounds.find((c) => c.id === pick.compoundId);
  const tier = compound?.evidence as EvidenceTier | undefined;
  const hallmarkTargets = compound?.hallmarks?.slice(0, 3) ?? [];

  /*
    Deep Glass surface (matches every other card on the page), but the stretched
    link + content are held in ONE inner wrapper so they are grandchildren of
    `.glass-deep`, not direct children. `.glass-deep > *` forces
    `position: relative` on its direct children via unlayered CSS that outranks
    Tailwind's `absolute` utility; keeping the overlay a grandchild is what lets
    the whole-card click target survive the conversion.
  */
  return (
    <div className="group relative glass-deep glass-plane-mid glow-hover-emerald rounded-2xl border border-border/80 overflow-hidden flex flex-col h-full">
      <div className="relative flex flex-1 flex-col">
      {/*
        Whole-card "stretched link" to the affiliate offer, layered *behind*
        the card content instead of wrapping it. The card also needs the
        nested "Read evidence module" link below — nesting an <a> inside an
        <a> is invalid HTML (browsers silently reparent it, which broke that
        inner link's clicks and caused a hydration mismatch). The content
        wrappers are `pointer-events-none` so every click on them falls
        through to this overlay; the one link that must stay independently
        clickable punches back through with `pointer-events-auto`.
      */}
      <a
        href={`/api/go/${pick.compoundId}`}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="absolute inset-0 z-0 rounded-2xl focus-ring"
        aria-label={`Buy ${pick.productName} from ${pick.brand} — opens manufacturer site`}
      />
      {/* Manufacturer packshots are photographed on white, so they sit on a
          dedicated ivory `.product-stage` shelf (globals.css) instead of a
          3%-white tint — the photo blends into the stage like e-commerce
          photography rather than reading as a floating white rectangle. */}
      <div className="relative pointer-events-none flex items-center justify-center product-stage h-48 overflow-hidden border-b border-border/50">
        <Image
          src={pick.imageSrc}
          alt={`${pick.brand} ${pick.productName}`}
          width={160}
          height={160}
          className="object-contain max-h-36 transition-transform duration-300 group-hover:scale-110 drop-shadow-lg"
          unoptimized={pick.imageSrc.endsWith('.svg')}
        />
        {tier && (
          <div className="absolute top-3 left-3">
            <EvidenceTag
              tier={tier}
              size="sm"
              href="/trust/methodology"
              className="pointer-events-auto relative z-10"
            />
          </div>
        )}
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-accent-emerald/90 px-2 py-1 text-micro font-semibold text-black shadow-sm transition-transform group-hover:scale-[1.03]">
          Verify on {pick.brand.split(' ')[0]} <ExternalLink className="w-2.5 h-2.5" aria-hidden="true" />
        </span>
      </div>

      <div className="relative pointer-events-none p-5 flex flex-col flex-1">
        <p className="text-micro font-semibold text-accent-emerald uppercase tracking-widest mb-1">
          {pick.brand}
        </p>
        <h2 className="font-bold text-foreground group-hover:text-accent-cyan transition-colors leading-snug mb-2">
          {pick.productName}
        </h2>

        {hallmarkTargets.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {hallmarkTargets.map((h) => (
              <span
                key={h}
                className="text-micro font-semibold px-1.5 py-0.5 rounded border"
                style={{
                  color: 'var(--accent-cyan)',
                  background: 'color-mix(in srgb, var(--accent-cyan) 10%, transparent)',
                  borderColor: 'color-mix(in srgb, var(--accent-cyan) 20%, transparent)',
                }}
              >
                {hallmarkLabels[h] ?? h}
              </span>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-4">{pick.whyThisPick}</p>
        <div className="mb-4 rounded-xl border border-accent-emerald/20 bg-accent-emerald/[0.045] p-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-accent-emerald" aria-hidden="true" />
            <p className="text-micro font-mono uppercase tracking-[0.11em] text-accent-emerald">Decision snapshot</p>
          </div>
          <div className="mt-2.5 grid grid-cols-2 gap-2 border-b border-accent-emerald/15 pb-2.5">
            <div>
              <p className="text-micro font-mono uppercase tracking-[0.08em] text-muted-foreground">Evidence</p>
              <p className="mt-0.5 text-caption font-semibold text-foreground">{tier ? `Tier ${tier} context` : 'Read module context'}</p>
            </div>
            <div>
              <p className="text-micro font-mono uppercase tracking-[0.08em] text-muted-foreground">Link checked</p>
              <p className="mt-0.5 text-caption font-semibold text-foreground">{verifiedDateLabel(pick.linkVerifiedAt)}</p>
            </div>
          </div>
          <p className="mt-2.5 flex gap-1.5 text-micro leading-relaxed text-muted-foreground">
            <FileCheck2 className="mt-0.5 h-3 w-3 shrink-0 text-accent-emerald" aria-hidden="true" />
            Confirm the current manufacturer COA and label before checkout.
          </p>
        </div>
        <div className="pt-3 border-t border-border/50 flex items-center justify-between gap-2">
          <p className="text-micro text-muted-foreground leading-snug line-clamp-2">{pick.doseNote}</p>
          <span className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-accent-emerald">
            Verify pick <ExternalLink className="w-3 h-3" aria-hidden="true" />
          </span>
        </div>
        {pick.companionPurchase && (
          <p className="mt-3 text-micro text-accent-amber/90 border-t border-border/30 pt-3">
            + {pick.companionPurchase.label}
          </p>
        )}
        <Link
          href={`/library/compounds/${pick.compoundId}`}
          className="relative z-10 pointer-events-auto mt-3 inline-block text-micro font-semibold text-accent-violet hover:underline"
        >
          Read {pick.compoundName} evidence module →
        </Link>
      </div>
      </div>
    </div>
  );
}

export function ProductsHub() {
  const [goalFilter, setGoalFilter] = useState<(typeof productGoalFilters)[number]['id']>('all');
  const [tierFilter, setTierFilter] = useState<'all' | EvidenceTier>('all');
  const visiblePicks = useMemo(
    () =>
      picks.filter((pick) => {
        const compound = compounds.find((item) => item.id === pick.compoundId);
        const matchesGoal = goalFilter === 'all' || compound?.hallmarks.includes(goalFilter);
        const matchesTier = tierFilter === 'all' || compound?.evidence === tierFilter;
        return matchesGoal && matchesTier;
      }),
    [goalFilter, tierFilter],
  );
  const filtersActive = goalFilter !== 'all' || tierFilter !== 'all';

  return (
    <div className="container-page py-10 md:py-14 max-w-6xl section-mesh">
      <PageHeader
        icon={Package}
        eyebrow="How we pick"
        title="Recommended Products"
        description="One evidence-aligned product per compound. TNiC may earn a commission on purchases via affiliate links — it never influences which products are listed or their evidence tier."
        theme="emerald"
        align="left"
        context={getHubContext('products')}
      />

      <div className="rounded-xl border border-accent-amber/25 bg-accent-amber/5 p-4 mb-10 flex gap-3 text-sm">
        <ShieldCheck className="w-5 h-5 text-accent-amber shrink-0 mt-0.5" />
        <p className="text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Zero inventory conflict.</strong> TNiC does not sell or
          stock supplements. Picks link to manufacturers and may include an affiliate token —{' '}
          <strong className="text-foreground">no extra cost to you</strong>, and commission never
          influences listings or evidence tiers. Always request a{' '}
          <strong className="text-foreground">Certificate of Analysis (COA)</strong> before purchasing.
        </p>
      </div>

      <DecisionSteps
        className="mb-8"
        eyebrow="Your product decision"
        title="Inspect the evidence before you buy."
        detail="TNiC shows one route through every verified pick: understand the compound, check the quality signals, then open the manufacturer only when the fit is clear."
        theme="emerald"
        recommendedIndex={0}
        steps={[
          { title: 'Read the evidence', detail: 'Inspect the cited compound module and its grading context.', href: '/library', icon: BookOpen },
          { title: 'Check form and COA', detail: 'Match the label to the dose note and request the latest COA.', href: '/shop', icon: ClipboardCheck },
          { title: 'Open the manufacturer', detail: 'Use the verified link only after your own due diligence.', href: '#verified-picks', icon: ShoppingBag },
        ]}
      />

      <section className="mb-8 rounded-2xl border border-border/70 bg-background/20 p-4 md:p-5" aria-labelledby="verified-pick-filter-title">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ListFilter className="h-4 w-4 text-accent-emerald" aria-hidden="true" />
              <p id="verified-pick-filter-title" className="text-label text-accent-emerald">FIND A VERIFIED PICK</p>
            </div>
            <p className="mt-1 text-body-sm text-muted-foreground">Filter by the outcome you want to explore and the evidence context you prefer.</p>
          </div>
          <p className="text-caption font-mono text-muted-foreground" aria-live="polite">
            Showing <span className="font-semibold text-foreground">{visiblePicks.length}</span> of {picks.length} verified picks
          </p>
        </div>
        <div className="mt-4 flex flex-col gap-3">
          <div className="flex flex-wrap gap-2" aria-label="Filter verified picks by goal">
            {productGoalFilters.map((filter) => (
              <FilterPill
                key={filter.id}
                active={goalFilter === filter.id}
                tone="emerald"
                onClick={() => setGoalFilter(filter.id)}
              >
                {filter.label}
              </FilterPill>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2" aria-label="Filter verified picks by evidence tier">
            <span className="mr-1 text-micro font-mono uppercase tracking-[0.1em] text-muted-foreground">Evidence</span>
            {(['all', 'A', 'B'] as const).map((tier) => (
              <FilterPill
                key={tier}
                active={tierFilter === tier}
                tone="cyan"
                onClick={() => setTierFilter(tier)}
              >
                {tier === 'all' ? 'All evidence' : `Tier ${tier}`}
              </FilterPill>
            ))}
            {filtersActive && (
              <button
                type="button"
                onClick={() => {
                  setGoalFilter('all');
                  setTierFilter('all');
                }}
                className="focus-ring min-h-[var(--space-touch)] px-2 text-caption font-semibold text-accent-amber hover:text-foreground"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </section>

      <div id="verified-picks" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
        {visiblePicks.map((pick) => (
          <ProductCard key={pick.compoundId} pick={pick} />
        ))}
      </div>

      {visiblePicks.length === 0 && (
        <div className="mb-14 rounded-2xl border border-dashed border-border/80 bg-background/20 p-6 text-center">
          <p className="font-semibold text-foreground">No verified pick matches both filters yet.</p>
          <p className="mt-1 text-body-sm text-muted-foreground">Try a broader goal or evidence tier. TNiC adds a product only after it passes dose and COA review.</p>
          <button type="button" onClick={() => { setGoalFilter('all'); setTierFilter('all'); }} className="focus-ring mt-4 text-sm font-semibold text-accent-emerald hover:text-foreground">Show all verified picks</button>
        </div>
      )}

      {libraryOnlyCompounds.length > 0 && (
        <details className="mb-14 rounded-2xl border border-border/70 bg-background/15 p-5">
          <summary className="focus-ring cursor-pointer list-none rounded-lg text-lg font-bold text-foreground marker:content-none">
            <span className="inline-flex items-center gap-2">
              Evidence modules — no verified pick yet
              <span className="rounded-full border border-border/70 px-2 py-0.5 text-micro font-mono font-semibold text-muted-foreground">{libraryOnlyCompounds.length}</span>
            </span>
            <span className="ml-2 text-caption font-normal text-muted-foreground">Browse research-only compounds</span>
          </summary>
          <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
            These compounds have full library deep-dives and stack integration. TNiC adds manufacturer picks only after dose-matched COA verification — not before.
          </p>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {libraryOnlyCompounds.map((c, i) => (
              <RevealCard
                key={c.id}
                index={i}
                depth="mid"
                itemClassName="h-full"
                className="glass-hover h-full rounded-2xl border border-border/60"
              >
                <Link
                  href={`/library/compounds/${c.id}`}
                  className="focus-ring block h-full rounded-2xl p-5 transition hover:border-accent-violet/40 group"
                >
                  <p className="text-micro font-semibold text-accent-cyan uppercase tracking-widest mb-1">
                    Tier {c.evidence} · Library only
                  </p>
                  <h3 className="font-bold text-foreground group-hover:text-accent-violet transition-colors mb-2">
                    {c.name}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-3">{c.desc}</p>
                  <p className="text-micro text-muted-foreground">{c.dose}</p>
                  <span className="inline-block mt-3 text-xs font-semibold text-accent-violet group-hover:underline">
                    Read evidence module →
                  </span>
                </Link>
              </RevealCard>
            ))}
          </div>
        </details>
      )}

      <ContextRail
        what="Manufacturer-linked product cards with dose notes and compound deep-dive handoffs."
        why="Random Amazon listings hide purity gaps. These picks match TNiC trial-matched doses and link to evidence modules."
        next="Cross-check every pick against Protocol Shop COA checklists filtered to your stack preset."
        theme="amber"
        className="mb-8"
      />

      <GlassPanel depth="mid" className="rounded-2xl border border-border/60 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="flex-1">
          <p className="font-semibold mb-1">Want stack-filtered verification checklists?</p>
          <p className="text-sm text-muted-foreground">
            Protocol Shop shows COA demands, red flags, and dose anchors filtered to your active compounds.
          </p>
        </div>
        <Link
          href="/shop"
          className="focus-ring btn-gradient shrink-0 inline-flex items-center gap-2 text-sm !py-2.5 !px-5 !min-h-0 rounded-full"
        >
          Open Protocol Shop →
        </Link>
      </GlassPanel>
    </div>
  );
}
