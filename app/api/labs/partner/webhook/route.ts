import { NextResponse } from 'next/server';
import { requireSecretInProduction } from '@/lib/env';
import { parsePartnerJson, PARTNER_SCHEMA } from '@/lib/lab-partner-import';
import { recordLabWebhookEvent } from '@/lib/lab-webhook-events';

export const runtime = 'nodejs';

/**
 * Partner results webhook — validates secret, normalizes payload.
 * Partners POST tnic-lab-partner/v1 JSON when panel completes.
 */
export async function POST(request: Request) {
  const secret = process.env.LAB_WEBHOOK_SECRET;
  const missingSecret = requireSecretInProduction(secret, 'LAB_WEBHOOK_SECRET');
  if (missingSecret) {
    return NextResponse.json({ error: missingSecret.error }, { status: missingSecret.status });
  }

  const header = request.headers.get('x-tnic-webhook-secret');
  if (header !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = parsePartnerJson(body);

    if (result.entries.length === 0) {
      return NextResponse.json(
        { ok: false, schema: PARTNER_SCHEMA, errors: result.errors },
        { status: 422 },
      );
    }

    const orderId =
      typeof body === 'object' && body !== null && 'order_id' in body
        ? String((body as { order_id: unknown }).order_id)
        : undefined;

    const panelId =
      typeof body === 'object' && body !== null && 'panel_id' in body
        ? String((body as { panel_id: unknown }).panel_id)
        : result.meta.panel_id;

    const event = recordLabWebhookEvent({
      order_id: orderId,
      panel_id: panelId,
      partner: result.meta.partner,
      entry_count: result.entries.length,
      import_payload: body,
    });

    return NextResponse.json({
      ok: true,
      event: 'panel.complete',
      order_id: orderId,
      entries: result.entries,
      errors: result.errors,
      meta: result.meta,
      import_payload: typeof body === 'object' && body !== null ? body : undefined,
      event_id: event.id,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({
    schema: PARTNER_SCHEMA,
    method: 'POST',
    headers: { 'x-tnic-webhook-secret': 'required when LAB_WEBHOOK_SECRET is set' },
    description: 'Partner pushes completed panel results; clients poll GET /api/labs/partner/events for push-style delivery.',
  });
}