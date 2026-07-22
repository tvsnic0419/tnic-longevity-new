import { NextResponse } from 'next/server';
import { getLabWebhookEventsSince } from '@/lib/lab-webhook-events';

export const runtime = 'nodejs';

/** Poll recent webhook completions — client matches against pending order_ids */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const since = url.searchParams.get('since') ?? new Date(0).toISOString();
  const orderIdsParam = url.searchParams.get('order_ids');
  const orderIds = orderIdsParam
    ? orderIdsParam.split(',').map((id) => id.trim()).filter(Boolean)
    : undefined;

  // Require an explicit order_ids filter. Without one, getLabWebhookEventsSince
  // returns EVERY caller's events — including the import_payload biomarker data —
  // out of the shared in-memory store, i.e. a cross-user health-data leak that
  // contradicts the site's privacy-first posture. A legitimate client is always
  // polling for its own pending orders, whose ids it received from the
  // authenticated POST /api/labs/partner/order response, so scoping to those ids
  // is the capability check that gates this endpoint.
  if (!orderIds || orderIds.length === 0) {
    return NextResponse.json(
      { ok: false, error: 'order_ids query parameter is required' },
      { status: 400 },
    );
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