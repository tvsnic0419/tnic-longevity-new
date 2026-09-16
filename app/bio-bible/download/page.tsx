import Link from 'next/link';
import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { buildPageMetadata } from '@/lib/seo';
import { verifyCheckoutSession } from '@/lib/stripe-session';

/**
 * Post-payment delivery gate.
 *
 * Stripe's Payment Link redirects here with `?session_id={CHECKOUT_SESSION_ID}`.
 * Nothing is served until that session is verified `paid` against the Stripe
 * API server-side, so the download address is not guessable and not shareable
 * into a free copy.
 *
 * `noIndex` is deliberate: a receipt page must never be crawled.
 */
export const metadata = buildPageMetadata({
  title: 'Bio Bible — Delivery',
  description: 'Verified delivery of the Bio Bible monograph.',
  path: '/bio-bible/download',
  noIndex: true,
});

// The Stripe read must happen per-request, never at build time.
export const dynamic = 'force-dynamic';

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <SubPageLayout>
      <div className="container-page flex min-h-[60vh] flex-col justify-center py-20">
        <div className="max-w-2xl space-y-6">{children}</div>
      </div>
    </SubPageLayout>
  );
}

export default async function BioBibleDownloadPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;

  if (!sessionId) {
    return (
      <Shell>
        <p className="text-label text-text-faint">Delivery</p>
        <h1 className="heading-section text-text-primary">No session presented.</h1>
        <p className="text-body text-text-muted">
          This address serves the monograph only when reached from a completed checkout. If you
          have paid and landed here in error, reply to your Stripe receipt and the folio will be
          issued manually.
        </p>
        <Link href="/biohack-100" className="focus-ring link-underline text-sm text-text-secondary">
          Return to the public folio →
        </Link>
      </Shell>
    );
  }

  const verdict = await verifyCheckoutSession(sessionId);

  if (verdict.status === 'paid') {
    return (
      <Shell>
        <p className="text-label text-text-faint">Delivery · Verified</p>
        <h1 className="heading-section text-text-primary">The monograph is yours.</h1>
        <p className="text-body text-text-muted">
          Payment confirmed against Stripe
          {verdict.customerEmail ? ` for ${verdict.customerEmail}` : ''}. Your receipt is the
          permanent record of purchase — keep it, and this address will re-issue the folio.
        </p>
        <p className="border-l-2 border-border-strong pl-4 font-mono text-xs leading-relaxed tracking-wide text-text-faint">
          FOLIO NOT YET ATTACHED — the monograph file has not been supplied to this environment.
          Payment is verified; delivery is pending the operator attaching the document.
        </p>
      </Shell>
    );
  }

  const copy = {
    unpaid: {
      heading: 'Payment not completed.',
      body: 'Stripe reports this checkout session as unpaid. If you believe this is wrong, your Stripe receipt is the authority — reply to it and the folio will be issued manually.',
    },
    'not-found': {
      heading: 'Session not recognised.',
      body: 'Stripe has no record of this checkout session. Reach the monograph through a completed checkout.',
    },
    unconfigured: {
      heading: 'Delivery is not configured.',
      body: 'This environment has no Stripe credential, so no payment can be verified and no folio served. Nothing has been charged.',
    },
    error: {
      heading: 'Verification is temporarily unavailable.',
      body: 'Stripe could not be reached to confirm this purchase. Nothing has been charged twice — reload in a moment, and your receipt remains the record of purchase.',
    },
  }[verdict.status];

  return (
    <Shell>
      <p className="text-label text-text-faint">Delivery</p>
      <h1 className="heading-section text-text-primary">{copy.heading}</h1>
      <p className="text-body text-text-muted">{copy.body}</p>
      <Link href="/biohack-100" className="focus-ring link-underline text-sm text-text-secondary">
        Return to the public folio →
      </Link>
    </Shell>
  );
}
