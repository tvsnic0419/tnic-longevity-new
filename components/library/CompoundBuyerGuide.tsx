'use client';

import Link from 'next/link';
import {
  ShieldCheck,
  AlertOctagon,
  FlaskConical,
  Scale,
  CheckCircle2,
} from 'lucide-react';
import type { CompoundBuyerGuide as BuyerGuide } from '@/lib/buyer-guides';
import { getProductPick } from '@/lib/product-picks';
import { ProductPickCard } from '@/components/shop/ProductPickCard';
import { cn } from '@/lib/utils';

interface CompoundBuyerGuideProps {
  guide: BuyerGuide;
  compact?: boolean;
  className?: string;
}

export function CompoundBuyerGuidePanel({
  guide,
  compact = false,
  className,
}: CompoundBuyerGuideProps) {
  const productPick = getProductPick(guide.compoundId);

  return (
    <section
      id="buyer-guide"
      aria-labelledby={`buyer-${guide.compoundId}-heading`}
      className={cn(
        'rounded-2xl border border-accent-amber/25 bg-gradient-to-br from-accent-amber/5 via-transparent to-accent-cyan/5 overflow-hidden',
        className,
      )}
    >
      <div className="px-5 py-4 border-b border-border/60 bg-muted/20 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-4 h-4 text-accent-amber" aria-hidden="true" />
            <p className="text-[10px] font-mono text-accent-amber uppercase tracking-widest">
              Brand-agnostic buyer guide
            </p>
          </div>
          <h2
            id={`buyer-${guide.compoundId}-heading`}
            className={cn('font-bold', compact ? 'text-base' : 'text-lg')}
          >
            {guide.title}
          </h2>
          {!compact && (
            <p className="text-sm text-muted-foreground mt-1">{guide.tagline}</p>
          )}
        </div>
        {guide.relatedCompareSlug && (
          <Link
            href={`/library/compare/${guide.relatedCompareSlug}`}
            className="focus-ring text-xs font-semibold text-accent-cyan hover:underline rounded shrink-0"
          >
            Compare alternatives →
          </Link>
        )}
      </div>

      <div className={cn('p-5 space-y-5', compact && 'space-y-4')}>
        {productPick && (
          <div className="grid md:grid-cols-[minmax(0,1fr)_240px] gap-4 items-start">
            <p className="text-sm text-muted-foreground leading-relaxed md:col-span-1">
              After verifying COA demands below, use this TNiC-matched pick — click the image to open
              the manufacturer product page.
            </p>
            <ProductPickCard pick={productPick} compact />
          </div>
        )}

        <div>
          <p className="text-label text-foreground mb-2 flex items-center gap-2">
            <FlaskConical className="w-3.5 h-3.5 text-accent-cyan" />
            Form requirements
          </p>
          <ul className="space-y-1.5">
            {guide.formRequirements.map((req) => (
              <li key={req} className="flex gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-accent-emerald shrink-0 mt-0.5" aria-hidden="true" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="glass rounded-xl p-4">
            <p className="text-label mb-3">COA demands</p>
            <ul className="space-y-2">
              {guide.coaDemands.map((item) => (
                <li key={item.id}>
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.detail}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass rounded-xl p-4">
            <p className="text-label mb-3 flex items-center gap-2">
              <Scale className="w-3.5 h-3.5" />
              RCT dose anchors
            </p>
            <ul className="space-y-2">
              {guide.doseAnchors.map((anchor) => (
                <li key={anchor.label} className="text-sm">
                  <span className="font-semibold">{anchor.label}:</span>{' '}
                  <span className="text-accent-cyan font-mono text-xs">{anchor.dose}</span>
                  {anchor.pmid && (
                    <a
                      href={`https://pubmed.ncbi.nlm.nih.gov/${anchor.pmid}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1.5 text-[10px] font-mono text-muted-foreground hover:text-accent-cyan"
                    >
                      PMID {anchor.pmid}
                    </a>
                  )}
                  {anchor.note && (
                    <p className="text-xs text-muted-foreground mt-0.5">{anchor.note}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-xl border border-accent-rose/20 bg-accent-rose/5 p-4">
          <p className="text-label text-accent-rose mb-2 flex items-center gap-2">
            <AlertOctagon className="w-3.5 h-3.5" />
            Red flags — walk away
          </p>
          <ul className="grid sm:grid-cols-2 gap-2">
            {guide.redFlags.map((flag) => (
              <li key={flag} className="text-sm text-muted-foreground flex gap-2">
                <span className="text-accent-rose shrink-0">×</span>
                {flag}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-muted-foreground border-t border-border/60 pt-4 leading-relaxed">
          {guide.sourcingNote}
        </p>
      </div>
    </section>
  );
}