import { NextResponse } from 'next/server';
import {
  createDemoToken,
  DEMO_PARTNER_ID,
  getResolvedPartner,
  validateDemoToken,
} from '@/lib/lab-partner-oauth';
import { exchangeLiveAuthCode, LONGEVITY_DIRECT_ID } from '@/lib/lab-partner-live';

export const runtime = 'nodejs';

/** Exchange authorization code for access token */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const code = typeof body.code === 'string' ? body.code : '';
    const partnerId = typeof body.partner_id === 'string' ? body.partner_id : DEMO_PARTNER_ID;

    if (!code) {
      return NextResponse.json({ error: 'code required' }, { status: 400 });
    }

    const partner = getResolvedPartner(partnerId);
    if (!partner) {
      return NextResponse.json({ error: 'Unknown partner' }, { status: 404 });
    }

    if (partnerId === DEMO_PARTNER_ID && code.startsWith('demo_')) {
      const access_token = createDemoToken(partnerId);
      const now = Date.now();
      return NextResponse.json({
        access_token,
        token_type: 'Bearer',
        expires_in: 3600,
        partner_id: partnerId,
        scope: 'labs.read orders.create',
        connected_at: new Date(now).toISOString(),
        expires_at: new Date(now + 3600_000).toISOString(),
      });
    }

    if (validateDemoToken(code, partnerId)) {
      const access_token = createDemoToken(partnerId);
      const now = Date.now();
      return NextResponse.json({
        access_token,
        token_type: 'Bearer',
        expires_in: 3600,
        partner_id: partnerId,
        connected_at: new Date(now).toISOString(),
        expires_at: new Date(now + 3600_000).toISOString(),
      });
    }

    if (partner.status === 'live' && partnerId === LONGEVITY_DIRECT_ID) {
      const tokenData = await exchangeLiveAuthCode(code, partnerId);
      const now = Date.now();
      const expiresIn = tokenData.expires_in * 1000;
      return NextResponse.json({
        access_token: tokenData.access_token,
        token_type: tokenData.token_type,
        expires_in: tokenData.expires_in,
        partner_id: partnerId,
        scope: tokenData.scope ?? partner.scopes.join(' '),
        connected_at: new Date(now).toISOString(),
        expires_at: new Date(now + expiresIn).toISOString(),
      });
    }

    return NextResponse.json({ error: 'Invalid or expired code' }, { status: 401 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Invalid request';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}