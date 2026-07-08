'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import type { ProductPick } from '@/lib/product-picks';

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
      className={`rounded-xl border border-border/60 bg-card/50 overflow-hidden ${
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