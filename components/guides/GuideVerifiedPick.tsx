import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, BookOpen, ShieldCheck } from 'lucide-react';
import { PRODUCT_PICKS } from '@/lib/product-picks';
import { compounds } from '@/lib/data';
import { EvidenceTag } from '@/components/trust/EvidenceTag';

/**
 * Verified-pick buy card for the commercial-intent supplement guides.
 *
 * These guide pages are the site's highest-intent SEO landing surfaces
 * ("best NAD+ supplements 2026", etc.) — a reader who has just compared the
 * options is at the point of purchase, yet the guides previously offered no
 * direct path to the verified product and its first-party affiliate redirect.
 * This closes that gap with a single, crawlable, server-rendered card that
 * mirrors the homepage EliteCard contract:
 *
 *   - buy   → /api/go/<id>  (first-party affiliate redirect, rel="sponsored")
 *   - learn → /library/compounds/<id> (the graded evidence module)
 *
 * It joins the verified brand + buy link (lib/product-picks.ts) with the
 * evidence tier, dose, and PMID count (lib/data.ts), and never renders a buy
 * button next to a fabricated tier — if either source is missing for the id,
 * it renders nothing.
 */
export function GuideVerifiedPick({
  compoundId,
  className = '',
}: {
  compoundId: string;
  className?: string;
}) {
  const pick = PRODUCT_PICKS[compoundId];
  const compound = compounds.find((c) => c.id === compoundId);
  if (!pick || !compound) return null;

  const brandShort = pick.brand.split(' ')[0];
  const studyCount = compound.studies?.length ?? 0;

  return (
    <aside
      aria-label={`Verified product pick for ${compound.name}`}
      className={`overflow-hidden rounded-2xl border border-accent-emerald/25 bg-gradient-to-b from-accent-emerald/[0.06] to-card/20 ${className}`}
    >
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
        {/* Product image */}
        <div className="relative flex h-28 w-28 shrink-0 items-center justify-center self-center rounded-xl border border-border/50 bg-white/[0.03] sm:self-auto">
          <span className="absolute left-2 top-2 z-10">
            <EvidenceTag tier={compound.evidence} size="sm" />
          </span>
          <Image
            src={pick.imageSrc}
            alt={`${pick.brand} ${pick.productName}`}
            width={96}
            height={96}
            className="max-h-24 object-contain"
            unoptimized={pick.imageSrc.endsWith('.svg')}
          />
        </div>

        {/* Copy + facts */}
        <div className="min-w-0 flex-1">
          <p className="text-label mb-1 text-accent-emerald">TNiC verified pick</p>
          <p className="font-display text-lg font-medium tracking-tight text-foreground">
            {pick.brand} — <span className="text-[var(--color-text-secondary)]">{pick.productName}</span>
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{pick.whyThisPick}</p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
            <span>
              <span className="font-mono font-semibold text-foreground">{studyCount}</span> human studies cited
            </span>
            <span>
              Studied dose: <span className="font-semibold text-foreground">{compound.dose}</span>
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 flex-col gap-2 sm:w-44">
          <a
            href={`/api/go/${compoundId}`}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="focus-ring group inline-flex items-center justify-center gap-1.5 rounded-xl bg-accent-emerald/15 px-4 py-2.5 text-sm font-semibold text-accent-emerald transition-colors hover:bg-accent-emerald/25"
            aria-label={`Buy ${pick.productName} from ${pick.brand} — opens manufacturer site`}
          >
            Buy on {brandShort}
            <ExternalLink
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
          {pick.companionPurchase && (
            <a
              href={`/api/go/${compoundId}?companion=true`}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="focus-ring inline-flex items-center justify-center gap-1.5 rounded-xl border border-accent-amber/30 px-4 py-2 text-xs font-semibold text-accent-amber transition-colors hover:border-accent-amber/50"
            >
              <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
              {pick.companionPurchase.label}
            </a>
          )}
          <Link
            href={`/library/compounds/${compoundId}`}
            className="focus-ring inline-flex items-center justify-center gap-1.5 rounded-xl border border-border/70 px-4 py-2 text-sm font-semibold text-[var(--color-text-secondary)] transition-colors hover:border-accent-cyan/40 hover:text-accent-cyan"
          >
            <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
            Read the evidence
          </Link>
        </div>
      </div>

      {/* Affiliate disclosure — required wherever a buy link leads */}
      <p className="flex items-start gap-2 border-t border-accent-emerald/15 bg-black/10 px-5 py-3 text-xs leading-relaxed text-muted-foreground sm:px-6">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-amber" aria-hidden="true" />
        <span>
          Links to the manufacturer and may carry an affiliate token — at no extra cost to you.
          Commission never influences which product is picked or its evidence tier. Educational
          information, not medical advice; request a Certificate of Analysis before you buy.
        </span>
      </p>
    </aside>
  );
}
