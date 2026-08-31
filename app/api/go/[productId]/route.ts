import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { track } from '@vercel/analytics/server';
import { PRODUCT_PICKS } from '@/lib/product-picks';
import { ANALYTICS_EVENTS } from '@/lib/analytics-events';
import { applyAffiliateTag } from '@/lib/affiliate';

export const runtime = 'edge';

/**
 * Affiliate redirect layer. Resolves product by ID, then redirects to:
 *   affiliateUrl (if set) → purchaseUrl (fallback)
 * Add ?companion=true for GlyNAC-style companion products.
 */
function safeRedirectUrl(value: string): URL | null {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return null;
    return url;
  } catch {
    return null;
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  const { productId } = await params;
  const pick = PRODUCT_PICKS[productId];

  if (!pick) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  const companion = new URL(req.url).searchParams.get('companion') === 'true';

  let dest: string;
  if (companion && pick.companionPurchase) {
    dest =
      pick.companionPurchase.affiliateUrl ??
      pick.companionPurchase.purchaseUrl;
  } else {
    dest = pick.affiliateUrl ?? pick.purchaseUrl;
  }

  // Attach the operator's affiliate identifier (Amazon tag / per-program rules).
  // No-op until configured, and never overwrites an id the destination already
  // carries — so hand-built affiliate URLs on a pick are left untouched.
  dest = applyAffiliateTag(dest);

  const safeDest = safeRedirectUrl(dest);
  if (!safeDest) {
    return NextResponse.json({ error: 'Invalid product destination' }, { status: 500 });
  }

  // First-party affiliate-click signal — the platform's primary revenue KPI.
  // Cookieless, records only the product and destination host (no visitor id),
  // and must never block or fail the redirect.
  try {
    await track(
      ANALYTICS_EVENTS.affiliateClick,
      { product: productId, destination: safeDest.host, companion },
      { headers: req.headers },
    );
  } catch {
    // Analytics is best-effort; the redirect is the contract.
  }

  return NextResponse.redirect(safeDest, {
    status: 307,
    headers: {
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex',
    },
  });
}
