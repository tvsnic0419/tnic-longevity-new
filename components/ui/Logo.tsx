import Image from 'next/image';

interface LogoProps {
  /**
   * `lockup` — emblem + NIC wordmark. The default site mark.
   * `emblem` — emblem alone, for widths too tight for the wordmark.
   */
  variant?: 'emblem' | 'lockup';
  size?: 'nav' | 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
  /** Set on the nav instance: the mark is above the fold on every route. */
  priority?: boolean;
  alt?: string;
}

/**
 * The mark is rendered artwork (brushed metal, neon strand, leaves), not type
 * plus a shape, so it ships as a raster cut from the master render rather than
 * being redrawn as SVG — redrawing it would lose the material that makes it the
 * logo. `scripts/build-brand-assets.mjs` derives both files from
 * `public/brand/tnic-transformative-lockup.png` and documents the method.
 *
 * Intrinsic sizes below are the real pixel dimensions of those files; they set
 * the aspect ratio that reserves layout space, and the rendered box is driven by
 * height alone (`w-auto`) so the two variants stay proportional at every size.
 */
const ASSETS = {
  lockup: { src: '/brand/tnic-lockup.png', width: 760, height: 382 },
  emblem: { src: '/brand/tnic-emblem.png', width: 400, height: 431 },
} as const;

/**
 * Height ladder, in the same order as the rest of the type scale. The nav step
 * is deliberately the smallest: the wordmark's counters start to fill in below
 * about 32px, and the emblem's strand turns to mush below about 28px.
 */
const heightClass: Record<NonNullable<LogoProps['size']>, string> = {
  nav: 'h-9 md:h-11',
  sm: 'h-8',
  md: 'h-12 md:h-14',
  lg: 'h-16 md:h-20',
  hero: 'h-20 md:h-24',
};

/**
 * Widths requested from the image optimizer. The mark is small and detailed, so
 * these are set at roughly 2× the largest rendered box for each step rather than
 * left to the default responsive ladder, which would over-fetch.
 */
const sizesAttr: Record<NonNullable<LogoProps['size']>, string> = {
  nav: '160px',
  sm: '128px',
  md: '224px',
  lg: '320px',
  hero: '384px',
};

export function Logo({
  variant = 'lockup',
  size = 'md',
  className = '',
  priority = false,
  alt,
}: LogoProps) {
  const asset = ASSETS[variant];
  const altText = alt || 'TNiC – Transformative Nutrition in Cell-Health';

  return (
    <span className={`brand-mark ${className}`}>
      <Image
        src={asset.src}
        alt={altText}
        width={asset.width}
        height={asset.height}
        sizes={sizesAttr[size]}
        quality={90}
        priority={priority}
        className={`w-auto ${heightClass[size]}`}
      />
    </span>
  );
}

export type { LogoProps };
