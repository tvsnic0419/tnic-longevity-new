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
            The reader is reserved to purchasers. Acquire the monograph to open the full folio.
          </p>
        )}

        <p className="text-eyebrow text-accent-cyan">Paid intelligence · not a lifestyle pamphlet</p>
        <h1 className="headline-editorial mt-4">Intelligence they prefer unindexed.</h1>
        <p className="mt-3 font-display text-3xl tracking-tight text-accent-cyan md:text-4xl">
          TNiC Bio Bible — BIOHACK 100
        </p>
        <p className="mt-3 text-lg text-accent-amber">A forty-compound dual-exposure monograph</p>
        <p className="text-body mt-6 max-w-2xl">
          Conventional longevity media trades in nicotinamide mononucleotide and pastoral light.
          This document maps the lesions methamphetamine and tobacco actually impose —
          glutathione collapse, NAD expenditure, membrane peroxidation, mucociliary failure,
          disordered methylation — and the forty-card architecture assembled to cover those
          nodes. Mechanism first. No inventory to defend. An educational reference, not a
          prescription.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <BiohackCheckout href={checkoutUrl} price={price} />
          <Link
            href="/biohack-100/preview"
            className="focus-ring btn-ghost-premium inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold"
          >
            Inspect the public folio
          </Link>
        </div>

        <ul className="mt-8 flex flex-wrap gap-2 text-caption">
          {[
            '40 compounds',
            '9 tiers',
            '7 load-bearing stacks',
            'Circadian clock',
            '800+ investigative hours',
            '14 nutritionist experts',
            '6 licensed physicians',
          ].map((chip) => (
            <li key={chip} className="rounded-full border border-border/60 px-3 py-1">
              {chip}
            </li>
          ))}
        </ul>

        <GlassPanel depth="mid" className="mt-8 rounded-2xl p-5">
          <p className="text-sm font-semibold tracking-wide text-accent-cyan">Provenance</p>
          <p className="mt-2 text-body-sm text-muted-foreground">
            More than eight hundred hours of machine-assisted literature interrogation,
            subsequently reviewed by fourteen certified nutritionist experts and six
            board-certified, licensed physicians. That panel examined working ranges,
            chronobiology, and duration — the efficiency with which each node is dosed
            and the interval over which it is held. You are acquiring that cartography.
            Educational monograph: neither a clinical trial nor a license to prescribe.
          </p>
        </GlassPanel>

        <section className="mt-16">
          <p className="text-eyebrow text-accent-cyan">Why the fee exists</p>
          <h2 className="heading-section mt-2">The library keeps its manners. This volume does not.</h2>
          <div className="mt-6 space-y-3 text-body-sm text-muted-foreground">
            <p>
              tnic.help remains an open, PubMed-anchored library. Bio Bible is a distinct
              information object: the dual-exposure map that affiliate catalogues and clinic
              brochures decline to print, because the intended reader is not a sanitized
              wellness archetype.
            </p>
            <p>
              Acquisition purchases the protocol itself — cards, synergistic wiring, circadian
              clock, off-period constraints — not a panacea and not medical counsel.
            </p>
          </div>
        </section>

        <section className="mt-16">
          <p className="text-eyebrow text-accent-cyan">Protocol briefing</p>
          <h2 className="heading-section mt-2">What the dual-exposure profile dismantles</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <GlassPanel depth="mid" className="rounded-2xl p-5">
              <h3 className="text-sm font-semibold tracking-wide text-accent-violet">Methamphetamine</h3>
              <ul className="mt-3 space-y-2 text-body-sm">
                {BIOHACK_DAMAGE.meth.map((row) => (
                  <li key={row}>{row}</li>
                ))}
              </ul>
            </GlassPanel>
            <GlassPanel depth="mid" className="rounded-2xl p-5">
              <h3 className="text-sm font-semibold tracking-wide text-accent-cyan">Tobacco smoke</h3>
              <ul className="mt-3 space-y-2 text-body-sm">
                {BIOHACK_DAMAGE.smoke.map((row) => (
                  <li key={row}>{row}</li>
                ))}
              </ul>
            </GlassPanel>
          </div>
        </section>

        <section className="mt-16">
          <p className="text-eyebrow text-accent-cyan">Nine-tier architecture</p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-caption tracking-wide text-muted-foreground">
                  <th className="py-2 pr-3">Tier</th>
                  <th className="py-2 pr-3">Domain</th>
                  <th className="py-2 pr-3">Cards</th>
                  <th className="py-2">Mandate</th>
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
          <p className="text-eyebrow text-accent-cyan">Public folio</p>
          <h2 className="heading-section mt-2">Cards 01–02 only</h2>
          {preview.map((card) => (
            <BiohackCardView key={card.num} card={card} />
          ))}
          <p className="text-caption">
            {BIOHACK_CARDS.length - 2} cards remain reserved to acquisition.
          </p>
        </section>

        <section className="mt-16">
          <p className="text-eyebrow text-accent-cyan">What acquisition includes</p>
          <ul className="mt-4 space-y-2 text-body-sm">
            <li>The complete forty-card reader</li>
            <li>Designed PDF — dark-room reference</li>
            <li>Seven load-bearing stacks, beginning with {BIOHACK_STACKS[0].name}</li>
            <li>Circadian clock and four-week wave-in notes</li>
            <li>Off-period constraints for Mucuna and 5-HTP — omitted from polite guides</li>
          </ul>
        </section>

        <section className="mt-16">
          <GlassPanel depth="mid" className="rounded-2xl border border-accent-rose/30 p-5">
            <p className="text-sm font-semibold tracking-wide text-accent-rose">Clinical caution</p>
            <p className="mt-2 text-body-sm">
              Educational reference only. Consult a physician. Nattokinase and high-dose
              omega-3 potentiate anticoagulants. Berberine and EGCG engage CYP isoforms and
              transporters. 5-HTP and Mucuna are off-period only — never concurrent with
              MAOIs, SSRIs, or active methamphetamine use.
            </p>
          </GlassPanel>
        </section>

        <section className="mt-16">
          <h2 className="heading-section">Inquiries</h2>
          <dl className="mt-6 space-y-6">
            <div>
              <dt className="font-semibold">Is this covert medical advice?</dt>
              <dd className="mt-1 text-body-sm text-muted-foreground">
                No. It is purchased intelligence. Dose figures are working ranges for an
                educational protocol — neither a prescription nor a claim that any stack
                extinguishes exposure.
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Why is this absent from the open library?</dt>
              <dd className="mt-1 text-body-sm text-muted-foreground">
                The library treats compounds and hallmarks. This is a specialized
                dual-exposure cartography. Distinct object. Distinct price.
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Is a sitewide account required?</dt>
              <dd className="mt-1 text-body-sm text-muted-foreground">
                No. Checkout issues a signed cookie scoped to this product alone.
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
