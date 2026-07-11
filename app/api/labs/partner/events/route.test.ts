import { describe, expect, it } from 'vitest';
import { GET } from './route';
import { recordLabWebhookEvent } from '@/lib/lab-webhook-events';
import { createDemoToken, DEMO_PARTNER_ID } from '@/lib/lab-partner-oauth';

function req(query: string, headers?: Record<string, string>) {
  return new Request(`https://tnic.help/api/labs/partner/events${query}`, { headers });
}

describe('GET /api/labs/partner/events', () => {
  it('rejects requests with no Bearer token', async () => {
    const res = await GET(req('?order_ids=ord_1'));
    expect(res.status).toBe(401);
  });

  it('rejects requests with no order_ids filter, even with a valid token', async () => {
    const token = createDemoToken(DEMO_PARTNER_ID);
    const res = await GET(req('', { Authorization: `Bearer ${token}` }));
    expect(res.status).toBe(400);
  });

  it('rejects an invalid/foreign token', async () => {
    const res = await GET(
      req('?order_ids=ord_1', { Authorization: 'Bearer not-a-real-token' }),
    );
    expect(res.status).toBe(401);
  });

  it('never returns another order\'s payload when scoped by order_ids', async () => {
    const mine = recordLabWebhookEvent({
      order_id: 'ord_mine_1',
      panel_id: 'longevity-baseline',
      partner: DEMO_PARTNER_ID,
      entry_count: 1,
      import_payload: { secret: 'mine' },
    });
    recordLabWebhookEvent({
      order_id: 'ord_someone_else',
      panel_id: 'longevity-baseline',
      partner: DEMO_PARTNER_ID,
      entry_count: 1,
      import_payload: { secret: 'someone-elses-labs' },
    });

    const token = createDemoToken(DEMO_PARTNER_ID);
    const res = await GET(
      req(
        `?since=${new Date(0).toISOString()}&order_ids=ord_mine_1&partner_id=${DEMO_PARTNER_ID}`,
        { Authorization: `Bearer ${token}` },
      ),
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    const ids = data.events.map((e: { id: string }) => e.id);
    expect(ids).toContain(mine.id);
    expect(data.events.every((e: { order_id: string }) => e.order_id === 'ord_mine_1')).toBe(true);
  });
});
