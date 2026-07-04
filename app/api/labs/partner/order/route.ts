import { NextResponse } from 'next/server';
import {
  createDemoOrder,
  DEMO_PARTNER_ID,
  validateDemoToken,
} from '@/lib/lab-partner-oauth';
import {
  createLivePartnerOrder,
  isLiveAccessToken,
  LONGEVITY_DIRECT_ID,
} from '@/lib/lab-partner-live';

export const runtime = 'nodejs';

/** Create at-home panel order — demo returns import payload; live returns pending */
export async function POST(request: Request) {
  try {
    const auth = request.headers.get('authorization');
    const token = auth?.replace(/^Bearer\s+/i, '') ?? '';

    const body = await request.json();
    const panelId = typeof body.panel_id === 'string' ? body.panel_id : 'longevity-baseline';
    const partnerId = typeof body.partner_id === 'string' ? body.partner_id : DEMO_PARTNER_ID;

    if (!token) {
      return NextResponse.json({ error: 'Bearer token required' }, { status: 401 });
    }

    if (partnerId === DEMO_PARTNER_ID && validateDemoToken(token, partnerId)) {
      const order = createDemoOrder(panelId);
      return NextResponse.json({ ok: true, ...order });
    }

    if (partnerId === LONGEVITY_DIRECT_ID && isLiveAccessToken(token, partnerId)) {
      const order = await createLivePartnerOrder(token, panelId, partnerId);
      return NextResponse.json({ ok: true, ...order });
    }

    return NextResponse.json({ error: 'Invalid access token' }, { status: 401 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Invalid request' },
      { status: 400 },
    );
  }
}