/**
 * Stripe Checkout Session verification — the delivery gate for Bio Bible.
 *
 * Stripe Payment Links take the money but do NOT deliver the file
 * (verified against docs.stripe.com/payment-links/post-payment, Sep 2026).
 * Stripe's only post-payment hooks are a confirmation message or a redirect,
 * and the redirect may carry `{CHECKOUT_SESSION_ID}`.
 *
 * So delivery works like this: the Payment Link redirects to
 * `/bio-bible/download?session_id={CHECKOUT_SESSION_ID}`, and this module asks
 * Stripe — server-side, with the secret key — whether that session is real and
 * actually paid. A fabricated or unpaid session id gets nothing.
 *
 * Deliberately dependency-free: a single authenticated GET against the Stripe
 * REST API. Adding the `stripe` SDK for one read would be ~600 kB of runtime
 * for no benefit, and this keeps the route Edge-compatible.
 *
 * The secret key is read from `process.env` at request time and never reaches
 * the client bundle. `server-only` isn't a dependency of this project, so the
 * guard below is explicit: importing this module into a client component
 * throws loudly instead of leaking a credential silently.
 */

if (typeof window !== 'undefined') {
  throw new Error(
    'lib/stripe-session is server-only — it reads STRIPE_SECRET_KEY and must never be imported into a client component.',
  );
}

const STRIPE_API = 'https://api.stripe.com/v1/checkout/sessions';

export type SessionVerdict =
  | { status: 'paid'; customerEmail: string | null }
  | { status: 'unpaid' }
  | { status: 'not-found' }
  | { status: 'unconfigured' }
  | { status: 'error' };

/** Stripe session ids are `cs_test_…` / `cs_live_…`. Reject anything else before spending a network call. */
function isPlausibleSessionId(id: string): boolean {
  return /^cs_(test|live)_[A-Za-z0-9]+$/.test(id);
}

export async function verifyCheckoutSession(sessionId: string): Promise<SessionVerdict> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return { status: 'unconfigured' };
  if (!isPlausibleSessionId(sessionId)) return { status: 'not-found' };

  let res: Response;
  try {
    res = await fetch(`${STRIPE_API}/${encodeURIComponent(sessionId)}`, {
      headers: { Authorization: `Bearer ${key}` },
      // A payment receipt must never be served from cache.
      cache: 'no-store',
    });
  } catch {
    return { status: 'error' };
  }

  if (res.status === 404) return { status: 'not-found' };
  if (!res.ok) return { status: 'error' };

  let session: { payment_status?: string; customer_details?: { email?: string | null } };
  try {
    session = (await res.json()) as typeof session;
  } catch {
    return { status: 'error' };
  }

  // `paid` is the only state that earns the file. `unpaid` and `no_payment_required`
  // both fall through deliberately — the latter would mean a 100%-off coupon,
  // which this product does not issue.
  if (session.payment_status !== 'paid') return { status: 'unpaid' };

  return { status: 'paid', customerEmail: session.customer_details?.email ?? null };
}
