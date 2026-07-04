'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ExternalLink, ShieldCheck } from 'lucide-react';

export interface ProductCardProps {
  name: string;
  brand: string;
  description: string;
  dosageNote?: string;
  purchaseUrl: string;
  imageSrc?: string;
  evidenceLevel?: 'strong' | 'moderate' | 'emerging';
  tags?: string[];
  compact?: boolean;
  className?: string;
}

const EVIDENCE_CONFIG = {
  strong: { label: 'Strong Evidence', color: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10' },
  moderate: { label: 'Moderate Evidence', color: 'text-amber-400 border-amber-400/30 bg-amber-400/10' },
  emerging: { label: 'Emerging Evidence', color: 'text-sky-400 border-sky-400/30 bg-sky-400/10' },
} as const;

function ProductImage({ src, alt, compact }: { src?: string; alt: string; compact?: boolean }) {
  const [errored, setErrored] = useState(false);
  const size = compact ? 64 : 104;

  if (!src || errored) {
    return (
      <div
        style={{ width: size, height: size }}
        className="rounded-lg bg-white/5 flex items-center justify-center text-white/20 text-xs shrink-0"
      >
        IMG
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      sizes={compact ? '64px' : '104px'}
      className="object-contain rounded-lg bg-white/5 shrink-0"
      onError={() => setErrored(true)}
      unoptimized={src.endsWith('.svg')}
    />
  );
}

export function ProductCard({
  name,
  brand,
  description,
  dosageNote,
  purchaseUrl,
  imageSrc,
  evidenceLevel,
  tags = [],
  compact = false,
  className = '',
}: ProductCardProps) {
  const evidence = evidenceLevel ? EVIDENCE_CONFIG[evidenceLevel] : null;

  return (
    <div
      className={`rounded-xl border border-border/60 bg-card/50 overflow-hidden ${
        compact ? 'p-3' : 'p-5'
      } ${className}`}
    >
      <a
        href={purchaseUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="flex gap-4 group"
        aria-label={`Buy ${name} by ${brand}`}
      >
        <ProductImage src={imageSrc} alt={`${brand} ${name}`} compact={compact} />

        <div className="flex-1 min-w-0">
          <p className="text-xs text-emerald-400 uppercase tracking-wide font-medium">{brand}</p>
          <p
            className={`font-semibold text-foreground group-hover:text-cyan-400 transition-colors ${
              compact ? 'text-sm' : 'text-base'
            } mt-0.5`}
          >
            {name}
          </p>

          {!compact && (
            <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">{description}</p>
          )}

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {evidence && (
              <span
                className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${evidence.color}`}
              >
                <ShieldCheck className="w-3 h-3" />
                {evidence.label}
              </span>
            )}
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full border border-border/50 text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>

          <span className="inline-flex items-center gap-1 text-xs text-emerald-400 mt-2.5 group-hover:text-emerald-300 transition-colors">
            Shop on {brand}
            <ExternalLink className="w-3 h-3" />
          </span>
        </div>
      </a>

      {!compact && dosageNote && (
        <p className="text-xs text-muted-foreground mt-4 border-t border-border/50 pt-3">
          {dosageNote}
        </p>
      )}
    </div>
  );
}

export default ProductCard;
