/** Ephemeral in-memory webhook completion log — best-effort on warm serverless instances */

export interface LabWebhookEvent {
  id: string;
  order_id?: string;
  panel_id?: string;
  partner?: string;
  completed_at: string;
  entry_count: number;
  import_payload: unknown;
}

const MAX_EVENTS = 200;
const TTL_MS = 2 * 60 * 60 * 1000;

const events: LabWebhookEvent[] = [];

function prune() {
  const cutoff = Date.now() - TTL_MS;
  while (events.length > 0 && new Date(events[events.length - 1].completed_at).getTime() < cutoff) {
    events.pop();
  }
}

export function recordLabWebhookEvent(input: {
  order_id?: string;
  panel_id?: string;
  partner?: string;
  entry_count: number;
  import_payload: unknown;
}): LabWebhookEvent {
  prune();
  const event: LabWebhookEvent = {
    id: `evt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    order_id: input.order_id,
    panel_id: input.panel_id,
    partner: input.partner,
    completed_at: new Date().toISOString(),
    entry_count: input.entry_count,
    import_payload: input.import_payload,
  };
  events.unshift(event);
  if (events.length > MAX_EVENTS) events.pop();
  return event;
}

export function getLabWebhookEventsSince(
  since: string,
  orderIds?: string[],
): LabWebhookEvent[] {
  prune();
  const sinceMs = new Date(since).getTime();
  const idSet = orderIds?.length ? new Set(orderIds) : null;

  return events.filter((e) => {
    if (Number.isNaN(sinceMs) || new Date(e.completed_at).getTime() <= sinceMs) return false;
    if (idSet && e.order_id && !idSet.has(e.order_id)) return false;
    return true;
  });
}