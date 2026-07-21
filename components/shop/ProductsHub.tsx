'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Package, ShieldCheck } from 'lucide-react';
import { PRODUCT_PICKS, type ProductPick } from '@/lib/product-picks';
import { compounds } from '@/lib/data';
import { PageHeader } from '@/components/ui/PageHeader';
import { ContextRail } from '@/components/ui/ContextRail';
import { getHubContext } from '@/lib/hub-context';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { RevealCard } from '@/components/ui/RevealCard';
import type { EvidenceTier } from '@/lib/types';

const picks = Object.values(PRODUCT_PICKS).filter((p) => p.compoundId !== 'nr');

const libraryOnlyCompounds = compounds.filter((c) => !PRODUCT_PICKS[c.id]);

const hallmarkLabels: Record<string, string> = {
  mito: 'Mitochondria', genomic: 'DNA Integrity', epigenetic: 'Epigenetics',
  telomeres: 'Telomeres', proteostasis: 'Proteostasis', autophagy: 'Autophagy',
  senescence: 'Senescence', stem: 'Stem Cells', communication: 'Cell Signals',
  inflammation: 'Inflammation', dysbiosis: 'Microbiome', nutrient: 'Nutrient Sensing',
};

function ProductCard({ pick }: { pick: ProductPick }) {
  const compound = compounds.find((c) => c.id === pick.compoundId);
  const tier = compound?.evidence as EvidenceTier | undefined;
  const hallmarkTargets = compound?.hallmarks?.slice(0, 3) ?? [];

  /*
    Intentionally NOT a GlassPanel: this card uses a "stretched link" overlay
    (the absolute inset-0 <a> below, layered behind pointer-events-none
    content). GlassPanel's `.glass-deep > *` rule forces `position: relative`
    on every direct child via unlayered CSS that outranks Tailwind's `absolute`
    utility, which would collapse that overlay and break the whole-card click
    target. card-premium stays here on purpose.
  */
  return (
    <div className="group relative card-premium glow-hover-emerald rounded-2xl border border-border/80 overflow-hidden flex flex-col h-full">
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
      <div className="relative pointer-events-none flex items-center justify-center bg-white/[0.03] h-48 overflow-hidden border-b border-border/50">
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
            <EvidenceTag tier={tier} size="sm" />
          </div>
        )}
        <span className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1 text-[10px] font-semibold bg-accent-emerald/90 text-black px-2 py-1 rounded-full">
          Buy on {pick.brand.split(' ')[0]} <ExternalLink className="w-2.5 h-2.5" />
        </span>
      </div>

      <div className="relative pointer-events-none p-5 flex flex-col flex-1">
        <p className="text-[11px] font-semibold text-accent-emerald uppercase tracking-widest mb-1">
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
                className="text-[9px] font-semibold px-1.5 py-0.5 rounded border"
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
        <div className="pt-3 border-t border-border/50 flex items-center justify-between gap-2">
          <p className="text-[11px] text-muted-foreground/70 leading-snug line-clamp-2">{pick.doseNote}</p>
          <span className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-accent-emerald">
            Buy <ExternalLink className="w-3 h-3" />
          </span>
        </div>
        {pick.companionPurchase && (
          <p className="mt-3 text-[11px] text-accent-amber/90 border-t border-border/30 pt-3">
            + {pick.companionPurchase.label}
          </p>
        )}
        <Link
          href={`/library/compounds/${pick.compoundId}`}
          className="relative z-10 pointer-events-auto mt-3 inline-block text-[11px] font-semibold text-accent-violet hover:underline"
        >
          Read {pick.compoundName} evidence module →
        </Link>
      </div>
    </div>
  );
}

export function ProductsHub() {
  return (
    <div className="container-page py-10 md:py-14 max-w-6xl section-mesh">
      <PageHeader
        icon={Package}
        eyebrow="Verified Picks"
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
        {picks.map((pick) => (
          <ProductCard key={pick.compoundId} pick={pick} />
        ))}
      </div>

      {libraryOnlyCompounds.length > 0 && (
        <div className="mb-14">
          <h2 className="text-lg font-bold mb-2">Evidence modules — no verified pick yet</h2>
          <p className="text-sm text-muted-foreground mb-5 max-w-2xl">
            These Tier B compounds have full library deep-dives and stack integration. TNiC adds manufacturer picks only after dose-matched COA verification — not before.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  className="focus-ring block rounded-2xl p-5 hover:border-accent-violet/40 transition group h-full"
                >
                  <p className="text-[11px] font-semibold text-accent-cyan uppercase tracking-widest mb-1">
                    Tier {c.evidence} · Library only
                  </p>
                  <h3 className="font-bold text-foreground group-hover:text-accent-violet transition-colors mb-2">
                    {c.name}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-3">{c.desc}</p>
                  <p className="text-[11px] text-muted-foreground/80">{c.dose}</p>
                  <span className="inline-block mt-3 text-xs font-semibold text-accent-violet group-hover:underline">
                    Read evidence module →
                  </span>
                </Link>
              </RevealCard>
            ))}
          </div>
        </div>
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