import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Single source of truth for the per-product-card affiliate disclosure line
 * required wherever a buy link renders. Previously copy-pasted with minor
 * wording drift across GuideVerifiedPick.tsx, ProductsHub.tsx,
 * HomeEliteInterventions.tsx, and LibraryModuleDetail.tsx's fallbackPick
 * block — CompoundBuyerGuide.tsx's buy card had no disclosure at all. Text
 * is GuideVerifiedPick's original wording verbatim, not new phrasing.
 *
 * Deliberately separate from lib/protocol-shop.ts's `shopDisclosure` /
 * `commerceDisclosure` — that's the stack-level aggregate-view disclosure
 * for /shop, a different (already-approved) voice for a different surface.
 * Don't merge the two.
 */
export function AffiliateDisclosure({ className = '' }: { className?: string }) {
  return (
    <p className={cn('flex items-start gap-2 text-xs leading-relaxed text-muted-foreground', className)}>
      <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-amber" aria-hidden="true" />
      <span>
        Links to the manufacturer and may carry an affiliate token — at no extra cost to you.
        Commission never influences which product is picked or its evidence tier. Educational
        information, not medical advice; request a Certificate of Analysis before you buy.
      </span>
    </p>
  );
}
