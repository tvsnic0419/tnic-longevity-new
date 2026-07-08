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