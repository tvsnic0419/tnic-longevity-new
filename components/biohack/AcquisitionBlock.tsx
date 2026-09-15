import { BIO_BIBLE, BIO_BIBLE_COMMERCE, MONOGRAPH_COMPOUND_COUNT } from '@/lib/bio-bible';

/**
 * The acquisition surface.
 *
 * Invariant, mirroring `GuideVerifiedPick`: when the Stripe Payment Link is not
 * configured, this renders an honest "not yet open" notice instead of a button
 * that goes nowhere. A checkout control that 404s costs more trust than an
 * absent one, and on a page selling a harm-reduction monograph that trust is
 * the whole asset.
 */
export function AcquisitionBlock() {
  const { paymentUrl, price } = BIO_BIBLE_COMMERCE;
  const isOpen = paymentUrl.length > 0;

  return (
    <section
      aria-labelledby="acquisition-heading"
      className="border-t border-border-subtle pt-12"
    >
      <div className="grid gap-8 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]">
        <p className="text-label text-text-faint">Acquisition</p>

        <div className="max-w-2xl space-y-6">
          <h2 id="acquisition-heading" className="heading-section text-text-primary">
            The remainder is sold as a monograph.
          </h2>
          <p className="text-body text-text-muted">
            {MONOGRAPH_COMPOUND_COUNT} compounds across nine tiers, each with its dose, its
            molecular node, its synergy mandate, and its chronobiology. Two cards are disclosed
            above. The full folio, its damage cartography, and its seven priority synergy stacks
            are the monograph.
          </p>

          {isOpen ? (
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={paymentUrl}
                className="focus-ring btn-gradient rounded-full !px-7 !py-3 text-sm"
              >
                {BIO_BIBLE.ctaPrimary}
              </a>
              {price && (
                <span className="font-mono text-sm tabular-nums text-text-muted">{price}</span>
              )}
            </div>
          ) : (
            <p className="border-l-2 border-border-strong pl-4 font-mono text-xs leading-relaxed tracking-wide text-text-faint">
              ACQUISITION NOT YET OPEN — the monograph&rsquo;s checkout is not configured in this
              environment. No payment can be taken and no folio is served.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
