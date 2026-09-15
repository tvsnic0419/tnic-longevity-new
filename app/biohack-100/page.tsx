import Link from 'next/link';
import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { FolioCard } from '@/components/biohack/FolioCard';
import { AcquisitionBlock } from '@/components/biohack/AcquisitionBlock';
import { buildPageMetadata } from '@/lib/seo';
import {
  BIO_BIBLE,
  DISCLOSED_FOLIO,
  FOLIO_CHOREOGRAPHY,
  FOLIO_CHOREOGRAPHY_SOURCE,
  MONOGRAPH_COMPOUND_COUNT,
  MONOGRAPH_TIERS,
} from '@/lib/bio-bible';

export const metadata = buildPageMetadata({
  title: `Bio Bible — ${BIO_BIBLE.headline}`,
  description:
    'A dual-exposure cartography drawn against the enzymatic and organelle lesions of methamphetamine and tobacco. Two folio cards disclosed; the remainder issued as a monograph.',
  path: '/biohack-100',
  keywords: [
    'harm reduction supplement protocol',
    'methamphetamine neurotoxicity supplements',
    'smoking oxidative stress protocol',
    'dual exposure longevity protocol',
  ],
});

export default function BioBiblePage() {
  return (
    <SubPageLayout>
      <article className="container-page pb-24">
        {/* ── Hero ───────────────────────────────────────────────────────── */}
        <header className="flex min-h-[70vh] flex-col justify-center py-20 md:min-h-[86vh]">
          <p className="text-label text-text-faint">{BIO_BIBLE.overline}</p>
          <h1
            className="mt-6 font-display leading-[0.95] tracking-tight text-text-primary"
            style={{ fontSize: 'clamp(2.75rem, 8vw, 7rem)' }}
          >
            {BIO_BIBLE.headline}
          </h1>
          <p className="text-lede mt-8 max-w-3xl text-text-secondary">{BIO_BIBLE.lead}</p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="#disclosed"
              className="focus-ring tnic-button-outline rounded-full px-6 py-3 text-sm"
            >
              {BIO_BIBLE.ctaSecondary}
            </Link>
            <Link
              href="#acquisition-heading"
              className="focus-ring link-underline text-sm text-text-secondary"
            >
              {BIO_BIBLE.ctaPrimary} →
            </Link>
          </div>
        </header>

        {/* ── Harm-reduction notice — editorial apparatus, not an alert ──── */}
        <section
          aria-labelledby="notice-heading"
          className="grid gap-6 border-t border-border-subtle py-10 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]"
        >
          <h2 id="notice-heading" className="text-label text-text-faint">
            Harm reduction notice
          </h2>
          <p className="max-w-2xl text-body text-text-muted">{BIO_BIBLE.notice}</p>
        </section>

        {/* ── The mandate ────────────────────────────────────────────────── */}
        <section
          aria-labelledby="mandate-heading"
          className="border-t border-border-subtle py-16"
        >
          <p className="text-label text-text-faint">The mandate</p>
          <h2 id="mandate-heading" className="heading-section mt-4 text-text-primary">
            Nine tiers, {MONOGRAPH_COMPOUND_COUNT} compounds.
          </h2>
          <p className="text-body mt-4 max-w-2xl text-text-muted">
            The monograph is organised by lesion, not by marketing category. Each tier answers a
            specific failure mode of the dual-exposure profile.
          </p>

          <ol className="mt-10 divide-y divide-border-subtle border-y border-border-subtle">
            {MONOGRAPH_TIERS.map((tier) => (
              <li
                key={tier.n}
                className="grid grid-cols-[3rem_minmax(0,1fr)_auto] items-baseline gap-4 py-4"
              >
                <span className="font-mono text-sm tabular-nums text-text-faint">
                  {String(tier.n).padStart(2, '0')}
                </span>
                <span className="font-display text-lg leading-tight text-text-primary">
                  {tier.name}
                </span>
                <span className="font-mono text-xs tabular-nums text-text-faint">
                  {tier.compounds} compounds
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* ── Disclosed folio ────────────────────────────────────────────── */}
        <section
          id="disclosed"
          aria-labelledby="disclosed-heading"
          className="scroll-mt-24 border-t border-border-subtle py-16"
        >
          <p className="text-label text-text-faint">Disclosed folio</p>
          <h2 id="disclosed-heading" className="heading-section mt-4 text-text-primary">
            Two cards, in full.
          </h2>
          <p className="text-body mt-4 max-w-2xl text-text-muted">
            Both are drawn from Tier II — Oxidative Fire Suppression — and both are already
            published in the open library in longer form. They are disclosed as a pairing because
            the substrate leg and the recycling leg do not make their argument alone.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {DISCLOSED_FOLIO.map((card) => (
              <FolioCard key={card.librarySlug} card={card} />
            ))}
          </div>

          <aside className="mt-8 border-t border-border-subtle pt-6">
            <p className="text-label text-text-faint">Chronobiology</p>
            <p className="mt-3 max-w-3xl font-display text-lg italic leading-relaxed text-text-secondary">
              {FOLIO_CHOREOGRAPHY}
            </p>
            <p className="mt-3 font-mono text-[0.625rem] uppercase tracking-wide text-text-faint">
              Provenance · {FOLIO_CHOREOGRAPHY_SOURCE}
            </p>
          </aside>
        </section>

        {/* ── Acquisition ────────────────────────────────────────────────── */}
        <AcquisitionBlock />

        {/* ── Clinical prudence ──────────────────────────────────────────── */}
        <section
          aria-labelledby="prudence-heading"
          className="mt-16 grid gap-6 border-t border-border-subtle pt-10 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]"
        >
          <h2 id="prudence-heading" className="text-label text-text-faint">
            Clinical prudence
          </h2>
          <div className="max-w-2xl space-y-4">
            <p className="text-body-sm text-text-muted">
              This folio is educational and is not medical advice. Discuss any protocol with a
              physician before starting it, particularly where stimulant exposure, cardiovascular
              strain, or hepatic load is involved, and particularly alongside prescribed
              medication. Establish a baseline blood panel first and retest on a defined interval
              rather than by feel.
            </p>
            <p className="text-body-sm text-text-muted">
              Evidence tiers shown on the disclosed cards follow the grading published at{' '}
              <Link href="/trust/methodology" className="focus-ring link-underline text-text-secondary">
                /trust/methodology
              </Link>
              . Tier B means the human outcome data does not yet exist at Tier A strength — it is
              stated, not hidden.
            </p>
          </div>
        </section>
      </article>
    </SubPageLayout>
  );
}
