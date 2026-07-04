import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { PRODUCT_PICKS } from '@/lib/product-picks';

export const runtime = 'edge';

/**
 * Affiliate redirect layer. Resolves product by ID, then redirects to:
 *   affiliateUrl (if set) → purchaseUrl (fallback)
 * Add ?companion=true for GlyNAC-style companion products.
 */
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

  return NextResponse.redirect(dest, {
    status: 307,
    headers: {
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex',
    },
  });
}
