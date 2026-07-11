import { NextResponse } from 'next/server';
import { getLabWebhookEventsSince } from '@/lib/lab-webhook-events';
import { DEMO_PARTNER_ID, validateDemoToken } from '@/lib/lab-partner-oauth';
import { isLiveAccessToken } from '@/lib/lab-partner-live';

export const runtime = 'nodejs';

/**
 * Poll recent webhook completions — client matches against pending order_ids.
 *
 * Requires the caller's own OAuth Bearer token and an explicit, non-empty
 * order_ids filter: this in-memory log holds every partner's completed panel
 * results (real biomarker values), so an unauthenticated or unfiltered query
 * would leak other visitors' lab results.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const since = url.searchParams.get('since') ?? new Date(0).toISOString();
  const partnerId = url.searchParams.get('partner_id') ?? DEMO_PARTNER_ID;
  const orderIdsParam = url.searchParams.get('order_ids');
  const orderIds = orderIdsParam
    ? orderIdsParam.split(',').map((id) => id.trim()).filter(Boolean)
    : [];

  const auth = request.headers.get('authorization');
  const token = auth?.replace(/^Bearer\s+/i, '') ?? '';

  if (!token) {
    return NextResponse.json({ error: 'Bearer token required' }, { status: 401 });
  }
  if (orderIds.length === 0) {
    return NextResponse.json({ error: 'order_ids required' }, { status: 400 });
  }

  const authorized =
    (partnerId === DEMO_PARTNER_ID && validateDemoToken(token, partnerId)) ||
    isLiveAccessToken(token, partnerId);
  if (!authorized) {
    return NextResponse.json({ error: 'Invalid access token' }, { status: 401 });
  }

  const events = getLabWebhookEventsSince(since, orderIds);

  return NextResponse.json({
    ok: true,
    since,
    count: events.length,
    events: events.map((e) => ({
      id: e.id,
      order_id: e.order_id,
      panel_id: e.panel_id,
      partner: e.partner,
      completed_at: e.completed_at,
      entry_count: e.entry_count,
      import_payload: e.import_payload,
    })),
    note: 'Ephemeral in-memory store — events expire after 2h; use order/status as fallback.',
  });
}