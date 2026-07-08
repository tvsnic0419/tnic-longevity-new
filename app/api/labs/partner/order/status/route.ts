import { NextResponse } from 'next/server';
import {
  createDemoOrder,
  DEMO_PARTNER_ID,
  validateDemoToken,
} from '@/lib/lab-partner-oauth';
import {
  fetchLiveOrderStatus,
  isLiveAccessToken,
} from '@/lib/lab-partner-live';

export const runtime = 'nodejs';

/** Poll order status — live partner proxy or demo instant complete */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const orderId = url.searchParams.get('order_id') ?? '';
  const partnerId = url.searchParams.get('partner_id') ?? DEMO_PARTNER_ID;
  const auth = request.headers.get('authorization');
  const token = auth?.replace(/^Bearer\s+/i, '') ?? '';

  if (!orderId || !token) {
    return NextResponse.json({ error: 'order_id and Bearer token required' }, { status: 400 });
  }

  try {
    if (partnerId === DEMO_PARTNER_ID && validateDemoToken(token, partnerId)) {
      const panelId = orderId.split('_')[1] ?? 'longevity-baseline';
      const order = createDemoOrder(panelId);
      return NextResponse.json({ ok: true, ...order, order_id: orderId });
    }

    if (isLiveAccessToken(token, partnerId)) {
      const order = await fetchLiveOrderStatus(token, orderId, partnerId);
      return NextResponse.json({ ok: true, ...order });
    }

    return NextResponse.json({ error: 'Invalid access token' }, { status: 401 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Status check failed' },
      { status: 502 },
    );
  }
}