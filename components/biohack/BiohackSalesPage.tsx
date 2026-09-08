import Link from 'next/link';
import {
  BIOHACK_CARDS,
  BIOHACK_DAMAGE,
  BIOHACK_PRICE_USD,
  BIOHACK_STACKS,
  BIOHACK_TIERS,
  previewCards,
} from '@/lib/biohack/protocol';
import { BiohackCardView } from '@/components/biohack/BiohackCard';
import { BiohackCheckout } from '@/components/biohack/BiohackCheckout';
import { GlassPanel } from '@/components/ui/GlassPanel';

export function BiohackSalesPage({
  checkoutUrl,
  needAccess = false,
}: {
  checkoutUrl: string;
  needAccess?: boolean;
}) {
  const price = Number.isFinite(BIOHACK_PRICE_USD) ? BIOHACK_PRICE_USD : 49;
  const preview = previewCards();

  return (
    <div className="section-deep">
      <div className="container-page max-w-4xl py-16 md:py-24">
        {needAccess && (
          <p className="mb-8 rounded-2xl border border-accent-amber/30 bg-accent-amber/10 px-4 py-3 text-sm text-foreground">
            That reader is gated. Unlock the Bio Bible to open the full deck.
          </p>
        )}

        <p className="text-eyebrow text-accent-cyan">Paid intelligence · not a wellness brochure</p>
        <h1 className="headline-editorial mt-4">Information they do not want indexed.</h1>
        <p className="mt-3 font-display text-3xl tracking-tight text-accent-cyan md:text-4xl">
          TNiC Bio Bible — BIOHACK 100
        </p>
        <p className="mt-3 text-lg text-accent-amber">The 40-compound dual-exposure protocol</p>
        <p className="text-body mt-6 max-w-2xl">
          Consumer longevity media sells NMN and morning sunlight. This drop maps what meth and
          tobacco actually burn — glutathione, NAD+, membranes, cilia, methylation — and the
          forty-card wiring diagram used to cover those holes. Mechanism-first. No brand inventory
          to protect. Educational reference, not a prescription.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <BiohackCheckout href={checkoutUrl} price={price} />
          <Link
            href="/biohack-100/preview"
            className="focus-ring btn-ghost-premium inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold"
          >
            Read the two public cards
          </Link>
        </div>

        <ul className="mt-8 flex flex-wrap gap-2 text-caption">
          {['40 compounds', '9 tiers', '7 stacks they skip', 'Daily clock'].map((chip) => (
            <li key={chip} className="rounded-full border border-border/60 px-3 py-1">
              {chip}
            </li>
          ))}
        </ul>

        <section className="mt-16">
          <p className="text-eyebrow text-accent-cyan">Why this is paid</p>
          <h2 className="heading-section mt-2">The free library stays polite. This file does not.</h2>
          <div className="mt-6 space-y-3 text-body-sm text-muted-foreground">
            <p>
              tnic.help remains a free, PubMed-backed library. Bio Bible is a separate information
              product: the dual-exposure map that affiliate pages and clinic brochures will not
              publish because the customer is not a clean keto influencer.
            </p>
            <p>
              You are buying the protocol object — cards, synergy wiring, clock, off-period rules —
              not a miracle and not medical advice.
            </p>
          </div>
        </section>

        <section className="mt-16">
          <p className="text-eyebrow text-accent-cyan">Protocol briefing</p>
          <h2 className="heading-section mt-2">What the dual-exposure profile destroys</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <GlassPanel depth="mid" className="rounded-2xl p-5">
              <h3 className="text-sm font-semibold tracking-wide text-accent-violet">What meth destroys</h3>
              <ul className="mt-3 space-y-2 text-body-sm">
                {BIOHACK_DAMAGE.meth.map((row) => (
                  <li key={row}>{row}</li>
                ))}
              </ul>
            </GlassPanel>
            <GlassPanel depth="mid" className="rounded-2xl p-5">
              <h3 className="text-sm font-semibold tracking-wide text-accent-cyan">What smoking destroys</h3>
              <ul className="mt-3 space-y-2 text-body-sm">
                {BIOHACK_DAMAGE.smoke.map((row) => (
                  <li key={row}>{row}</li>
                ))}
              </ul>
            </GlassPanel>
          </div>
        </section>

        <section className="mt-16">
          <p className="text-eyebrow text-accent-cyan">Nine-tier map</p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-caption tracking-wide text-muted-foreground">
                  <th className="py-2 pr-3">Tier</th>
                  <th className="py-2 pr-3">Domain</th>
                  <th className="py-2 pr-3">Cards</th>
                  <th className="py-2">Job</th>
                </tr>
              </thead>
              <tbody>
                {BIOHACK_TIERS.map((tier) => (
                  <tr key={tier.id} className="border-t border-border/40">
                    <td className="py-3 pr-3 font-mono text-accent-cyan">{String(tier.id).padStart(2, '0')}</td>
                    <td className="py-3 pr-3">{tier.domain}</td>
                    <td className="py-3 pr-3">{tier.cards}</td>
                    <td className="py-3 text-muted-foreground">{tier.job}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-16 space-y-4">
          <p className="text-eyebrow text-accent-cyan">Public slice</p>
          <h2 className="heading-section mt-2">Cards 01–02 only</h2>
          {preview.map((card) => (
            <BiohackCardView key={card.num} card={card} />
          ))}
          <p className="text-caption">{BIOHACK_CARDS.length - 2} cards stay behind the unlock.</p>
        </section>

        <section className="mt-16">
          <p className="text-eyebrow text-accent-cyan">What you are buying</p>
          <ul className="mt-4 space-y-2 text-body-sm">
            <li>The full 40-card reader</li>
            <li>Designed PDF (dark-room reference)</li>
            <li>Seven load-bearing stacks, starting with {BIOHACK_STACKS[0].name}</li>
            <li>Daily clock plus four-week wave-in notes</li>
            <li>Off-period rules for Mucuna and 5-HTP — the part polite guides omit</li>
          </ul>
        </section>

        <section className="mt-16">
          <GlassPanel depth="mid" className="rounded-2xl border border-accent-rose/30 p-5">
            <p className="text-sm font-semibold tracking-wide text-accent-rose">Physician + labs</p>
            <p className="mt-2 text-body-sm">
              Educational reference only. Consult a physician. Nattokinase and high-dose omega-3
              potentiate anticoagulants. Berberine and EGCG hit CYP and transporters. 5-HTP and
              Mucuna are off-period only — never with MAOIs, SSRIs, or active meth use.
            </p>
          </GlassPanel>
        </section>

        <section className="mt-16">
          <h2 className="heading-section">FAQ</h2>
          <dl className="mt-6 space-y-6">
            <div>
              <dt className="font-semibold">Is this secret medical advice?</dt>
              <dd className="mt-1 text-body-sm text-muted-foreground">
                No. It is paid information. Dose ranges are working ranges for an educational
                protocol, not a prescription and not a claim that the stack erases exposure.
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Why isn't this in the free library?</dt>
              <dd className="mt-1 text-body-sm text-muted-foreground">
                The free library covers compounds and hallmarks. This is a specialized dual-exposure
                wiring diagram. Different object. Different price.
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Do I need an account?</dt>
              <dd className="mt-1 text-body-sm text-muted-foreground">
                No sitewide account. Checkout issues a signed cookie scoped to this product.
              </dd>
            </div>
          </dl>
        </section>

        <div className="mt-12">
          <BiohackCheckout href={checkoutUrl} price={price} />
        </div>
      </div>
    </div>
  );
}
