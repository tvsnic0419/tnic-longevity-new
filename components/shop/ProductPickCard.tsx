'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ExternalLink, Check, Minus } from 'lucide-react';
import type { ProductPick } from '@/lib/product-picks';
import { computeTnicMatch } from '@/lib/tnic-match';

/**
 * TNiC Match — surfaces the transparent, criteria-based fit checklist from
 * `lib/tnic-match.ts` (built but never rendered). Explicitly NOT a purity or
 * lab-testing claim: each row is a deterministic yes/no on a disclosed
 * criterion, so a met/unmet state carries a text label + icon shape, never
 * colour alone.
 */
function TnicMatchChecklist({ pick, compact }: { pick: ProductPick; compact?: boolean }) {
  const match = computeTnicMatch(pick);
  const met = match.criteria.filter((c) => c.met).length;

  // Compact cards (dense grids) get a single, unobtrusive summary line rather
  // than the full grid, so the Match signal reaches every verified pick without
  // changing the layout's information density.
  if (compact) {
    return (
      <div className="mt-2 flex items-center gap-1.5 border-t border-border/50 pt-2">
        <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-accent-cyan/15 text-accent-cyan" aria-hidden="true">
          <Check className="h-2.5 w-2.5" />
        </span>
        <span className="text-micro text-muted-foreground">
          <span className="font-mono tabular-nums text-foreground/80">{met}/{match.criteria.length}</span> TNiC Match criteria
        </span>
      </div>
    );
  }

  return (
    <div className="mt-3 border-t border-border/50 pt-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-micro font-mono uppercase tracking-widest text-accent-cyan">TNiC Match</p>
        <span className="font-mono text-micro tabular-nums text-muted-foreground">{met}/{match.criteria.length} criteria</span>
      </div>
      <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {match.criteria.map((c) => (
          <li key={c.key} className="flex items-center gap-1.5 text-micro">
            <span
              className={`grid h-4 w-4 shrink-0 place-items-center rounded-full ${
                c.met ? 'bg-accent-emerald/15 text-accent-emerald' : 'bg-white/[0.05] text-muted-foreground/60'
              }`}
              aria-hidden="true"
            >
              {c.met ? <Check className="h-2.5 w-2.5" /> : <Minus className="h-2.5 w-2.5" />}
            </span>
            <span className={c.met ? 'text-foreground/80' : 'text-muted-foreground/70'}>
              {c.label}
              <span className="sr-only">: {c.met ? 'met' : 'not met'}</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-micro leading-relaxed text-muted-foreground/70">
        Transparent fit criteria — not a purity or lab-testing claim.
      </p>
    </div>
  );
}

interface ProductPickCardProps {
  pick: ProductPick;
  compact?: boolean;
  className?: string;
}

function ProductImage({
  src,
  fallbackSrc,
  alt,
  compact,
}: {
  src: string;
  fallbackSrc: string;
  alt: string;
  compact?: boolean;
}) {
  const [imgSrc, setImgSrc] = useState(src);
  const size = compact ? 72 : 120;

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={size}
      height={size}
      className="object-contain rounded-lg bg-white/5"
      onError={() => {
        if (imgSrc !== fallbackSrc) setImgSrc(fallbackSrc);
      }}
      unoptimized={imgSrc.endsWith('.svg')}
    />
  );
}

export function ProductPickCard({ pick, compact, className }: ProductPickCardProps) {
  return (
    <div
      className={`premium-card overflow-hidden ${
        compact ? 'p-3' : 'p-4'
      } ${className ?? ''}`}
    >
      <a
        href={`/api/go/${pick.compoundId}`}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="flex gap-4 group"
        aria-label={`Buy ${pick.productName} from ${pick.brand}`}
      >
        <ProductImage
          src={pick.imageSrc}
          fallbackSrc={pick.fallbackImageSrc}
          alt={`${pick.brand} ${pick.productName}`}
          compact={compact}
        />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-accent-emerald uppercase tracking-wide">{pick.brand}</p>
          <p className={`font-medium text-foreground group-hover:text-accent-cyan transition-colors ${compact ? 'text-sm' : 'text-base'}`}>
            {pick.productName}
          </p>
          {!compact && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{pick.whyThisPick}</p>
          )}
          <span className="inline-flex items-center gap-1 text-xs text-accent-emerald mt-2">
            Buy on {pick.brand.split(' ')[0]}
            <ExternalLink className="w-3 h-3" />
          </span>
        </div>
      </a>

      {pick.companionPurchase && (
        <a
          href={`/api/go/${pick.compoundId}?companion=true`}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="mt-3 flex items-center gap-2 text-xs text-accent-amber hover:text-accent-amber/80 border-t border-border/50 pt-3"
        >
          <ExternalLink className="w-3 h-3 shrink-0" />
          {pick.companionPurchase.label}
        </a>
      )}

      <TnicMatchChecklist pick={pick} compact={compact} />

      {!compact && (
        <p className="text-xs text-muted-foreground mt-3 border-t border-border/50 pt-2">
          {pick.doseNote}
          {pick.linkVerifiedAt && (
            <span className="block mt-1">Link verified {pick.linkVerifiedAt}</span>
          )}
        </p>
      )}
    </div>
  );
}